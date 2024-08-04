"use client";

import { MenuContext } from "@/context/MenuContext";
import React, { useContext } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import { RiMenuUnfold2Fill } from "react-icons/ri";
import { RiMenuUnfoldFill } from "react-icons/ri";

function MainHeader() {
  const { open, toggleMenu } = useContext(MenuContext);

  const handleToggle = () => {
    toggleMenu(!open);
  };

  return (
    <div className="main-app-header bg-white flex items-center justify-between px-4 ">
      <div className="flex items-center menu-icon">
        {open ? (
          <RiMenuUnfold2Fill size={24} className="cursor-pointer" onClick={handleToggle}/>
        ) : (
          <RiMenuUnfoldFill size={24} className="cursor-pointer" onClick={handleToggle} />
        )}
      </div>
    </div>
  );
}

export default MainHeader;
