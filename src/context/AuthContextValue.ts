import React from "react";

export type AuthStatus =
    | "idle"
    | "loading"
    | "authenticated"
    | "unauthenticated"
    | "forbidden"
    | "error";

export interface AuthenticatedUser {
    id: number;
    name: string;
    email: string;
    emailMasked?: string;
    roles: string[];
    permissions: string[];
    accountStatus: "ACTIVE" | "LOCKED" | "INACTIVE";
    tenant?: string | null;
    unit?: string | null;
}

export interface LoginResponse {
    token: string;
}

export type AccessRequirement = {
    roles?: string[];
    permissions?: string[];
};

export interface AuthContextType {
    status: AuthStatus;
    user: AuthenticatedUser | null;
    roles: string[];
    permissions: string[];
    isAuthenticated: boolean;
    login: (token: string, redirectTo?: unknown) => Promise<void>;
    logout: (reason?: "expired" | "manual") => void;
    refreshSession: () => Promise<AuthenticatedUser | null>;
    hasRole: (role: string) => boolean;
    hasPermission: (permission: string) => boolean;
    canAccess: (requirement?: AccessRequirement | string | string[]) => boolean;
}

export const AuthContext = React.createContext<AuthContextType | null>(null);
