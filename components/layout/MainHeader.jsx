"use client";

import { MenuContext } from "@/context/MenuContext";
import React, { useContext } from "react";
import { GiHamburgerMenu } from "react-icons/gi";

function MainHeader() {
  const { open, toggleMenu } = useContext(MenuContext);
  return (
    <div className="bg-white flex items-center justify-between px-6 h-12 ">
      <GiHamburgerMenu size={20} className="cursor-pointer" onClick={toggleMenu} />
      <div className="font-sans">User Area</div>
    </div>
  );
}

export default MainHeader;
