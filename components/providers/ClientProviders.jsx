"use client";
import React, { useState } from "react";
import { ConfigProvider } from "antd";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import { ToastContainer } from "react-toastify";
import MenuContextProvider from "@/context/MenuContext";

export default function ClientProviders({ children }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
      },
    },
  }));

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#0F172A",
          borderRadius: 4,
          colorBgContainer: "#ffffff",
          fontFamily: "Poppins, sans-serif",
          fontSize: 16,
          colorText: "#404040",
        },
      }}
    >
      <QueryClientProvider client={queryClient}>
        <ReactQueryDevtools initialIsOpen={false} />
        <ToastContainer
          position="top-right"
          autoClose={3500}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          pauseOnHover
          draggable={false}
          theme="light"
        />
        <MenuContextProvider>{children}</MenuContextProvider>
      </QueryClientProvider>
    </ConfigProvider>
  );
}
