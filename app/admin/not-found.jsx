"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Loading from "@/animations/homePageLoader";

export default function NotFound() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // If route is invalid inside /admin, return to dashboard
    router.replace("/admin/dashboard");
  }, [router]);

  if (!mounted) return null;
  return (
    <div className="flex items-center justify-center h-screen bg-[#0F172A]">
        <Loading />
    </div>
  );
}
