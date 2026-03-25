"use client";
const { createContext, useState, useEffect } = require("react");

export const MenuContext = createContext();

const MenuContextProvider = ({ children }) => {
  const [open, setOpen] = useState(true);
  const [activeSubMenu, setActiveSubMenu] = useState(null);
  const [selectedMenu, setSelectedMenu] = useState(null);

  // Persistence
  useEffect(() => {
    const saved = localStorage.getItem("sidebarOpen");
    if (saved !== null) {
      setOpen(saved === "true");
    }
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
