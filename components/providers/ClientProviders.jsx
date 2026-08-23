"use client";
import React, { useState, useEffect } from "react";
import { ConfigProvider, theme as antdTheme } from "antd";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
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
          borderRadius: 0,
          borderRadiusSM: 0,
          borderRadiusLG: 0,
          borderRadiusXS: 0,
          controlHeight: 40,
          controlHeightSM: 28,
          controlHeightLG: 46,
          boxShadow: "none",
          boxShadowSecondary: "none",
          boxShadowTertiary: "none",
          fontFamily: "Poppins, sans-serif",
          colorBgContainer: theme === 'dark' ? "#1E293B" : "#ffffff",
          colorText: theme === 'dark' ? "#F8FAFC" : "#404040",
        },
        components: {
          Button: {
            borderRadius: 0,
            borderRadiusSM: 0,
            borderRadiusLG: 0,
            controlHeight: 40,
            controlHeightSM: 28,
            controlHeightLG: 46,
            boxShadow: "none",
            primaryShadow: "none",
          },
          Input: {
            borderRadius: 0,
            borderRadiusSM: 0,
            borderRadiusLG: 0,
            controlHeight: 40,
            controlHeightSM: 28,
            controlHeightLG: 46,
            boxShadow: "none",
          },
          Select: {
            borderRadius: 0,
            borderRadiusSM: 0,
            borderRadiusLG: 0,
            controlHeight: 40,
            controlHeightSM: 28,
            controlHeightLG: 46,
            boxShadow: "none",
          },
          DatePicker: {
            borderRadius: 0,
            borderRadiusSM: 0,
            borderRadiusLG: 0,
            controlHeight: 40,
            controlHeightSM: 28,
            controlHeightLG: 46,
            boxShadow: "none",
          },
          Card: {
            borderRadius: 0,
            borderRadiusLG: 0,
            boxShadow: "none",
            boxShadowTertiary: "none",
          },
          Table: {
            borderRadius: 0,
            borderRadiusLG: 0,
            boxShadow: "none",
          },
          Modal: {
            borderRadius: 0,
            borderRadiusLG: 0,
            boxShadow: "none",
          },
          Dropdown: {
            borderRadius: 0,
            boxShadow: "none",
          },
          Popover: {
            borderRadius: 0,
            boxShadow: "none",
          },
          Tooltip: {
            borderRadius: 0,
            boxShadow: "none",
          },
        }
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
        toastClassName="!text-[12px]"
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
        staleTime: Infinity,
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
