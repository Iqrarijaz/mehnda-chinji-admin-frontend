import React from "react";
import { FaProductHunt, FaUser, FaUserShield, FaMapMarkerAlt, FaBuilding, FaRegCommentDots, FaBullhorn } from "react-icons/fa";
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
    name: "Posts",
    icon: <FaBloggerB size={20} />,
    link: "/admin/posts",
    permission: PERMISSIONS.POSTS.READ
  },
  /*
    {
      name: "Locations",
      icon: <FaMapMarkerAlt size={20} />,
      link: "/admin/locations",
      permission: PERMISSIONS.LOCATIONS.READ
    },
  */

  {
    name: "Businesses",
    icon: <FaBuilding size={20} />,
    link: "/admin/business",
    permission: PERMISSIONS.BUSINESSES.READ
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
    name: "Announcements",
    icon: <FaBullhorn size={20} />,
    link: "/admin/announcements",
    permission: PERMISSIONS.ANNOUNCEMENTS.READ
  },
  {
    name: "Marketplace",
    icon: <FaProductHunt size={20} />,
    link: "/admin/marketplace",
    permission: PERMISSIONS.MARKETPLACE.READ
  },
  {
    name: "Blood Donors",
    icon: <FaDroplet size={20} className="text-white" />,
    link: "/admin/blood-donors",
    permission: PERMISSIONS.BLOOD_DONORS.READ
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
    name: "Water Supply",
    icon: <FaDroplet size={20} />,
    permission: PERMISSIONS.WATER_SUPPLY.READ,
    subItems: [
      {
        name: "Connections",
        link: "/admin/water-supply/connections",
        permission: PERMISSIONS.WATER_SUPPLY.READ,
      },
      {
        name: "Bills",
        link: "/admin/water-supply/bills",
        permission: PERMISSIONS.WATER_SUPPLY.READ,
      },
      {
        name: "Expenses",
        link: "/admin/water-supply/expenses",
        permission: PERMISSIONS.WATER_SUPPLY.READ,
      },
      {
        name: "Reports",
        link: "/admin/water-supply/reports",
        permission: PERMISSIONS.WATER_SUPPLY.READ,
      },
    ],
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
