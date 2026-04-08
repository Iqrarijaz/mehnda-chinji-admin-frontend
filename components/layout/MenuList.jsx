import React from "react";
import { FaProductHunt, FaUser, FaUserShield, FaMapMarkerAlt, FaBuilding } from "react-icons/fa";
import { RiAdminFill } from "react-icons/ri";
import { FaQuestionCircle } from "react-icons/fa";
import { FaBloggerB } from "react-icons/fa6";
import { MdDashboardCustomize } from "react-icons/md";
import { IoSettings } from "react-icons/io5";
import { MdReport } from "react-icons/md";
import { FaDroplet, FaTerminal } from "react-icons/fa6";

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
    name: "Businesses",
    icon: <FaBuilding size={20} />,
    link: "/admin/business",
    permission: "businesses.read"
  },
  {
    name: "Essentials",
    icon: <FaMapMarkerAlt size={20} />,
    link: "/admin/essentials",
    permission: "essentials.read"
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
    icon: <IoSettings size={20} />,
    permission: "configurations.read",
    subItems: [
      {
        name: "System Config",
        link: "/admin/configurations",
        permission: "configurations.read",
      },
      {
        name: "App Images",
        link: "/admin/configurations/app-images",
        permission: "configurations.read",
      },
    ],
  },
  {
    name: "Support",
    link: "/admin/support",
    icon: <FaQuestionCircle size={20} />,
    permission: "support.read"
  },
  {
    name: "Contact Us",
    link: "/admin/contact-us",
    icon: <FaUser size={20} />,
    permission: "contact_us.read"
  },
  {
    name: "Reports",
    link: "/admin/reports",
    icon: <MdReport size={20} />,
    permission: "reports.read"
  },
  {
    name: "System Logs",
    link: "/admin/system-logs",
    icon: <FaTerminal size={20} />,
    permission: "logs.read"
  },
];


export default MenuList;
