"use client";
import React, { createContext, useState, useEffect } from "react";

export const MenuContext = createContext();

const MenuContextProvider = ({ children }) => {
  const [open, setOpen] = useState(true); // Default to true for desktop
  const [isInitialized, setIsInitialized] = useState(false);
  const [activeSubMenu, setActiveSubMenu] = useState(null);
  const [selectedMenu, setSelectedMenu] = useState(null);

  // Persistence and Initialization
  useEffect(() => {
    const saved = localStorage.getItem("sidebarOpen");
    if (saved !== null) {
      setOpen(saved === "true");
    }
    setIsInitialized(true);
  }, []);

  const toggleMenu = (val) => {
    setOpen(val);
    localStorage.setItem("sidebarOpen", val);
  };

  const toggleSubMenu = (name) => {
    if (activeSubMenu === name) {
      setActiveSubMenu(null);
      setSelectedMenu(name);
    } else {
      setActiveSubMenu(name);
      setSelectedMenu(null);
    }
  };

  return (
    <MenuContext.Provider
      value={{
        open,
        isInitialized,
        toggleMenu,
        activeSubMenu,
        toggleSubMenu,
        selectedMenu,
        setSelectedMenu,
      }}
    >
      {children}
    </MenuContext.Provider>
  );
};

export default MenuContextProvider;
