"use client";
import React from "react";
import InnerPageCard from "@/components/layout/InnerPageCard";
import ConfigTabs from "./components/ConfigTabs";
import { usePathname } from "next/navigation";

export default function ConfigurationsLayout({ children }) {
    const pathname = usePathname();
    
    // Determine title based on path
    const getTitle = () => {
        if (pathname === "/admin/configurations") return "System Configurations";
        if (pathname === "/admin/configurations/app-images") return "App Images";
        if (pathname === "/admin/configurations/upload") return "Upload Icons & Images";
        return "Configurations";
    };

    return (
        <InnerPageCard title={getTitle()}>
            <ConfigTabs />
            {children}
        </InnerPageCard>
    );
}
