import { createContext, useState, useEffect, useCallback, useRef } from 'react';
import { api } from '../api/axiosConfig.js';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const refreshIntervalRef = useRef(null);
    const statusCheckIntervalRef = useRef(null);
    const isInitialized = useRef(false);
    const visibilityTimeoutRef = useRef(null);
    const activeRequests = useRef(new Set());
    const userRef = useRef(user);
    userRef.current = user;

    // Debug logging
    const debugLog = (message) => {
        console.debug(`[AuthContext] ${message} at:`, new Date().toISOString());
    };

    // Enhanced user state management with role tracking
    const updateUserState = useCallback((newUserData) => {
        const currentUser = userRef.current;

        // Check if role changed
        const roleChanged = currentUser?.role !== newUserData?.role;

        // Check if any user data actually changed
        const currentUserJson = JSON.stringify(currentUser);
        const newUserJson = JSON.stringify(newUserData);
        const userChanged = currentUserJson !== newUserJson;

        if (userChanged) {
            debugLog(`Updating user state ${roleChanged ? '(role changed)' : ''}`);
            setUser(newUserData);

            if (roleChanged) {
                debugLog(`User role changed from ${currentUser?.role} to ${newUserData?.role}`);
                // Here you could add any role-specific logic or event emitters
            }
        } else {
            debugLog('User state unchanged - skipping update');
        }
    }, []);

    const checkIfLoggedIn = useCallback(async () => {
        debugLog('checkIfLoggedIn initiated');
        const controller = new AbortController();
        activeRequests.current.add(controller);

        try {
            const response = await api.post('/auth/checkIfLoggedIn', {}, {
                withCredentials: true,
                signal: controller.signal
            });

            if (response.data.isLoggedIn) {
                debugLog('User logged in');
                updateUserState(response.data.user);
                return true;
            }
            debugLog('User not logged in');
            updateUserState(null);
            return false;
        } catch (error) {
            if (error.name !== 'CanceledError') {
                debugLog('Session check failed');
                console.error('Session check failed:', error.response?.data?.message || error.message);
                updateUserState(null);
            }
            return false;
        } finally {
            activeRequests.current.delete(controller);
        }
    }, [updateUserState]);

    const refreshToken = useCallback(async () => {
        if (isRefreshing) {
            debugLog('Refresh already in progress - skipping');
            return;
        }

        debugLog('Starting token refresh');
        setIsRefreshing(true);
        const controller = new AbortController();
        activeRequests.current.add(controller);

        try {
            await api.post('/auth/refresh-token', {}, {
                withCredentials: true,
                signal: controller.signal
            });

            if (!userRef.current) {
                debugLog('No user found - checking login status');
                await checkIfLoggedIn();
            }
        } catch (error) {
            if (error.name !== 'CanceledError') {
                debugLog('Token refresh failed');
                console.error('Token refresh failed:', error.response?.data?.errorMessage || error.message);
                stopAllIntervals();
                updateUserState(null);
            }
        } finally {
            activeRequests.current.delete(controller);
            setIsRefreshing(false);
        }
    }, [isRefreshing, checkIfLoggedIn]);


    const startTokenRefresh = useCallback(() => {
        if (!refreshIntervalRef.current) {
            debugLog('Starting token refresh interval');
            refreshToken();
            refreshIntervalRef.current = setInterval(refreshToken, 300 * 1000); // 5 minutes
        }
    }, [refreshToken]);

    const startStatusCheck = useCallback(() => {
        if (!statusCheckIntervalRef.current) {
            debugLog('Starting status check interval');
            checkIfLoggedIn();
            statusCheckIntervalRef.current = setInterval(checkIfLoggedIn, 300 * 1000); // 5 minutes
        }
    }, [checkIfLoggedIn]);

    const stopAllIntervals = useCallback(() => {
        debugLog('Stopping all intervals');
        if (refreshIntervalRef.current) {
            clearInterval(refreshIntervalRef.current);
            refreshIntervalRef.current = null;
        }
        if (statusCheckIntervalRef.current) {
            clearInterval(statusCheckIntervalRef.current);
            statusCheckIntervalRef.current = null;
        }
    }, []);

    const cancelAllRequests = useCallback(() => {
        debugLog('Canceling all pending requests');
        activeRequests.current.forEach(controller => controller.abort());
        activeRequests.current.clear();
    }, []);

    // Single initialization effect
    useEffect(() => {
        if (isInitialized.current) return;
        isInitialized.current = true;
        debugLog('Initializing auth');

        const initializeAuth = async () => {
            const isLoggedIn = await checkIfLoggedIn();
            if (isLoggedIn) {
                startTokenRefresh();
                startStatusCheck();
            }
        };

        initializeAuth();

        return () => {
            debugLog('Cleaning up auth initialization');
            stopAllIntervals();
            cancelAllRequests();
            clearTimeout(visibilityTimeoutRef.current);
        };
    }, [checkIfLoggedIn, startTokenRefresh, startStatusCheck, stopAllIntervals, cancelAllRequests]);

    // Visibility change effect - throttled
    useEffect(() => {
        if (!user) return;

        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible') {
                debugLog('Tab became visible - scheduling refresh');
                clearTimeout(visibilityTimeoutRef.current);
                visibilityTimeoutRef.current = setTimeout(() => {
                    refreshToken();
                }, 5000); // 5 second delay
            } else {
                debugLog('Tab hidden - clearing pending refresh');
                clearTimeout(visibilityTimeoutRef.current);
            }
        };

        window.addEventListener('visibilitychange', handleVisibilityChange);
        return () => {
            window.removeEventListener('visibilitychange', handleVisibilityChange);
            clearTimeout(visibilityTimeoutRef.current);
        };
    }, [user, refreshToken]);

    // Stable user state updates
    const stableSetUser = useCallback((newUser) => {
        const currentUser = userRef.current;
        const currentUserJson = JSON.stringify(currentUser);
        const newUserJson = JSON.stringify(newUser);

        if (currentUserJson !== newUserJson) {
            debugLog('Updating user state');
            setUser(newUser);
        } else {
            debugLog('User state unchanged - skipping update');
        }
    }, []);



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
    const hasRole = useCallback((role) => {
        return user?.role === role;
    }, [user]);

    const hasAnyRole = useCallback((roles) => {
        return roles.includes(user?.role);
    }, [user]);

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