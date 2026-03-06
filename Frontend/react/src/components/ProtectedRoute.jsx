import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";
import { setTokenInMemory } from "../Api";

function ProtectedRoute({ children }) {
    const [isChecking, setIsChecking] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const verifySession = async () => {
            const refresh = localStorage.getItem("refresh");
            
            if (!refresh) {
                setIsAuthenticated(false);
                setIsChecking(false);
                return;
            }

            try {
                // Fetch new access token on page reload
                const response = await axios.post("http://127.0.0.1:8000/refresh/", { refresh });
                
                setTokenInMemory(response.data.access);
                setIsAuthenticated(true);
            } catch (error) {
                console.error("Session expired or invalid refresh token");
                localStorage.removeItem("refresh");
                setTokenInMemory(null);
                setIsAuthenticated(false);
            } finally {
                setIsChecking(false);
            }
        };

        verifySession();
    }, []);

    if (isChecking) {
        return <div style={{ color: 'white', textAlign: 'center', marginTop: '50px' }}>Loading Session...</div>;
    }

    if (!isAuthenticated) {
        return <Navigate to="/Login" replace />;
    }

    return children;
}

export default ProtectedRoute;