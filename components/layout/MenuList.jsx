import React from "react";
import { FaProductHunt, FaUser, FaUserShield, FaMapMarkerAlt, FaBuilding } from "react-icons/fa";
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
import { MdReport, MdEmail } from "react-icons/md";
import { FaDroplet } from "react-icons/fa6";

const MenuList = [
  {
    name: "Dashboard",
    icon: <MdDashboardCustomize size={20} />,
    link: "/admin/dashboard",
    permission: "dashboard.read"
  },
  {
    name: "Posts",
    icon: <FaBloggerB size={20} />,
    link: "/admin/posts",
    permission: "posts.read"
  },
  {
    name: "Categories",
    icon: <FaProductHunt size={20} />,
    link: "/admin/categories",
    permission: "categories.read"
  },
  {
    name: "Businesses",
    icon: <FaBuilding size={20} />,
    link: "/admin/business",
    permission: "businesses.read"
  },
  {
    name: "Places",
    icon: <FaMapMarkerAlt size={20} />,
    link: "/admin/places",
    permission: "places.read"
  },

  {
    name: "Users",
    icon: <FaUser size={20} />,
    link: "/admin/users",
    permission: "users.read"
  },
  {
    name: "Blood Donors",
    icon: <FaDroplet size={20} className="text-white" />,
    link: "/admin/blood-donors",
    permission: "blood_donors.read"
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
    name: "Configurations",
    link: "/admin/configurations",
    icon: <IoSettings size={20} />,
    permission: "configurations.read"
  },
  {
    name: "Support",
    link: "/admin/support",
    icon: <FaQuestionCircle size={20} />,
    permission: "support.read"
  },
  {
    name: "Reports",
    link: "/admin/reports",
    icon: <MdReport size={20} />,
    permission: "reports.read"
  },
  // {
  //   name: "CMS",
  //   icon: <RiListSettingsFill size={20} />,
  //   link: "/admin/cms",
  //   permission: "cms.read"
  // },
  // {
  //   name: "Developer",
  //   link: "/admin/developer",
  //   icon: <MdOutlineDeveloperMode size={20} />,
  //   permission: "developer.read"
  // },
  // {
  //   name: "Settings",
  //   icon: <IoSettings size={20} />,
  //   permission: "settings.read",
  //   subItems: [
  //     {
  //       name: "Email Template",
  //       link: "/admin/settings/email-templates",
  //       icon: <MdEmail size={18} />,
  //       permission: "settings.email_templates.read"
  //     }
  //   ]
  // },

]


export default MenuList;
