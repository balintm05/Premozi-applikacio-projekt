import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { AuthContext } from '../../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Musor from '../Musor';

// Mock dependencies
jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(),
}));

// Mock ThemeWrapper component
jest.mock('../../../layout/ThemeWrapper', () => {
  return ({ children, className }) => (
    <div data-testid="theme-wrapper" className={className}>
      {children}
    </div>
  );
});

// Setup fixed date for consistent testing
const mockCurrentDate = new Date('2023-05-15');
const originalDate = global.Date;

beforeAll(() => {
  global.Date = class extends Date {
    constructor(date) {
      if (date) {
        return new originalDate(date);
      }
      return mockCurrentDate;
    }
    static now() {
      return mockCurrentDate.getTime();
    }
  };
});

afterAll(() => {
  global.Date = originalDate;
});

describe('Musor Component', () => {
  const mockNavigate = jest.fn();
  const mockApi = {
    get: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    useNavigate.mockReturnValue(mockNavigate);
    // Reset document title
    document.title = '';
  });

  test('should show loading state initially', () => {
    mockApi.get.mockImplementation(() => new Promise(() => {})); // Never resolves to keep loading state

    render(
      <AuthContext.Provider value={{ api: mockApi }}>
        <Musor />
      </AuthContext.Provider>
    );

    expect(screen.getByTestId('theme-wrapper')).toHaveClass('betoltes');
    expect(screen.getByTestId('theme-wrapper').querySelector('.spinner')).toBeInTheDocument();
  });

  test('should handle API error', async () => {
    const errorMessage = 'Network error';
    mockApi.get.mockRejectedValueOnce(new Error(errorMessage));

    render(
      <AuthContext.Provider value={{ api: mockApi }}>
        <Musor />
      </AuthContext.Provider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('theme-wrapper')).toHaveClass('hiba');
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });

  test('should handle error message in API response', async () => {
    const errorMessage = 'Server error occurred';
    mockApi.get.mockResolvedValueOnce({ data: { errorMessage } });

    render(
      <AuthContext.Provider value={{ api: mockApi }}>
        <Musor />
      </AuthContext.Provider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('theme-wrapper')).toHaveClass('hiba');
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });

  test('should show message when no films with screenings in next 30 days', async () => {
    // Films with no screenings or screenings outside the 30-day window
    const mockFilms = [
      { id: 1, cim: 'Film 1', vetitesek: [] },
      { 
        id: 2, 
        cim: 'Film 2', 
        vetitesek: [{ 
          idopont: new Date(mockCurrentDate.getTime() + 31 * 24 * 60 * 60 * 1000).toISOString() 
        }] 
      }
    ];
    
    mockApi.get.mockResolvedValueOnce({ data: mockFilms });

    render(
      <AuthContext.Provider value={{ api: mockApi }}>
        <Musor />
      </AuthContext.Provider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('theme-wrapper')).toHaveClass('nincs-musor');
      expect(screen.getByText('Nincsenek vetítések a következő 30 napban.')).toBeInTheDocument();
    });
  });

  test('should render films with screenings in next 30 days', async () => {
    const mockFilms = [
      {
        id: 1,
        cim: 'Film 1',
        mufaj: 'Action',
        jatekido: 120,
        korhatar: '16',
        vetitesek: [
          { idopont: new Date(mockCurrentDate.getTime() + 5 * 24 * 60 * 60 * 1000).toISOString() }
        ],
        images: { relativePath: '/images/film1.jpg' }
      },
      {
        id: 2,
        cim: 'Film 2',
        mufaj: 'Comedy',
        jatekido: 90,
        korhatar: '12',
        vetitesek: [
          { idopont: new Date(mockCurrentDate.getTime() + 10 * 24 * 60 * 60 * 1000).toISOString() }
        ],
        images: { relativePath: '/images/film2.jpg' }
      }
    ];
    
    mockApi.get.mockResolvedValueOnce({ data: mockFilms });

    render(
      <AuthContext.Provider value={{ api: mockApi }}>
        <Musor />
      </AuthContext.Provider>
    );

    await waitFor(() => {
      expect(screen.getByText('Jelenlegi műsoraink')).toBeInTheDocument();
      expect(screen.getByText('Film 1')).toBeInTheDocument();
      expect(screen.getByText('Film 2')).toBeInTheDocument();
      expect(screen.getByText('Action | 120 perc')).toBeInTheDocument();
      expect(screen.getByText('Comedy | 90 perc')).toBeInTheDocument();
    });
  });

  test('should sort films by number of screenings', async () => {
    const mockFilms = [
      {
        id: 1,
        cim: 'Film with 1 screening',
        mufaj: 'Action',
        jatekido: 120,
        vetitesek: [
          { idopont: new Date(mockCurrentDate.getTime() + 5 * 24 * 60 * 60 * 1000).toISOString() }
        ]
      },
      {
        id: 2,
        cim: 'Film with 3 screenings',
        mufaj: 'Comedy',
        jatekido: 90,
        vetitesek: [
          { idopont: new Date(mockCurrentDate.getTime() + 1 * 24 * 60 * 60 * 1000).toISOString() },
          { idopont: new Date(mockCurrentDate.getTime() + 2 * 24 * 60 * 60 * 1000).toISOString() },
          { idopont: new Date(mockCurrentDate.getTime() + 3 * 24 * 60 * 60 * 1000).toISOString() }
        ]
      }
    ];
    
    mockApi.get.mockResolvedValueOnce({ data: mockFilms });

    render(
      <AuthContext.Provider value={{ api: mockApi }}>
        <Musor />
      </AuthContext.Provider>
    );

    await waitFor(() => {
      const filmElements = screen.getAllByText(/Film with/);
      // First film should be the one with 3 screenings (films are sorted by screening count)
      expect(filmElements[0]).toHaveTextContent('Film with 3 screenings');
      expect(filmElements[1]).toHaveTextContent('Film with 1 screening');
    });
  });

  test('should navigate to film details when film is clicked', async () => {
    const mockFilms = [
      {
        id: 123,
        cim: 'Test Film',
        mufaj: 'Action',
        jatekido: 120,
        vetitesek: [
          { idopont: new Date(mockCurrentDate.getTime() + 5 * 24 * 60 * 60 * 1000).toISOString() }
        ]
      }
    ];
    
    mockApi.get.mockResolvedValueOnce({ data: mockFilms });

    render(
      <AuthContext.Provider value={{ api: mockApi }}>
        <Musor />
      </AuthContext.Provider>
    );

    await waitFor(() => {
      expect(screen.getByText('Test Film')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Test Film').closest('.film-card'));
    
    expect(mockNavigate).toHaveBeenCalledWith('/musor/film/123');
  });

  test('should handle films with missing properties gracefully', async () => {
    const mockFilms = [
      {
        id: 1,
        cim: 'Film with missing properties',
        // Missing mufaj and jatekido
        vetitesek: [
          { idopont: new Date(mockCurrentDate.getTime() + 5 * 24 * 60 * 60 * 1000).toISOString() }
        ]
        // Missing images
      }
    ];
    
    mockApi.get.mockResolvedValueOnce({ data: mockFilms });

    render(
      <AuthContext.Provider value={{ api: mockApi }}>
        <Musor />
      </AuthContext.Provider>
    );

    await waitFor(() => {
      expect(screen.getByText('Film with missing properties')).toBeInTheDocument();
      // Should render without crashing even with missing properties
    });
  });

  test('should filter out films with no screenings in next 30 days', async () => {
    const mockFilms = [
      {
        id: 1,
        cim: 'Film in range',
        mufaj: 'Action',
        jatekido: 120,
        vetitesek: [
          { idopont: new Date(mockCurrentDate.getTime() + 5 * 24 * 60 * 60 * 1000).toISOString() }
        ]
      },
      {
        id: 2,
        cim: 'Film out of range',
        mufaj: 'Comedy',
        jatekido: 90,
        vetitesek: [
          { idopont: new Date(mockCurrentDate.getTime() + 35 * 24 * 60 * 60 * 1000).toISOString() }
        ]
      },
      {
        id: 3,
        cim: 'Film in past',
        mufaj: 'Drama',
        jatekido: 110,
        vetitesek: [
          { idopont: new Date(mockCurrentDate.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString() }
        ]
      }
    ];
    
    mockApi.get.mockResolvedValueOnce({ data: mockFilms });

    render(
      <AuthContext.Provider value={{ api: mockApi }}>
        <Musor />
      </AuthContext.Provider>
    );

    await waitFor(() => {
      expect(screen.getByText('Film in range')).toBeInTheDocument();
      expect(screen.queryByText('Film out of range')).not.toBeInTheDocument();
      expect(screen.queryByText('Film in past')).not.toBeInTheDocument();
    });
  });

  test('should set document title correctly', async () => {
    const mockFilms = [
      {
        id: 1,
        cim: 'Test Film',
        mufaj: 'Action',
        jatekido: 120,
        vetitesek: [
          { idopont: new Date(mockCurrentDate.getTime() + 5 * 24 * 60 * 60 * 1000).toISOString() }
        ]
      }
    ];
    
    mockApi.get.mockResolvedValueOnce({ data: mockFilms });

    render(
      <AuthContext.Provider value={{ api: mockApi }}>
        <Musor />
      </AuthContext.Provider>
    );

    await waitFor(() => {
      expect(document.title).toBe('Műsor - Premozi');
    });
  });

  test('should handle image errors gracefully', async () => {
    const mockFilms = [
      {
        id: 1,
        cim: 'Test Film',
        mufaj: 'Action',
        jatekido: 120,
        korhatar: '16',
        vetitesek: [
          { idopont: new Date(mockCurrentDate.getTime() + 5 * 24 * 60 * 60 * 1000).toISOString() }
        ]
      }
    ];
    
    mockApi.get.mockResolvedValueOnce({ data: mockFilms });

    render(
      <AuthContext.Provider value={{ api: mockApi }}>
        <Musor />
      </AuthContext.Provider>
    );

    await waitFor(() => {
      const ageRatingImg = screen.getByAltText('korhatár besorolás');
      expect(ageRatingImg).toBeInTheDocument();
      
      // Simulate image error
      fireEvent.error(ageRatingImg);
      
      // After error, the image should be hidden
      expect(ageRatingImg).toHaveStyle('display: none');
    });
  });
});
