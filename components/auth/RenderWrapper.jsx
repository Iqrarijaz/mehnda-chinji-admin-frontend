"use client";
import React from "react";

const RenderWrapper = ({ permission, children }) => {
    if (!permission) return <>{children}</>;

    try {
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        const userRole = user?.role;
        const userPermissions = user?.permissions || [];

        // Super Admin or Admin has full access (or adjust as per requirement)
        if (userRole === "SUPER_ADMIN" || userRole === "ADMIN") {
            return <>{children}</>;
        }

        if (userPermissions.includes(permission)) {
            return <>{children}</>;
        }

        return null;
    } catch (e) {
        return null;
    }
};

export default RenderWrapper;
