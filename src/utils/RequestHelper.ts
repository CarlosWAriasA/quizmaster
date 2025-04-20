const API_URL = import.meta.env.VITE_API_URL;

interface RequestOptions {
  data?: unknown;
  token?: string;
  headers?: HeadersInit;
  retrying?: boolean;
}

async function baseRequest<T = unknown>(
  endpoint: string,
  {
    data,
    token,
    headers = {},
    retrying = false,
    ...customConfig
  }: RequestOptions = {},
  method: string
): Promise<T> {
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

  if (response.status === 401 && !retrying) {
    const newAccessToken = await tryRefreshToken();
    if (newAccessToken) {
      return baseRequest<T>(
        endpoint,
        { data, token: newAccessToken, headers, retrying: true },
        method
      );
    } else {
      throw new Error("Session expired. Please log in again.");
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
  const refreshToken = localStorage.getItem("refreshToken");
  const userId = localStorage.getItem("userId");
  if (!refreshToken || !userId) return null;

  try {
    const res = await fetch(`${API_URL}/api/auth/refreshToken`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: Number(userId), refreshToken }),
    });

    if (!res.ok) return null;

    const data = await res.json();
    localStorage.setItem("accessToken", data.accessToken);
    localStorage.setItem("refreshToken", data.refreshToken);
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

  del: <T = unknown>(endpoint: string, token?: string) =>
    baseRequest<T>(endpoint, { token }, "DELETE"),
};
