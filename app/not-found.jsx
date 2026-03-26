"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Loading from "@/animations/homePageLoader";

export default function NotFound() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const isLogged = localStorage.getItem("userData");
    if (isLogged) {
      router.replace("/admin/dashboard");
    } else {
      router.replace("/");
    }
  }, [router]);

  if (!mounted) return null;
  return (
    <div className="flex items-center justify-center h-screen bg-gray-50">
        <Loading />
    </div>
  );
}
