/* eslint-disable @next/next/no-img-element */
"use client";
import NotFoundAnimation from "@/components/notFoundPage";
import React from "react";

function NotFound() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <NotFoundAnimation />{" "}
    </div>
  );
}

export default NotFound;
