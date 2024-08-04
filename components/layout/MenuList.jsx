import React from "react";
import { FaProductHunt, FaUser } from "react-icons/fa";
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
import { TbReportAnalytics } from "react-icons/tb";
import { FaUserCircle } from "react-icons/fa";
import { TbApi } from "react-icons/tb";
import { FaCommentSms } from "react-icons/fa6";
import { RiSeoFill } from "react-icons/ri";
import { RiMailSettingsFill } from "react-icons/ri";
import { RiListSettingsFill } from "react-icons/ri";
import { IoSettings } from "react-icons/io5";
const MenuList = [
  {
    name: "Dashboard",
    icon: <MdDashboardCustomize size={20} />,
    link: "/admin/dashboard",
    sub: [],
  },
  {
    name: "Insurance",
    icon: <FaProductHunt size={20} />,
    link: "/admin/insurance-product",
    sub: [],
  },
  {
    name: "Add-Ons",
    icon: <BiSolidAddToQueue size={20} />,
    link: "/admin/add-ons",
    sub: [],
  },
  {
    name: "Buildings",
    icon: <FaBuildingColumns size={20} />,
    link: "/admin/buildings",
    sub: [],
  },
  {
    name: "Users",
    link: "/admin/users",
    icon: <FaUser size={20} />,
    sub: [
      {
        name: "Clients",
        icon: <FaUser size={16} />,
        link: "/admin/users/clients",
      },
      {
        name: "Tenants",
        icon: <FaUserCircle size={16} />,
        link: "/admin/users/tenants",
      },
    ],
  },
  {
    name: "Claims",
    icon: <LuBaggageClaim size={20} />,
    link: "/admin/claims",
    sub: [],
  },

  {
    name: "CMS",
    icon: <RiListSettingsFill size={20} />,
    link: "/admin/cms",
    sub: [
      {
        name: "Pages",
        icon: <FaPager size={16} />,
        link: "/admin/cms/pages",
      },
      {
        name: "FAQ",
        icon: <FaQuestionCircle size={16} />,
        link: "/admin/cms/faq",
      },

      {
        name: "Questions",
        icon: <FaPersonCircleQuestion size={16} />,
        link: "/admin/cms/questions",
      },
      {
        name: "Blog",
        icon: <FaBloggerB size={16} />,
        link: "/admin/cms/blogs",
      },
    ],
  },

  {
    name: "Developer",
    link: "/admin/developer",
    icon: <MdOutlineDeveloperMode size={20} />,
    sub: [
      {
        name: "Email Logs",
        icon: <MdMarkEmailRead size={16} />,
        link: "/admin/developer/email-logs",
      },
      {
        name: "System Logs",
        icon: <GrSystem size={16} />,
        link: "/admin/developer/system-logs",
      },
    ],
  },
  {
    name: "Policy",
    icon: <MdPolicy size={20} />,
    link: "/admin/policy",
    sub: [],
  },
  {
    name: "Reporting",
    icon: <TbReportAnalytics size={20} />,
    link: "/admin/reporting",
    sub: [],
  },
  {
    name: "Settings",
    link: "/admin/settings",
    icon: <IoSettings size={20} />,
    sub: [
      {
        name: "Admin Users",
        icon: <RiAdminFill size={16} />,
        link: "/admin/settings/admin-users",
      },
      {
        name: "Email Templates",
        icon: <RiMailSettingsFill size={16} />,
        link: "/admin/settings/email-templates",
      },
      {
        name: "SMS Templates",
        icon: <FaCommentSms size={16} />,
        link: "/admin/settings/sms-templates",
      },
      {
        name: "SEO",
        icon: <RiSeoFill size={16} />,
        link: "/admin/settings/seo",
      },
      {
        name: "APIs",
        icon: <TbApi size={16} />,
        link: "/admin/settings/apis",
      },
    ],
  },
];


export const CloseMenuList = [
  {
    name: "Dashboard",
    icon: <MdDashboardCustomize size={20} />,
    link: "/admin/dashboard",
  },
  {
    name: "Insurance",
    icon: <FaProductHunt size={20} />,
    link: "/admin/insurance-product",

  },
  {
    name: "Add-Ons",
    icon: <BiSolidAddToQueue size={20} />,
    link: "/admin/add-ons",

  },
  {
    name: "Buildings",
    icon: <FaBuildingColumns size={20} />,
    link: "/admin/buildings",
    sub: [],
  },
  {
    name: "Clients",
    icon: <FaUser size={16} />,
    link: "/admin/users/clients",
  },
  {
    name: "Tenants",
    icon: <FaUserCircle size={16} />,
    link: "/admin/users/tenants",
  },
  {
    name: "Claims",
    icon: <LuBaggageClaim size={20} />,
    link: "/admin/claims",
  },

  {
    name: "Pages",
    icon: <FaPager size={16} />,
    link: "/admin/cms/pages",
  },
  {
    name: "FAQ",
    icon: <FaQuestionCircle size={16} />,
    link: "/admin/cms/faq",
  },

  {
    name: "Questions",
    icon: <FaPersonCircleQuestion size={16} />,
    link: "/admin/cms/questions",
  },
  {
    name: "Blog",
    icon: <FaBloggerB size={16} />,
    link: "/admin/cms/blogs",
  },

  {
    name: "Email Logs",
    icon: <MdMarkEmailRead size={16} />,
    link: "/admin/developer/email-logs",
  },

  {
    name: "System Logs",
    icon: <GrSystem size={16} />,
    link: "/admin/developer/system-logs",
  },
  
  {
    name: "Policy",
    icon: <MdPolicy size={20} />,
    link: "/admin/policy",
  },
  {
    name: "Reporting",
    icon: <TbReportAnalytics size={20} />,
    link: "/admin/reporting",
  },
  {
    name: "Admin Users",
    icon: <RiAdminFill size={16} />,
    link: "/admin/settings/admin-users",
  },
  {
    name: "Email Templates",
    icon: <RiMailSettingsFill size={16} />,
    link: "/admin/settings/email-templates",
  },
  {
    name: "SMS Templates",
    icon: <FaCommentSms size={16} />,
    link: "/admin/settings/sms-templates",
  },
  {
    name: "SEO",
    icon: <RiSeoFill size={16} />,
    link: "/admin/settings/seo",
  },
  {
    name: "APIs",
    icon: <TbApi size={16} />,
    link: "/admin/settings/apis",
  },
];
export default MenuList;
