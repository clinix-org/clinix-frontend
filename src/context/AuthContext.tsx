import React from "react";
import { useNavigate } from "react-router-dom";
import { clearAuthToken, getAuthToken, setAuthToken, setUnauthorizedHandler } from "../api";
import { authService } from "../services/authService";
import {
    AuthContext,
    type AccessRequirement,
    type AuthenticatedUser,
    type AuthStatus,
} from "./AuthContextValue";

const getSafeRedirectPath = (value?: unknown) => {
    if (typeof value !== "string" || !value.startsWith("/") || value.startsWith("//")) {
        return "/dashboard";
    }

    return value;
};

export const AuthContextProvider = ({ children }: { children: React.ReactNode }) => {
    const navigate = useNavigate();
    const [status, setStatus] = React.useState<AuthStatus>("idle");
    const [user, setUser] = React.useState<AuthenticatedUser | null>(null);
    const refreshPromiseRef = React.useRef<Promise<AuthenticatedUser | null> | null>(null);

    const clearSession = React.useCallback((nextStatus: AuthStatus = "unauthenticated") => {
        clearAuthToken();
        setUser(null);
        setStatus(nextStatus);
    }, []);

    const logout = React.useCallback((reason: "expired" | "manual" = "manual") => {
        clearSession("unauthenticated");

        if (window.location.pathname !== "/login") {
            navigate("/login", {
                replace: true,
                state: reason === "expired" ? { sessionExpired: true } : undefined,
            });
        }
    }, [clearSession, navigate]);

    const refreshSession = React.useCallback(async () => {
        if (!getAuthToken()) {
            clearSession("unauthenticated");
            return null;
        }

        if (refreshPromiseRef.current) {
            return refreshPromiseRef.current;
        }

        setStatus("loading");

        refreshPromiseRef.current = authService.getCurrentUser()
            .then(currentUser => {
                setUser(currentUser);
                setStatus("authenticated");
                return currentUser;
            })
            .catch(error => {
                const statusCode = error?.response?.status;

                if (statusCode === 401) {
                    clearSession("unauthenticated");
                    return null;
                }

                if (statusCode === 403) {
                    setUser(null);
                    setStatus("forbidden");
                    return null;
                }

                if (statusCode === 423) {
                    clearSession("forbidden");
                    return null;
                }

                setUser(null);
                setStatus("error");
                return null;
            })
            .finally(() => {
                refreshPromiseRef.current = null;
            });

        return refreshPromiseRef.current;
    }, [clearSession]);

    const login = React.useCallback(async (token: string, redirectTo?: unknown) => {
        authService.clearSession();
        setAuthToken(token);

        const currentUser = await refreshSession();
        if (currentUser) {
            navigate(getSafeRedirectPath(redirectTo), { replace: true });
        }
    }, [navigate, refreshSession]);

    React.useEffect(() => {
        setUnauthorizedHandler(statusCode => {
            if (statusCode === 403) {
                setStatus("forbidden");
                navigate("/403", { replace: true });
                return;
            }

            logout("expired");
        });

        return () => setUnauthorizedHandler(null);
    }, [logout, navigate]);

    React.useEffect(() => {
        if (status !== "idle") return;
        void refreshSession();
    }, [refreshSession, status]);

    const roles = React.useMemo(() => user?.roles ?? [], [user?.roles]);
    const permissions = React.useMemo(() => user?.permissions ?? [], [user?.permissions]);

    const hasRole = React.useCallback((role: string) => {
        const normalizedRole = role.replace(/^ROLE_/i, "").toUpperCase();
        return roles.some(currentRole => currentRole.toUpperCase() === normalizedRole);
    }, [roles]);

    const hasPermission = React.useCallback((permission: string) => {
        return permissions.includes(permission);
    }, [permissions]);

    const canAccess = React.useCallback((requirement?: AccessRequirement | string | string[]) => {
        if (!requirement) return true;

        if (typeof requirement === "string" || Array.isArray(requirement)) {
            const values = Array.isArray(requirement) ? requirement : [requirement];
            return values.every(hasPermission);
        }

        const requiredRoles = requirement.roles ?? [];
        const requiredPermissions = requirement.permissions ?? [];

        const hasRequiredRoles = requiredRoles.length === 0 || requiredRoles.some(hasRole);
        const hasRequiredPermissions = requiredPermissions.length === 0 || requiredPermissions.every(hasPermission);

        return hasRequiredRoles && hasRequiredPermissions;
    }, [hasPermission, hasRole]);

    const value = React.useMemo(() => ({
        status,
        user,
        roles,
        permissions,
        isAuthenticated: status === "authenticated",
        login,
        logout,
        refreshSession,
        hasRole,
        hasPermission,
        canAccess,
    }), [
        canAccess,
        hasPermission,
        hasRole,
        login,
        logout,
        permissions,
        refreshSession,
        roles,
        status,
        user,
    ]);

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
