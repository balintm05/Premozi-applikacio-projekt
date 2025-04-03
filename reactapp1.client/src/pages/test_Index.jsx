// Index.jsx
import { useEffect, useState } from 'react';
import './Index.css';
import "../../bootstrap/css/bootstrap.min.css";

const Index = () => {
  // Film adatok állapotban tárolása
  const [films, setFilms] = useState([]);
  
  // Adatok betöltése (mock adatok, később API-ról lehetne)
  useEffect(() => {
    const mockFilms = [
      {
        id: 3829,
        title: "Mickey 17",
        posterUrl: "https://images.ticketpoint.hu/plakat/med/lrCcovGRcuv8Z1v3ae1ZH5Ird05.jpg",
        genres: "Dráma, Sci-Fi, Vígjáték",
        ageRating: "16",
        trailerId: "6_cesfEyK-M"
      },
      {
        id: 3830,
        title: "Barbárok a szomszédba",
        posterUrl: "https://images.ticketpoint.hu/plakat/med/1liVBtKkK2NsaDCArLfawVUVbiy.jpg",
        genres: "Dráma, Vígjáték",
        ageRating: "12",
        trailerId: ""
      },
      // További filmek...
    ];
    
    setFilms(mockFilms);
  }, []);

  return (
    <div id="root">
      <div className="container" id="desktop-plakat">
        <div className="plakatholder" id="plakatholder">
          {films.map(film => (
            <FilmCard key={film.id} film={film} />
          ))}
        </div>
      </div>
    </div>
  );
};

// Film kártya komponens
const FilmCard = ({ film }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div 
      className={`flip-card ${isFlipped ? 'flipped' : ''}`} 
      itemid={film.id}
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <div className="flip-card-inner">
        {/* Előlap */}
        <div 
          className="flip-card-front test-shine" 
          style={{
            display: "flex", 
            justifyContent: "space-around", 
            alignItems: "flex-end", 
            backgroundImage: `url(${film.posterUrl})`,
            backgroundRepeat: "no-repeat",
            backgroundSize: "100% 100%"
          }}
        >
          <div className='py-3 w-100' style={{color: "#fff", background: "rgba(0,0,0, 0.7)", fontWeight: "bolder"}}>
            {film.title}
          </div>
        </div>

        {/* Hátlap */}
        <div className="flip-card-back film-youtube" yt={film.trailerId}>
          <div>
            <div 
              className="back-plakat-kep-szoveg text-center" 
              style={{
                backgroundImage: `url(${film.posterUrl})`,
                backgroundRepeat: "no-repeat",
                backgroundSize: "100% 100%"
              }}
            >
              <div className='back-items py-3 w-100' style={{color: "#fff", background: "rgba(0,0,0, 0.7)", fontWeight: "bolder"}}>
                <div className="flip-cim">{film.title}</div>
                
                <div className="mt-1" style={{fontWeight: "bolder"}}>
                  {film.genres}
                </div>
                
                {film.trailerId && (
                  <div className="mt-1" style={{fontWeight: "bolder"}}>
                    <img 
                      alt="youtube" 
                      style={{width: "75px"}} 
                      className="mt-1" 
                      src="/img/youtube.png" 
                    />
                    Előzetes
                  </div>
                )}
                <img 
                  alt="korhatár besorolás" 
                  className="w-75" 
                  src={`https://images.ticketpoint.hu/korhatar/(${film.ageRating}).png`}
                />
              </div>
            </div>
          </div>
          <div className="back-text"></div>
        </div>
      </div>
    </div>
  );
};

export default Index;