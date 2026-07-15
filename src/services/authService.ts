import api, { clearAuthToken, setAuthToken } from "../api";
import type { AuthenticatedUser, LoginResponse } from "../context/AuthContextValue";

const normalizeToken = (token: string) => token.replace(/^Bearer\s+/i, "").trim();

export const authService = {
    async login(username: string, password: string) {
        const response = await api.post<LoginResponse>("/auth/login", {
            username,
            password,
        });

        const token = normalizeToken(response.data.token);
        setAuthToken(token);

        return token;
    },

    async getCurrentUser() {
        const response = await api.get<AuthenticatedUser>("/auth/me");
        return response.data;
    },

    clearSession() {
        clearAuthToken();
    },
};
