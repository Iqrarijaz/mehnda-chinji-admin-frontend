/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useContext, useEffect, useState } from "react";
import MainHeader from "./MainHeader";
import { FaAngleRight, FaHome, FaUser } from "react-icons/fa";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import logo from "../../assets/images/logo.png";
import { IoSettings } from "react-icons/io5";
import { MenuContext } from "@/context/MenuContext";
import { useMediaQuery } from "@chakra-ui/react";

function MainLayout({ children }) {
  const { open, toggleMenu } = useContext(MenuContext);
  const [isLargerThan650] = useMediaQuery("(min-width: 650px)");

  const pathname = usePathname();
  const router = useRouter();
  const [selectMenu, setSelectedMenu] = useState(pathname);

  
  useEffect(() => {
    if (isLargerThan650) {
      toggleMenu(true);
    }
    setSelectedMenu(pathname);
  }, [pathname, isLargerThan650]);

  const menu = [
    {
      name: "Dashboard",
      icon: <FaHome size={20} />,
      link: "/admin/dashboard",
      sub: [],
    },
    {
      name: "Projects",
      icon: <FaHome size={20} />,
      link: "/admin/projects",
      sub: [],
    },
    {
      name: "Users",
      icon: <FaUser size={20} />,
      link: "/admin/users",
      sub: [],
    },
    {
      name: "Settings",
      icon: <IoSettings size={20} />,
      link: "/admin/settings",
      sub: [],
    },
  ];

  function handleLogout() {
    console.log("Logout");
    localStorage.clear();
    router.push("/");
  }

  return (
    <div className="w-screen min-h-screen">
      <div className="flex align-start justify-start min-h-screen">
        <aside
          className={`bg-red-200 text-primary overflow-hidden transition-all duration-100 ${
            open ? "w-60 p-4" : "w-0"
          } lg:w-60 lg:p-4`}
        >
          <div>
            <img src={logo.src} alt="Logo" className="" />
          </div>
          {menu.map((item) => (
            <ul key={item?.name}>
              {item?.sub?.length === 0 ? (
                <Link href={item.link} className="font-sans">
                  <li
                    className={`flex items-center mb-1 justify-start rounded-lg p-2 hover:bg-hover_primary ${
                      selectMenu === item.link ? "selected-menu-item" : ""
                    }`}
                  >
                    <div
                      className={`mr-4 ${
                        selectMenu === item.link
                          ? "text-primary"
                          : "text-gray-600"
                      } `}
                    >
                      {item.icon}
                    </div>

                    <div
                      className={`${
                        selectMenu === item.link
                          ? "text-primary"
                          : "text-gray-600"
                      } `}
                    >
                      {item.name}
                    </div>
                  </li>
                </Link>
              ) : (
                <div>
                  <li className="flex items-center justify-start rounded-2xl pl-2 pt-2 pb-2 hover:bg-hover_primary">
                    <FaHome className="mr-4" size={20} />
                    <h3 className="font-sans">{item.name}</h3>
                    <div className="ml-auto pr-4">
                      <FaAngleRight className="p-0" size={16} />
                    </div>
                  </li>
                  <div>
                    <ul>
                      {item?.sub?.map((subItem) => (
                        <li
                          key={subItem.name}
                          className="flex items-center justify-start rounded-2xl pl-10 pt-2 pb-2 hover:bg-hover_primary"
                        >
                          <FaHome className="mr-4" />
                          <h3 className="font-sans">{subItem.name}</h3>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </ul>
          ))}
          <li
            className={`flex items-center mb-1 justify-start rounded-lg p-2 hover:bg-hover_primary cursor-pointer`}
            onClick={handleLogout}
          >
            <div className={`mr-4 text-gray-600 `}>
              <IoSettings size={20} />
            </div>

            <div className={` text-gray-600 `}>Logout</div>
          </li>
        </aside>
        <main className="flex-1">
          <MainHeader />
          <div className="p-6">{children}</div>
        </main>
      </div>
    </div>
  );
}

export default MainLayout;
