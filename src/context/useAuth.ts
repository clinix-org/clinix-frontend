import React from "react";
import { AuthContext } from "./AuthContextValue";

export const useAuth = () => {
    const context = React.useContext(AuthContext);

    if (!context) {
        throw new Error("useAuth must be used within an AuthContextProvider");
    }

    return context;
};
