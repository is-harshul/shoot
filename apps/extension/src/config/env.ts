const DEFAULT_API_BASE_URL = "http://localhost:8787/api/v1";

export const getApiBaseUrl = (): string => {
  const fromEnv = import.meta.env.VITE_API_BASE_URL;
  if (typeof fromEnv === "string" && fromEnv.trim().length > 0) {
    return fromEnv.trim().replace(/\/+$/, "");
  }
  return DEFAULT_API_BASE_URL;
};
