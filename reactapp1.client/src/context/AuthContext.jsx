import { createContext, useState, useEffect, useCallback, useRef } from 'react';
import { api } from '../api/axiosConfig.js';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const refreshIntervalRef = useRef(null);
    const statusCheckIntervalRef = useRef(null);
    const isInitialMount = useRef(true);

    const checkIfLoggedIn = useCallback(async () => {
        try {
            const response = await api.post('/auth/checkIfLoggedIn', {}, {
                withCredentials: true
            });
            if (response.data.isLoggedIn) {
                setUser(response.data.user);
                return true;
            }
            setUser(null);
            return false;
        } catch (error) {
            setUser(null);
            console.error('Session check failed:', error.response?.data?.message || error.message);
            return false;
        }
    }, []);

    const refreshToken = useCallback(async () => {
        try {
            await api.post('/auth/refresh-token', {}, {
                withCredentials: true
            });
        } catch (error) {
            console.error('Token refresh failed:', error.response?.data?.errorMessage || error.message);
            stopAllIntervals();
        }
    }, []);

    const startTokenRefresh = useCallback(() => {
        refreshToken();
        refreshIntervalRef.current = setInterval(refreshToken, 300 * 1000); 
    }, [refreshToken]);

    const startStatusCheck = useCallback(() => {
        statusCheckIntervalRef.current = setInterval(checkIfLoggedIn, 300 * 1000); 
    }, [checkIfLoggedIn]);

    const stopAllIntervals = useCallback(() => {
        if (refreshIntervalRef.current) {
            clearInterval(refreshIntervalRef.current);
            refreshIntervalRef.current = null;
        }
        if (statusCheckIntervalRef.current) {
            clearInterval(statusCheckIntervalRef.current);
            statusCheckIntervalRef.current = null;
        }
    }, []);

    useEffect(() => {
        const initializeAuth = async () => {
            const isLoggedIn = await checkIfLoggedIn();
            if (isLoggedIn) {
                startTokenRefresh();
                startStatusCheck();
            }
        };

        initializeAuth();

        return () => {
            stopAllIntervals();
        };
    }, [checkIfLoggedIn, startTokenRefresh, startStatusCheck, stopAllIntervals]);

    useEffect(() => {
        const handleFocus = () => {
            checkIfLoggedIn();
        };

        window.addEventListener('focus', handleFocus);
        return () => {
            window.removeEventListener('focus', handleFocus);
        };
    }, [checkIfLoggedIn]);

    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
            return;
        }

        if (user) {
            startTokenRefresh();
            startStatusCheck();
        } else {
            stopAllIntervals();
        }
    }, [user, startTokenRefresh, startStatusCheck, stopAllIntervals]);

    const login = async (email, password) => {
        try {
            const response = await api.post('/auth/login', { email, password }, {
                withCredentials: true
            });

            if (response.data.requires2FA) {
                return {
                    success: true,
                    requires2FA: true,
                    userId: response.data.userId
                };
            }

            await checkIfLoggedIn();
            return { success: true, data: response.data };
        } catch (error) {
            const errorMessage = error.response?.data?.errorMessage || 'Login failed';
            console.error('Login error:', errorMessage);
            return { success: false, error: errorMessage };
        }
    };

    const verify2FA = async (code, userId) => {
        try {
            const response = await api.post('/auth/verify-email-2fa', { code, userId }, {
                withCredentials: true
            });
            await checkIfLoggedIn(true);
            return { success: true, data: response.data };
        } catch (error) {
            const errorMessage = error.response?.data?.errorMessage || '2FA verification failed';
            console.error('2FA error:', errorMessage);
            return { success: false, error: errorMessage };
        }
    };


    const resend2FACode = async (userId) => {
        try {
            const response = await api.post('/auth/resend-2fa-code', { userId }, {
                withCredentials: true
            });
            return { success: true, data: response.data };
        } catch (error) {
            const errorMessage = error.response?.data?.errorMessage || 'Failed to resend 2FA code';
            console.error('Resend 2FA error:', errorMessage);
            return { success: false, error: errorMessage };
        }
    };

    const enableEmail2FA = async () => {
        try {
            const response = await api.post('/auth/enable-email-2fa', {}, {
                withCredentials: true
            });
            return { success: true, data: response.data };
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Failed to enable 2FA';
            console.error('Enable 2FA error:', errorMessage);
            return { success: false, error: errorMessage };
        }
    };

    const disableEmail2FA = async (password) => {
        try {
            const userId = user?.userId;
            const response = await api.post('/auth/disable-email-2fa', {
                userId,
                password
            }, {
                withCredentials: true
            });
            return { success: true, data: response.data };
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Failed to disable 2FA';
            console.error('Disable 2FA error:', errorMessage);
            return { success: false, error: errorMessage };
        }
    };

    const register = async (email, password) => {
        try {
            const response = await api.post('/auth/register', { email, password }, {
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
            await checkIfLoggedIn(true);
            return { success: true };
        } catch (error) {
            const errorMessage = error.response?.data?.errorMessage || 'Logout failed';
            console.error('Logout error:', errorMessage);
            return { success: false, error: errorMessage };
        }
    };

    return (
        <AuthContext.Provider value={{
            user,
            login,
            register,
            logout,
            verify2FA,
            resend2FACode,
            enableEmail2FA,
            disableEmail2FA
        }}>
            {children}
        </AuthContext.Provider>
    );
};