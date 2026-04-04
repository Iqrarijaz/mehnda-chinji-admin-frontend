"use client";
import React, { useState, useEffect } from "react";
import { ConfigProvider, theme as antdTheme } from "antd";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import { ToastContainer } from "react-toastify";
import MenuContextProvider from "@/context/MenuContext";
import { ThemeProvider, useTheme } from "@/context/ThemeContext";

function AntdConfigWrapper({ children }) {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div style={{ visibility: 'hidden' }}>{children}</div>;

  return (
    <ConfigProvider
      theme={{
        algorithm: theme === 'dark' ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
        token: {
          colorPrimary: "#006666",
          borderRadius: 4,
          fontFamily: "Poppins, sans-serif",
          colorBgContainer: theme === 'dark' ? "#1E293B" : "#ffffff",
          colorText: theme === 'dark' ? "#F8FAFC" : "#404040",
        },
      }}
    >
      <ToastContainer
        position="top-right"
        autoClose={3500}
        hideProgressBar={true}
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable={false}
        theme={theme === 'dark' ? 'dark' : 'light'}
      />
      {children}
    </ConfigProvider>
  );
}

export default function ClientProviders({ children }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
      },
    },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AntdConfigWrapper>
          <ReactQueryDevtools initialIsOpen={false} />
          <MenuContextProvider>{children}</MenuContextProvider>
        </AntdConfigWrapper>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
