import React from "react";
import { FaProductHunt, FaUser, FaUserShield } from "react-icons/fa";
import { BiSolidAddToQueue } from "react-icons/bi";
import { RiAdminFill } from "react-icons/ri";
import { LuBaggageClaim } from "react-icons/lu";
import { FaPager } from "react-icons/fa";
import { FaQuestionCircle } from "react-icons/fa";
import { FaBloggerB } from "react-icons/fa6";
import { FaPersonCircleQuestion } from "react-icons/fa6";
import { FaBuildingColumns } from "react-icons/fa6";
import { MdDashboardCustomize, MdOutlineDeveloperMode } from "react-icons/md";
import { MdMarkEmailRead } from "react-icons/md";
import { GrSystem } from "react-icons/gr";
import { MdPolicy } from "react-icons/md";
import { RiListSettingsFill } from "react-icons/ri";
import { IoSettings } from "react-icons/io5";
const MenuList = [
  {
    name: "Dashboard",
    icon: <MdDashboardCustomize size={20} />,
    link: "/admin/dashboard",
    permission: "dashboard.read"
  },
  {
    name: "Categories",
    icon: <FaProductHunt size={20} />,
    link: "/admin/categories",
    permission: "categories.read"
  },
  {
    name: "Locations",
    icon: <FaProductHunt size={20} />,
    link: "/admin/locations",
    permission: "locations.read"
  },
  {
    name: "Add-Ons",
    icon: <BiSolidAddToQueue size={20} />,
    link: "/admin/add-ons",
    permission: "add_ons.read"
  },
  {
    name: "Buildings",
    icon: <FaBuildingColumns size={20} />,
    link: "/admin/buildings",
    permission: "buildings.read"
  },
  {
    name: "Users",
    link: "/admin/users",
    icon: <FaUser size={20} />,
    permission: "users.read"
  },
  {
    name: "Roles",
    link: "/admin/roles",
    icon: <RiAdminFill size={20} />,
    permission: "roles.read"
  },
  {
    name: "Admin Users",
    link: "/admin/admin-users",
    icon: <FaUserShield size={20} />,
    permission: "admin_users.read"
  },
  {
    name: "CMS",
    icon: <RiListSettingsFill size={20} />,
    link: "/admin/cms",
    permission: "cms.read"
  },
  {
    name: "Developer",
    link: "/admin/developer",
    icon: <MdOutlineDeveloperMode size={20} />,
    permission: "developer.read"
  },
  {
    name: "Policy",
    icon: <MdPolicy size={20} />,
    link: "/admin/policy",
    permission: "policy.read"
  },

]


export default MenuList;
