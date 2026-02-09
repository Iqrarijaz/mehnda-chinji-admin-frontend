"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Loading from "@/animations/homePageLoader";
import { useSession } from "@/context/SessionContext";

const AuthGuard = ({ children }) => {
    const router = useRouter();
    const [authorized, setAuthorized] = useState(false);
    const { handleSessionExpired } = useSession();

    useEffect(() => {
        const checkAuth = () => {
            const userData = localStorage.getItem("userData");
            if (!userData) {
                // Use the custom session expired modal
                handleSessionExpired();
            } else {
                setAuthorized(true);
            }
        };

        checkAuth();
    }, [router, handleSessionExpired]);

    if (!authorized) {
        return (
            <div className="flex items-center justify-center h-screen bg-[#0F172A]">
                <Loading />
            </div>
        );
    }

    return <>{children}</>;
};

export default AuthGuard;
