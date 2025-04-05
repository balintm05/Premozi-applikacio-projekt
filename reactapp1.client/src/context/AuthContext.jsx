import { createContext, useState, useEffect, useCallback, useRef } from 'react';
import { api } from '../api/axiosConfig.js';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const activeRequests = useRef(new Set());
    const userRef = useRef(user);
    const isInitialized = useRef(false);
    const [loading, setLoading] = useState(true);
    userRef.current = user;

    const debugLog = (message) => {
        console.debug(`[AuthContext] ${message} at:`, new Date().toISOString());
    };

    const updateUserState = useCallback((newUserData) => {
        const currentUserJson = JSON.stringify(userRef.current);
        const newUserJson = JSON.stringify(newUserData);

        if (currentUserJson !== newUserJson) {
            debugLog('Updating user state');
            setUser(newUserData);
        }
    }, []);

    const cancelAllRequests = useCallback(() => {
        debugLog('Cancelling all pending requests');
        activeRequests.current.forEach(controller => {
            if (!controller.signal.aborted) {
                controller.abort();
            }
        });
        activeRequests.current.clear();
    }, []);

    const checkAuthStatus = useCallback(async () => {
        setLoading(true);
        const controller = new AbortController();
        activeRequests.current.add(controller);

        try {
            const response = await api.post('/auth/checkIfLoggedIn', {}, {
                withCredentials: true,
                signal: controller.signal
            });

            if (response.data.isLoggedIn) {
                debugLog('User authenticated');
                updateUserState(response.data.user);
                return true;
            }

            debugLog('User not authenticated');
            updateUserState(null);
            return false;
        } catch (error) {
            if (error.name !== 'CanceledError') {
                debugLog('Authentication check failed');
                updateUserState(null);
            }
            return false;
        } finally {
            setLoading(false);
            activeRequests.current.delete(controller);
        }
    }, [updateUserState]);


    const logout = useCallback(async () => {
        try {
            await api.delete('/auth/logout', {}, {
                withCredentials: true
            });
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            updateUserState(null);
            cancelAllRequests();
        }
    }, [updateUserState, cancelAllRequests]);

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

            await checkAuthStatus();
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
            await checkAuthStatus();
            return { success: true, data: response.data };
        } catch (error) {
            const errorMessage = error.response?.data?.errorMessage || '2FA verification failed';
            console.error('2FA error:', errorMessage);
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
            const response = await api.post('/auth/disable-email-2fa', {
                userId: user?.userId,
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

    const hasRole = useCallback((role) => user?.role === role, [user]);
    const hasAnyRole = useCallback((roles) => roles.includes(user?.role), [user]);

    useEffect(() => {
        if (isInitialized.current) return;
        isInitialized.current = true;

        const initializeAuth = async () => {
            debugLog('Initializing authentication');
            await checkAuthStatus();
        };

        initializeAuth();

        return () => {
            cancelAllRequests();
        };
    }, [checkAuthStatus, cancelAllRequests]);

    return (
        <AuthContext.Provider value={{
            api,
            user,
            login,
            logout,
            register,
            verify2FA,
            resend2FACode,
            enableEmail2FA,
            disableEmail2FA,
            hasRole,
            hasAnyRole
        }}>
            {children}
        </AuthContext.Provider>
    );
};