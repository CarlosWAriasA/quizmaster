import { useState, useEffect, ReactNode } from "react";
import { RequestHelper } from "../utils/RequestHelper";
import { AuthContext } from "../context/AuthContext";
import {
  ACCESS_TOKEN_KEY,
  REFRESH_TOKEN_KEY,
  USER_ID_KEY,
} from "../utils/constants";
import { useNavigate } from "react-router-dom";

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loadingSession, setLoadingSession] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      const valid = await isTokenValid();
      setIsAuthenticated(valid);
      setTimeout(() => {
        setLoadingSession(false);
      }, 1000);
    };

    checkSession();
  }, []);

  const isTokenValid = async (): Promise<boolean> => {
    const token = localStorage.getItem(ACCESS_TOKEN_KEY);
    if (!token) return false;

    try {
      await RequestHelper.get("Auth/validateToken", token);
      return true;
    } catch {
      return false;
    }
  };

  const login = async (email: string, password: string) => {
    const data = await RequestHelper.post<{
      accessToken: string;
      refreshToken: string;
      userId: number;
    }>("Auth/login", { email, password });

    localStorage.setItem(ACCESS_TOKEN_KEY, data.accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, data.refreshToken);
    localStorage.setItem(USER_ID_KEY, String(data.userId));
    setIsAuthenticated(true);
  };

  const register = async (
    userName: string,
    email: string,
    password: string
  ) => {
    await RequestHelper.post("Auth/register", {
      userName,
      email,
      password,
    });
  };

  const logout = () => {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_ID_KEY);
    setIsAuthenticated(false);
    navigate("/login", { replace: true });
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, login, register, logout, loadingSession }}
    >
      {children}
    </AuthContext.Provider>
  );
};
