import React, { createContext, useContext, useEffect, useState } from "react";
import { clearToken, getToken, saveToken } from "./storage";

const AuthCtx = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const t = await getToken();
      setToken(t);
      setLoading(false);
    })();
  }, []);

  const login = async (newToken) => {
    await saveToken(newToken);
    setToken(newToken);
  };

  const logout = async () => {
    await clearToken();
    setToken(null);
  };

  return (
    <AuthCtx.Provider value={{ token, loading, login, logout }}>
      {children}
    </AuthCtx.Provider>
  );
}

export function useAuth() {
  return useContext(AuthCtx);
}