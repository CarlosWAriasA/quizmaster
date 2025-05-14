import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY, USER_ID_KEY } from "./constants";
import { clearSession } from "./AuthHelper";

const API_URL = import.meta.env.VITE_API_URL;

interface RequestOptions {
  data?: unknown;
  token?: string;
  headers?: HeadersInit;
  retrying?: boolean;
}

async function baseRequest<T = unknown>(
  endpoint: string,
  options: RequestOptions = {},
  method: string
): Promise<T> {
  const { data, headers = {}, retrying = false, ...customConfig } = options;
  const token = localStorage.getItem(ACCESS_TOKEN_KEY);
  const config: RequestInit = {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    ...customConfig,
  };

  if (data !== undefined) {
    config.body = JSON.stringify(data);
  }

  const response = await fetch(`${API_URL}${endpoint}`, config);
  if (response.status === 401) {
    if (retrying) {
      clearSession();
      window.location.href = "/login?expired=true";
      throw new Error("Session expired. Redirecting to login...");
    }

    const newAccessToken = await tryRefreshToken();
    if (newAccessToken) {
      return baseRequest<T>(
        endpoint,
        {
          ...options,
          token: newAccessToken,
          retrying: true,
        },
        method
      );
    } else {
      clearSession();
      window.location.href = "/login?expired=true";
      throw new Error("Session expired. Redirecting to login...");
    }
  }

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || response.statusText);
  }

  const text = await response.text();
  return text ? (JSON.parse(text) as T) : ({} as T);
}

async function tryRefreshToken(): Promise<string | null> {
  const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
  const userId = localStorage.getItem(USER_ID_KEY);
  if (!refreshToken || !userId) return null;

  try {
    const res = await fetch(`${API_URL}Auth/refreshToken`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: Number(userId), refreshToken }),
    });
    if (!res.ok) return null;

    const data = await res.json();
    localStorage.setItem(ACCESS_TOKEN_KEY, data.accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, data.refreshToken);
    return data.accessToken;
  } catch {
    return null;
  }
}

export const RequestHelper = {
  get: <T = unknown>(endpoint: string, token?: string) =>
    baseRequest<T>(endpoint, { token }, "GET"),

  post: <T = unknown>(endpoint: string, data?: unknown, token?: string) =>
    baseRequest<T>(endpoint, { data, token }, "POST"),

  put: <T = unknown>(endpoint: string, data?: unknown, token?: string) =>
    baseRequest<T>(endpoint, { data, token }, "PUT"),

  delete: <T = unknown>(endpoint: string, token?: string) =>
    baseRequest<T>(endpoint, { token }, "DELETE"),
};
