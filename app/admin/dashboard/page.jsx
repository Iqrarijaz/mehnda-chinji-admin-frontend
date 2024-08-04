"use client";
import UseMount from "@/hooks/useMount";
import React from "react";

function DashBoard() {
  const isMounted = UseMount();
  return (
    isMounted && (
      <div>
        <h1>Home</h1>
      </div>
    )
  );
}

export default DashBoard;
