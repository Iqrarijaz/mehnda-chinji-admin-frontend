import React from "react";
import { FaProductHunt, FaUser, FaUserShield, FaMapMarkerAlt, FaBuilding, FaRegCommentDots, FaBullhorn, FaStore } from "react-icons/fa";
import { RiAdminFill } from "react-icons/ri";
import { FaQuestionCircle } from "react-icons/fa";
import { FaBloggerB } from "react-icons/fa6";
import { MdDashboardCustomize } from "react-icons/md";
import { IoSettings } from "react-icons/io5";
import { MdReport } from "react-icons/md";
import { FaDroplet, FaTerminal } from "react-icons/fa6";

import { PERMISSIONS } from "@/config/permissions";

const MenuList = [
  {
    name: "Dashboard",
    icon: <MdDashboardCustomize size={20} />,
    link: "/admin/dashboard",
    permission: PERMISSIONS.DASHBOARD.READ
  },

  {
    name: "Businesses",
    icon: <FaBuilding size={20} />,
    link: "/admin/business",
    permission: [
      PERMISSIONS.BUSINESSES.READ,
      PERMISSIONS.STORE.ANALYTICS.READ,
      PERMISSIONS.STORE.CATEGORIES.READ,
      PERMISSIONS.STORE.PRODUCTS.READ,
      PERMISSIONS.STORE.ORDERS.READ
    ]
  },
  {
    name: "Essentials",
    icon: <FaMapMarkerAlt size={20} />,
    link: "/admin/essentials",
    permission: PERMISSIONS.ESSENTIALS.READ
  },
  {
    name: "Users",
    icon: <FaUser size={20} />,
    link: "/admin/users",
    permission: PERMISSIONS.USERS.READ
  },

  {
    name: "Marketplace",
    icon: <FaProductHunt size={20} />,
    link: "/admin/marketplace",
    permission: PERMISSIONS.MARKETPLACE.READ
  },

  {
    name: "User Feedback",
    icon: <FaRegCommentDots size={20} />,
    link: "/admin/feedback",
    permission: PERMISSIONS.FEEDBACK.READ
  },
  {
    name: "Roles",
    link: "/admin/roles",
    icon: <RiAdminFill size={20} />,
    permission: PERMISSIONS.ROLES.READ
  },
  {
    name: "Admin Users",
    link: "/admin/admin-users",
    icon: <FaUserShield size={20} />,
    permission: PERMISSIONS.ADMIN_USERS.READ
  },

  {
    name: "Configurations",
    icon: <IoSettings size={20} />,
    permission: PERMISSIONS.CONFIGURATIONS.READ,
    subItems: [
      {
        name: "System Config",
        link: "/admin/configurations",
        permission: PERMISSIONS.CONFIGURATIONS.READ,
      },
      {
        name: "App Images",
        link: "/admin/configurations/app-images",
        permission: PERMISSIONS.CONFIGURATIONS.READ,
      },
      {
        name: "Upload",
        link: "/admin/configurations/upload",
        permission: PERMISSIONS.CONFIGURATIONS.READ,
      },
    ],
  },
  {
    name: "Support",
    link: "/admin/support",
    icon: <FaQuestionCircle size={20} />,
    permission: PERMISSIONS.SUPPORT.READ
  },
  {
    name: "Contact Us",
    link: "/admin/contact-us",
    icon: <FaUser size={20} />,
    permission: PERMISSIONS.CONTACT_US.READ
  },
  {
    name: "Reports",
    link: "/admin/reports",
    icon: <MdReport size={20} />,
    permission: PERMISSIONS.REPORTS.READ
  },
  {
    name: "System Logs",
    link: "/admin/system-logs",
    icon: <FaTerminal size={20} />,
    permission: PERMISSIONS.LOGS.READ
  },

];


export default MenuList;
