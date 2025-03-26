import { createContext, useState, useEffect } from 'react';
import { api } from '../api/axiosConfig.js';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        checkIfLoggedIn();
    }, []);

    const checkIfLoggedIn = async () => {
        try {
            const response = await api.post('/auth/checkIfLoggedIn', {}, {
                withCredentials: true
            });
            if (response.data.isLoggedIn) {
                setUser(response.data.user);
            }
        } catch (error) {
            setUser(null);
            console.error('Session check failed:', error.response?.data?.message || error.message);
        }
    };

    const login = async (email, password) => {
        try {
            const response = await api.post('/auth/login', {email,password}, {
                withCredentials: true
            });
            setUser(response.data);
            return { success: true, data: response.data };
        } catch (error) {
            const errorMessage = error.response?.data?.errorMessage || 'Login failed';
            console.error('Login error:', errorMessage);
            return { success: false, error: errorMessage };
        }
    };

    const register = async (email, password) => {
        try {
            const response = await api.post('/auth/register', {email, password}, {
                withCredentials: true
            });
            return { success: true, data: response.data };
        } catch (error) {
            const errorMessage = error.response?.data?.errorMessage || 'Registration failed';
            console.error('Registration error:', errorMessage);
            return { success: false, error: errorMessage };
        }
    };

    const logout = async () => {
        try {
            await api.delete('/auth/logout', {}, {
                withCredentials: true
            });
            setUser(null);
            return { success: true };
        } catch (error) {
            const errorMessage = error.response?.data?.errorMessage || 'Logout failed';
            console.error('Logout error:', errorMessage);
            return { success: false, error: errorMessage };
        }
    };

    const refreshToken = async () => {
        try {
            await api.post('/auth/refresh-token', {}, {
                withCredentials: true
            });
            await checkIfLoggedIn();
            return { success: true };
        } catch (error) {
            const errorMessage = error.response?.data?.errorMessage || 'Token refresh failed';
            console.error('Token refresh error:', errorMessage);
            return { success: false, error: errorMessage };
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, refreshToken }}>
            {children}
        </AuthContext.Provider>
    );
};