import React, { createContext, useState, useEffect } from 'react';
import api from '../lib/axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await api.get('/api/auth/user/');
                setUser(res.data);
            } catch (err) {
                setUser(null);
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, []);

    const login = async (username, password) => {
        const res = await api.post('/api/auth/login/', { username, password });
        setUser(res.data.user);
    };

    const register = async (userData) => {
        const res = await api.post('/api/auth/register/', userData);
        setUser(res.data.user);
    };

    const logout = async () => {
        await api.post('/api/auth/logout/');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
