"use client";

import { MenuContext } from "@/context/MenuContext";
import React, { useContext } from "react";
import { RiMenuUnfold2Fill, RiMenuUnfoldFill } from "react-icons/ri";

function MainHeader() {
  const { open, toggleMenu } = useContext(MenuContext);

  const handleToggle = () => {
    toggleMenu(!open);
  };

  return (
    <div className="main-app-header flex items-center justify-between px-6 sticky top-0 z-40">
      <div className="flex items-center gap-4">
        <button
          onClick={handleToggle}
          className="menu-icon flex items-center justify-center"
          aria-label="Toggle menu"
        >
          {open ? (
            <RiMenuUnfold2Fill size={22} />
          ) : (
            <RiMenuUnfoldFill size={22} />
          )}
        </button>
      </div>

      {/* Right side - placeholder for search, notifications, profile */}
      <div className="flex items-center gap-4">
        {/* Future: Add search, notifications, user profile dropdown */}
      </div>
    </div>
  );
}

export default MainHeader;
