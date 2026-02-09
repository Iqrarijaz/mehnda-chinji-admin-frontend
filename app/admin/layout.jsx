import MainLayout from "@/components/layout/MainLayout";
import React from "react";

import AuthGuard from "@/components/auth/AuthGuard";
import { SessionProvider } from "@/context/SessionContext";

function DashboardLayout({ children }) {
  return (
    <SessionProvider>
      <AuthGuard>
        <MainLayout>{children}</MainLayout>
      </AuthGuard>
    </SessionProvider>
  );
}

export default DashboardLayout;
