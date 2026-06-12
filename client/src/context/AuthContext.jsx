import { createContext, useContext, useState, useEffect, useRef } from 'react';

const AuthContext = createContext();
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const AUTH_DEBUG = import.meta.env.DEV;

const logAuth = (...args) => {
  if (AUTH_DEBUG) console.log('[AuthContext]', ...args);
};

const parseAuthResponse = async (response) => {
  const data = await response.json().catch(() => ({}));

  if (response.ok) {
    return { ok: true, data };
  }

  let message = data.message;
  if (!message && Array.isArray(data.errors)) {
    message = data.errors.map((e) => e.msg || e.message).filter(Boolean).join('. ');
  }
  return { ok: false, error: message || 'Request failed', status: response.status };
};

const clearStoredAuth = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('user');
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const sessionEpochRef = useRef(0);

  const applyLogout = (reason) => {
    logAuth('logout', reason);
    clearStoredAuth();
    setToken(null);
    setUser(null);
  };

  const fetchUser = async (authToken, epoch) => {
    try {
      logAuth('fetchUser start', { tokenPreview: authToken?.slice(0, 12) + '...' });
      const response = await fetch(`${API_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      if (epoch !== sessionEpochRef.current) {
        logAuth('fetchUser ignored (stale session)');
        return;
      }

      const result = await parseAuthResponse(response);

      if (result.ok) {
        logAuth('fetchUser ok', {
          email: result.data.email,
          role: result.data.role,
          isActive: result.data.isActive,
        });
        setUser(result.data);
        localStorage.setItem('user', JSON.stringify(result.data));
      } else {
        logAuth('fetchUser failed', result.error, result.status);
        applyLogout('session_invalid');
      }
    } catch (err) {
      logAuth('fetchUser error', err.message);
      if (epoch === sessionEpochRef.current) {
        applyLogout('network_error');
      }
    } finally {
      if (epoch === sessionEpochRef.current) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (!storedToken) {
      applyLogout('no_token');
      setLoading(false);
      return;
    }

    const epoch = ++sessionEpochRef.current;
    setToken(storedToken);

    try {
      const cached = localStorage.getItem('user');
      if (cached) setUser(JSON.parse(cached));
    } catch {
      localStorage.removeItem('user');
    }

    fetchUser(storedToken, epoch);
  }, []);

  const persistSession = (data) => {
    const epoch = ++sessionEpochRef.current;
    logAuth('persistSession', {
      email: data.user?.email,
      role: data.user?.role,
      isActive: data.user?.isActive,
      tokenPreview: data.token?.slice(0, 12) + '...',
    });

    clearStoredAuth();
    localStorage.setItem('token', data.token);
    localStorage.setItem('refreshToken', data.refreshToken);
    localStorage.setItem('user', JSON.stringify(data.user));

    setToken(data.token);
    setUser(data.user);
    return data.user;
  };

  const login = async (email, password) => {
    applyLogout('pre_login');
    setLoading(true);

    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email.trim().toLowerCase(), password }),
    });

    const result = await parseAuthResponse(response);
    logAuth('login response', {
      ok: result.ok,
      error: result.error,
      status: result.status,
      user: result.data?.user,
    });

    setLoading(false);

    if (result.ok) {
      return { user: persistSession(result.data) };
    }
    return { error: result.error };
  };

  /** Public registration — customer portal only (no role in request body). */
  const registerCustomer = async (name, email, password, phone) => {
    applyLogout('pre_register_customer');
    const response = await fetch(`${API_URL}/auth/register/customer`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, phone }),
    });

    const result = await parseAuthResponse(response);
    if (result.ok) {
      return { user: persistSession(result.data) };
    }
    return { error: result.error };
  };

  const logout = () => {
    ++sessionEpochRef.current;
    applyLogout('user_logout');
    setLoading(false);
  };

  return (
    <AuthContext.Provider
      value={{ user, token, loading, login, registerCustomer, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
