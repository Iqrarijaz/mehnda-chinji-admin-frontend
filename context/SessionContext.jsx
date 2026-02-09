"use client";
import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import SessionExpiredModal from "@/components/shared/SessionExpiredModal";
import { setSessionExpiredCallback } from "@/interceptors";

const SessionContext = createContext();

export const useSession = () => {
    const context = useContext(SessionContext);
    if (!context) {
        throw new Error("useSession must be used within a SessionProvider");
    }
    return context;
};

export function SessionProvider({ children }) {
    const [isSessionExpired, setIsSessionExpired] = useState(false);

    const handleSessionExpired = useCallback(() => {
        setIsSessionExpired(true);
    }, []);

    const closeSessionModal = useCallback(() => {
        setIsSessionExpired(false);
    }, []);

    // Register the session expired callback with axios interceptor
    useEffect(() => {
        setSessionExpiredCallback(handleSessionExpired);
        return () => {
            setSessionExpiredCallback(null);
        };
    }, [handleSessionExpired]);

    return (
        <SessionContext.Provider value={{ handleSessionExpired, isSessionExpired }}>
            {children}
            <SessionExpiredModal
                isOpen={isSessionExpired}
                onClose={closeSessionModal}
            />
        </SessionContext.Provider>
    );
}

export default SessionProvider;
