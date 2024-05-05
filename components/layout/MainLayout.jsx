/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useContext } from "react";
import MainHeader from "./MainHeader";
import { FaAngleDoubleRight, FaAngleRight, FaHome, FaUser } from "react-icons/fa";
import Link from "next/link";
import { GoTriangleRight } from "react-icons/go";
import logo from "../../assets/images/logo.png";
import { IoSettings, IoSettingsOutline } from "react-icons/io5";
import { MenuContext } from "@/context/MenuContext";

function MainLayout({ children }) {
  const { open } = useContext(MenuContext);
  const menu = [
    {
      name: "Dashboard",
      icon: <FaHome size={20} />,
      link: "/",
      sub: [],
    },

    {
      name: "Projects",
      icon: <FaHome size={20} />,
      link: "/projects",
      sub: [
        {
          name: "Project 1",
          icon: <FaHome />,
          link: "/",
          sub: [],
        },
      ],
    },

    {
      name: "Users",
      icon: <FaUser  size={20} />,
      link: "/admin/dashboard/users",
      sub: [],
    },
    {
      name: "Settings",
      icon: <IoSettings size={20} />,
      link: "/admin/dashboard/settings",
      sub: [],
    },
  ];

  return (
    <div className=" w-screen min-h-screen">
      <div className=" flex align-start justify-start min-h-screen">
        <aside
          className={`bg-gray-200  text-primary overflow-hidden transition-all duration-200 ${
            open ? "w-60 p-4" : "w-0"
          } lg:w-60 lg:p-4`}
        >
          <div>
            <img src={logo.src} alt="" className="" />
          </div>
          {menu.map((item) => (
            <>
              <ul key={item?.name}>
                {item?.sub?.length === 0 ? (
                  <li className="flex items-center justify-start  rounded-2xl p-2 hover:bg-hover_primary  ">
                    <div className="mr-4 "> {item.icon}</div>
                    <Link href={item.link} className="font-sans">
                      {item.name}
                    </Link>
                  </li>
                ) : (
                  <div>
                    <li className="flex items-center justify-start rounded-2xl pl-2 pt-2 pb-2  hover:bg-hover_primary  ">
                      <FaHome className="mr-4" size={20} />
                      <h3 href="/" className="font-sans">
                        {item.name}
                      </h3>
                      <div className="ml-auto pr-4">
                        <FaAngleRight className="p-0" size={16} />
                      </div>
                    </li>
                    <div className="">
                      <ul>
                        {item?.sub?.map((subItem) => (
                          <li
                            key={subItem.name}
                            className=" flex items-center justify-start  rounded-2xl pl-10 pt-2 pb-2  hover:bg-hover_primary  "
                          >
                            <FaHome className="mr-4 " />
                            <h3 href="/" className="font-sans">
                              {subItem.name}
                            </h3>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </ul>
            </>
          ))}
        </aside>
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}

export default MainLayout;
