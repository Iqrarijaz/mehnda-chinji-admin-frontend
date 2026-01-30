import MainLayout from "@/components/layout/MainLayout";
import React from "react";

import AuthGuard from "@/components/auth/AuthGuard";

function DashboardLayout({ children }) {
  return (
    <AuthGuard>
      <MainLayout>{children}</MainLayout>
    </AuthGuard>
  );
}

export default DashboardLayout;
