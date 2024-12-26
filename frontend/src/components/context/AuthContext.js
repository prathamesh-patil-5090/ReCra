import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        // Initialize user state from localStorage
        const savedUser = localStorage.getItem('user');
        return savedUser ? JSON.parse(savedUser) : null;
    });

    // Update localStorage when user state changes
    useEffect(() => {
        if (user) {
            localStorage.setItem('user', JSON.stringify(user));
        } else {
            localStorage.removeItem('user');
        }
    }, [user]);

    const login = async (credentials) => {
        try {
            // Here you would typically make an API call to your backend
            // For now, we'll simulate a successful login
            const userData = {
                email: credentials.email,
                // Don't store sensitive data like passwords
                firstName: credentials.firstName || 'User',
                lastName: credentials.lastName || '',
                // Add any other relevant user data
                token: 'dummy-jwt-token' // You'd get this from your backend
            };
            
            setUser(userData);
            return userData;
        } catch (error) {
            throw new Error(error.message || 'Login failed');
        }
    };

    const signup = async (userData) => {
        try {
            // Here you would typically make an API call to your backend
            const newUser = {
                email: userData.email,
                firstName: userData.firstName,
                lastName: userData.lastName,
                token: 'dummy-jwt-token'
            };
            
            setUser(newUser);
            return newUser;
        } catch (error) {
            throw new Error(error.message || 'Signup failed');
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
    };

    const value = {
        user,
        isAuthenticated: !!user,
        login,
        logout,
        signup
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use the auth context
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export default AuthContext;
