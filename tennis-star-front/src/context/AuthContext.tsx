'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/axios';

export type UserRole = 'ADMIN' | 'STAFF' | 'CLIENTE';

interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isStaff: boolean;
  isCliente: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  role: 'ADMIN' | 'STAFF' | 'CLIENTE';
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const isAuthenticated = !!user;
  const isAdmin = user?.role === 'ADMIN';
  const isStaff = user?.role === 'STAFF';
  const isCliente = user?.role === 'CLIENTE';

  // Guardar token en localStorage y cookies
  const setToken = (token: string) => {
    localStorage.setItem('token', token);
    document.cookie = `token=${token}; path=/; max-age=86400`; // 24 horas
  };

  // Eliminar token
  const removeToken = () => {
    localStorage.removeItem('token');
    document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
  };

  // Verificar autenticación al cargar
  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }

      const response = await api.get('/auth/profile');
      setUser(response.data);
    } catch (error) {
      console.error('Error verificando autenticación:', error);
      removeToken();
    } finally {
      setLoading(false);
    }
  };

  // Login
  const login = async (email: string, password: string) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { user: userData, token } = response.data;
      
      setToken(token);
      setUser(userData);
      
      // Redirección basada en rol
      if (userData.role === 'ADMIN') {
        window.location.href = '/dashboard/inventory';
      } else if (userData.role === 'STAFF') {
        window.location.href = '/dashboard/sales';
      } else if (userData.role === 'CLIENTE') {
        window.location.href = '/dashboard/catalog';
      }
    } catch (error: any) {
      console.error('Error en login:', error);
      const message = error.response?.data?.message || 'Error al iniciar sesión';
      throw new Error(message);
    }
  };

  // Registro
  const register = async (userData: RegisterData) => {
    try {
      const response = await api.post('/auth/register', userData);
      const { user: newUser, token } = response.data;
      
      setToken(token);
      setUser(newUser);
      
      // Redirección basada en rol
      if (newUser.role === 'ADMIN') {
        window.location.href = '/dashboard/inventory';
      } else if (newUser.role === 'STAFF') {
        window.location.href = '/dashboard/sales';
      } else if (newUser.role === 'CLIENTE') {
        window.location.href = '/dashboard/catalog';
      }
    } catch (error: any) {
      console.error('Error en registro:', error);
      const message = error.response?.data?.message || 'Error al registrar usuario';
      throw new Error(message);
    }
  };

  // Logout
  const logout = () => {
    removeToken();
    setUser(null);
    window.location.href = '/login';
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated,
        isAdmin,
        isStaff,
        isCliente,
        login,
        register,
        logout,
        checkAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
