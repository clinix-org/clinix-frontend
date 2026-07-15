import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";
import { env } from "./config/env";

const TOKEN_STORAGE_KEY = "token";
type UnauthorizedHandler = (status: 401 | 403) => void;

let unauthorizedHandler: UnauthorizedHandler | null = null;

const api = axios.create({
    baseURL: env.apiUrl,
    withCredentials: true,
});

export const setUnauthorizedHandler = (handler: UnauthorizedHandler | null) => {
    unauthorizedHandler = handler;
};

export const getAuthToken = () => localStorage.getItem(TOKEN_STORAGE_KEY);

export const setAuthToken = (token: string) => {
    localStorage.setItem(TOKEN_STORAGE_KEY, token.replace(/^Bearer\s+/i, "").trim());
};

export const clearAuthToken = () => {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
};

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    const token = getAuthToken();
    if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

api.interceptors.response.use(
    response => response,
    (error: AxiosError) => {
        if (error.response?.status === 401) {
            unauthorizedHandler?.(401);
        }

        if (error.response?.status === 403) {
            unauthorizedHandler?.(403);
        }

        return Promise.reject(error);
    },
);

export default api;
