/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useContext, useEffect, useState } from "react";
import MainHeader from "./MainHeader";
import { FaAngleDown, FaAngleRight, FaHome, FaUser } from "react-icons/fa";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { RiLogoutCircleFill } from "react-icons/ri";

import logo from "../../assets/images/logo.png";
import { RiLogoutBoxFill } from "react-icons/ri";
import { MenuContext } from "@/context/MenuContext";
import { useMediaQuery } from "@chakra-ui/react";
import MenuList, { CloseMenuList } from "./MenuList";
import { Popover } from "antd";

function MainLayout({ children }) {
  const {
    open,
    activeSubMenu,
    toggleSubMenu,
    selectedMenu,
    setSelectedMenu,
    toggleMenu,
  } = useContext(MenuContext);
  const [isLargerThan650] = useMediaQuery("(min-width: 650px)");

  const pathname = usePathname();
  const router = useRouter();
  const [selectMenu, setSelectedMenuState] = useState(pathname);

  useEffect(() => {
    // if (isLargerThan650) {
    //   toggleMenu(true);
    // }
    setSelectedMenuState(pathname);
    if (activeSubMenu === null) {
      setSelectedMenu(pathname);
    }
  }, [pathname, activeSubMenu]);

  function handleLogout() {
    console.log("Logout");
    localStorage.clear();
    router.push("/");
  }

  // render menu without sub menu
  function renderItemMenu(item) {
    return (
      <li
        key={item.name}
        className={`flex items-center mb-2 justify-start rounded-lg p-2 side_menu_item ${
          selectMenu === item.link || selectedMenu === item.link
            ? "selected-menu-item"
            : ""
        }`}
      >
        <Link href={item.link} className="flex items-center font-sans w-full">
          <div
            className={`mr-4 ${
              selectMenu === item.link || selectedMenu === item.link
                ? "white"
                : ""
            }`}
          >
            {item.icon}
          </div>

          <div
            className={`${
              selectMenu === item.link || selectedMenu === item.link
                ? "text-white"
                : ""
            }`}
          >
            {item.name}
          </div>
        </Link>
      </li>
    );
  }

  // render menu with sub menu
  function renderItemWithSubMenu(subItemArray, name) {
    return (
      <ul className="pl-0">
        {subItemArray.map((subItem) => (
          <Link href={subItem.link} className="font-sans" key={subItem.name}>
            <li
              key={subItem.name}
              className={`flex items-center justify-start rounded-2xl mb-1 pl-6 side_menu_item cursor-pointer ${
                selectMenu === subItem.link ? "selected-menu-item" : ""
              }`}
            >
              <div className="flex items-center w-full justify-start rounded-lg p-2">
                <div
                  className={`mr-4 ${
                    selectMenu === subItem.link ? "text-white" : ""
                  }`}
                >
                  {subItem.icon}
                </div>
                <span
                  className={`${
                    selectMenu === subItem.link ? "text-white" : ""
                  }`}
                >
                  {subItem.name}
                </span>
              </div>
            </li>
          </Link>
        ))}
      </ul>
    );
  }

  // render open sidebar and close sidebar
  const renderOpenSideBar = () => {
    return (
      <>
        <div className="flex items-center justify-center mb-4 bg-white h-[150px]">
          logo here
        </div>
        {MenuList.length > 0 &&
          MenuList.map((item) =>
            item.sub?.length === 0 ? (
              <ul key={item.name} className="space-y-2">
                {renderItemMenu(item)}
              </ul>
            ) : (
              <ul key={item.name}>
                <li
                  className={`flex items-center mb-2 justify-start rounded-lg p-2 cursor-pointer side_menu_item ${
                    selectedMenu === item.link ? "selected-menu-item" : ""
                  }`}
                  onClick={() => toggleSubMenu(item.name)}
                >
                  <div className="flex justify-between w-full items-center">
                    <div className="flex">
                      {item.icon}
                      <div className="ml-4">{item.name}</div>
                    </div>
                    {activeSubMenu === item.name ? (
                      <FaAngleDown />
                    ) : (
                      <FaAngleRight />
                    )}
                  </div>
                </li>
                {activeSubMenu === item.name &&
                  renderItemWithSubMenu(item.sub, item.name)}
              </ul>
            )
          )}
        <li
          className="flex items-center mb-1 justify-start rounded-lg p-2 cursor-pointer side_menu_item"
          onClick={handleLogout}
        >
          <RiLogoutBoxFill className="mr-4" size={20} />
          <div>Logout</div>
        </li>{" "}
      </>
    );
  };

  // render close sidebar for desktop view
  const renderCloseMenu = () => {
    return (
      <>
        <div className="flex items-center justify-center mb-4 bg-slate-100 h-12">
          <img src={logo} alt="Logo" className="h-8 w-auto" />
        </div>
        <ul>
          {CloseMenuList.map((item) => (
            <li
              className={`flex items-center justify-center rounded-lg p-3 relative
            `}
              key={item.name}
            >
              <Popover
                placement="right"
                trigger={"hover"}
                color="#2628dd"
                overlayInnerStyle={{ padding: "4px 8px" }}
                content={
                  <div className="flex w-full text-base justify-center items-center text-white rounded-lg ">
                    {item.name}
                  </div>
                }
              >
                <Link
                  href={item.link}
                  className={`flex items-center justify-center w-10 h-10 bg-white rounded-lg side_menu_item_close !border-none shadow-transparent focus:outline-none
                    ${
                      selectMenu === item.link || selectedMenu === item.link
                        ? "selected-menu-item-close"
                        : ""
                    }
                        `}
                >
                  {React.cloneElement(item.icon, { size: 26 })}
                </Link>
              </Popover>
            </li>
          ))}
        </ul>
      </>
    );
  };

  return (
      <div className="flex align-start justify-start min-h-screen">
        <aside
          className={`sidebar flex-shrink-0 sidebar-scroll scroll-bar-style transition-all duration-100 ${
            open
              ? "menu-width-open p-4"
              : isLargerThan650
              ? "close-menu-width p-0"
              : "w-0 p-0"
          }`}
        >
          {open ? renderOpenSideBar() : renderCloseMenu()}
        </aside>
        <main className="flex-1 w-[calc(100vw-19rem)]">
          <div className="sticky top-0">
            <MainHeader />
          </div>
          <div className="p-6 bg-white inner-pages">{children}</div>
        </main>
      </div>
    // <div className="w-screen min-h-screen">
    // </div>
  );
}

export default MainLayout;
