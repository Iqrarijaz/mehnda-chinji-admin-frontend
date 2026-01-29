import { MenuContext } from "@/context/MenuContext";
import React, { useContext, useState } from "react";
import { RiMenuUnfold2Fill, RiMenuUnfoldFill } from "react-icons/ri";
import { FaUserCircle } from "react-icons/fa";
import ProfileModal from "./ProfileModal";

function MainHeader() {
  const { open, toggleMenu } = useContext(MenuContext);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

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

      {/* Right side - Profile */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => setIsProfileOpen(true)}
          className="flex items-center gap-2 p-1.5 px-3 rounded-full hover:bg-white/10 transition-colors border border-white/10 group"
        >
          {/* <span className="hidden sm:block text-xs font-medium text-gray-300 group-hover:text-white transition-colors">
            Profile
          </span> */}
          <FaUserCircle size={26} className="text-gray-300 group-hover:text-white transition-colors" />
        </button>
      </div>

      <ProfileModal
        open={isProfileOpen}
        onCancel={() => setIsProfileOpen(false)}
      />
    </div>
  );
}

export default MainHeader;
