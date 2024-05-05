"use client" 
const { createContext, useState } = require("react");

export const MenuContext = createContext();

const MenuContextProvider = ({ children }) => {
  const [open, setOpen] = useState(false);

  const toggleMenu = () => {
    console.log({ open });
    setOpen((pre) => !pre);
  };

  return (
    <MenuContext.Provider value={{ open, toggleMenu }}>
      {children}
    </MenuContext.Provider>
  );
};

export default MenuContextProvider;
