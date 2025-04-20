import { useState, useEffect, ReactNode } from "react";
import { RequestHelper } from "../utils/RequestHelper";
import { AuthContext } from "../context/AuthContext";

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    setIsAuthenticated(!!token);
  }, []);

  const login = async (username: string, password: string) => {
    const data = await RequestHelper.post<{
      accessToken: string;
      refreshToken: string;
      userId: number;
    }>("/api/auth/login", { userName: username, password });

    localStorage.setItem("accessToken", data.accessToken);
    localStorage.setItem("refreshToken", data.refreshToken);
    localStorage.setItem("userId", String(data.userId));
    setIsAuthenticated(true);
  };

  const register = async (
    fullName: string,
    email: string,
    password: string
  ) => {
    await RequestHelper.post("/api/auth/register", {
      fullName,
      email,
      password,
    });
  };

  const logout = () => {
    localStorage.clear();
    setIsAuthenticated(false);
    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
