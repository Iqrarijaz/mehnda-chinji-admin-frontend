"use client";
const { createContext, useState } = require("react");

export const MenuContext = createContext();

const MenuContextProvider = ({ children }) => {
  const [open, toggleMenu] = useState(true);
  const [activeSubMenu, setActiveSubMenu] = useState(null); // Track the currently open submenu
  const [selectedMenu, setSelectedMenu] = useState(null); // Track the selected menu

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
