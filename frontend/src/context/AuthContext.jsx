import React, { createContext, useContext, useEffect, useState } from "react";
import { getMe, loginUser } from "../api/authApi";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const loadUser = async () => {
        const token = localStorage.getItem("token");

        console.log("token is", token);

        if (!token) {
            setLoading(false);
            return;
        }

        try {
            const response = await getMe();

            console.log("getMe response:", response);
            console.log("getMe user:", response.data.data.user);

            setUser(response.data.data.user);
        } catch (error) {
            console.error("Load user error:", error);

            localStorage.removeItem("token");
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadUser();
    }, []);

    const login = async (credentials) => {
        const response = await loginUser(credentials);

        console.log("login response:", response);

        localStorage.setItem("token", response.data.data.token);

        setUser(response.data.data.user);

        return response;
    };

    const logout = () => {
        localStorage.removeItem("token");
        setUser(null);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                setUser,
                login,
                logout,
                loading,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);

