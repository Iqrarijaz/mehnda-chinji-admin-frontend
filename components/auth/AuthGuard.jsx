"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Modal } from "antd";
import Loading from "@/animations/homePageLoader";

const AuthGuard = ({ children }) => {
    const router = useRouter();
    const [authorized, setAuthorized] = useState(false);

    useEffect(() => {
        const checkAuth = () => {
            const userData = localStorage.getItem("userData");
            if (!userData) {
                Modal.warning({
                    title: "Session Expired",
                    content: "Your session has expired. Please log in again.",
                    centered: true,
                    onOk() {
                        router.push("/");
                    },
                });
            } else {
                setAuthorized(true);
            }
        };

        checkAuth();
    }, [router]);

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
