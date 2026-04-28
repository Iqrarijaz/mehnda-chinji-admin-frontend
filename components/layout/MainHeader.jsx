import { MenuContext } from "@/context/MenuContext";
import React, { useContext, useEffect, useState } from "react";
import { RiMenuUnfold2Fill, RiMenuUnfoldFill, RiSunLine, RiMoonFill } from "react-icons/ri";
import { FaUserCircle } from "react-icons/fa";
import { HiOutlineDocumentReport, HiOutlineSupport, HiOutlineMail } from "react-icons/hi";
import { Badge, Tooltip, Popover, Avatar } from "antd";
import { useRouter } from "next/navigation";
import ProfileModal from "./ProfileModal";
import GlobalSearch from "./GlobalSearch";
import { GET_SUPPORT_STATS } from "@/app/api/admin/dashboard";
import { LOGOUT } from "@/app/api/login";
import { toast } from "react-toastify";
import { RiLogoutCircleRLine } from "react-icons/ri";
import { useTheme } from "@/context/ThemeContext";

function MainHeader() {
  const { open, toggleMenu } = useContext(MenuContext);
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [counts, setCounts] = useState({
    reports: 0,
    support: 0,
    contacts: 0
  });
  const [user, setUser] = useState(null);

  const fetchUserData = () => {
    const userData = localStorage.getItem("userData");
    if (userData) {
      try {
        const parsed = JSON.parse(userData);
        setUser(parsed?.adminData || parsed);
      } catch (e) {
        console.error("Failed to parse user data", e);
      }
    }
  };


  const fetchCounts = async () => {
    try {
      const statsRes = await GET_SUPPORT_STATS();
      const d = statsRes?.data || {};

      setCounts({
        reports: d.reports || {},
        support: d.support || {},
        contacts: d.contacts || {}
      });
    } catch (error) {
      console.error("Error fetching notification counts:", error);
    }
  };

  useEffect(() => {
    fetchCounts();
    fetchUserData();
    // Refresh counts every minute
    const interval = setInterval(fetchCounts, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleToggle = (e) => {
    e.preventDefault();
    toggleMenu(!open);
  };

  const handleLogout = async () => {
    try {
      await LOGOUT();
      toast.success("Logged out successfully");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      localStorage.clear();
      router.push("/");
    }
  };

  const NotificationPopover = ({ title, icon: Icon, counts, path, statuses = [] }) => (
    <div className="w-64 overflow-hidden -mx-3 -my-3">
      <div className="bg-[#006666] dark:bg-[#004D4D] p-3 text-white flex items-center justify-between transition-colors">
        <div className="flex items-center gap-2">
          <Icon size={18} />
          <span className="font-bold text-[12px] uppercase tracking-wider">{title}</span>
        </div>
        <Badge count={counts?.[statuses[0]?.key] || 0} size="small" showZero={false} className="popover-badge" />
      </div>
      <div className="p-3 bg-white dark:bg-slate-900 space-y-2 transition-colors">
        <div className="grid grid-cols-1 gap-1">
          {statuses.map((s, i) => (
            <div key={i} className="flex items-center justify-between p-2 rounded hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${s.colorClass}`} />
                <span className="text-[11px] font-medium text-slate-600 dark:text-slate-400 group-hover:text-slate-800 dark:group-hover:text-slate-200">{s.label}</span>
              </div>
              <span className="text-[11px] font-bold text-slate-800 dark:text-slate-100">{counts?.[s.key] || 0}</span>
            </div>
          ))}
        </div>
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-end">
          <button
            onClick={() => {
              router.push(path);
            }}
            className="text-[10px] font-bold text-[#006666] hover:underline flex items-center gap-1 uppercase tracking-tight"
          >
            View All Items &rarr;
          </button>
        </div>
      </div>
    </div>
  );

  const ProfilePopover = () => (
    <div className="w-64 overflow-hidden -mx-3 -my-3">
      <div className="bg-[#006666] dark:bg-[#004D4D] p-4 text-white transition-colors">
        <div className="flex items-center gap-3">
          <Avatar
            size={40}
            src={user?.profileImage}
            icon={<FaUserCircle />}
            className="border-2 border-white/20 shadow-md"
          />
          <div className="flex flex-col min-w-0">
            <span className="font-bold text-sm truncate leading-tight">{user?.name || "Administrator"}</span>
            <span className="text-[10px] font-black text-white/70 uppercase tracking-widest mt-0.5">{user?.role?.replace(/_/g, " ") || "SUPER ADMIN"}</span>
          </div>
        </div>
      </div>
      <div className="p-2 bg-white dark:bg-slate-900 transition-colors">
        <div className="space-y-1">
          <button
            onClick={() => setIsProfileOpen(true)}
            className="w-full flex items-center gap-3 p-2.5 rounded hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group text-left"
          >
            <div className="w-8 h-8 rounded bg-teal-50 dark:bg-teal-900/30 flex items-center justify-center text-[#006666] dark:text-teal-400 group-hover:bg-teal-600 group-hover:text-white transition-all">
              <FaUserCircle size={14} />
            </div>
            <div className="flex flex-col">
              <span className="text-[11px] font-bold text-slate-700 dark:text-slate-200">My Profile</span>
              <span className="text-[9px] text-slate-400 dark:text-slate-500 font-medium tracking-tight">Account settings & data</span>
            </div>
          </button>

          <button
            onClick={() => router.push("/admin/support")}
            className="w-full flex items-center gap-3 p-2.5 rounded hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group text-left"
          >
            <div className="w-8 h-8 rounded bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 group-hover:bg-slate-200 dark:group-hover:bg-slate-700 transition-all">
              <HiOutlineSupport size={14} />
            </div>
            <div className="flex flex-col">
              <span className="text-[11px] font-bold text-slate-700 dark:text-slate-200">System Support</span>
              <span className="text-[9px] text-slate-400 dark:text-slate-500 font-medium tracking-tight">Get help or report bug</span>
            </div>
          </button>
        </div>

        <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-1 px-1">
          <button
            onClick={() => setIsProfileOpen(true)}
            className="w-full flex items-center justify-between p-2 rounded hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group"
          >
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">Security</span>
            <div className="flex items-center gap-1.5 font-bold text-[11px] text-[#006666] dark:text-teal-400">
              Manage <span className="text-teal-400 dark:text-teal-500">&rarr;</span>
            </div>
          </button>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 p-2 rounded hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 transition-colors group px-2"
          >
            <div className="w-6 h-6 rounded bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-600 group-hover:bg-red-600 group-hover:text-white transition-all">
              <RiLogoutCircleRLine size={12} />
            </div>
            <span className="text-[11px] font-bold">Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="main-app-header flex items-center justify-between px-6 sticky top-0 z-40 shadow-sm border-b border-white/10">
      <div className="flex items-center gap-4">
        <button
          onClick={handleToggle}
          className="menu-icon flex items-center justify-center p-1 rounded-lg hover:bg-white/10 transition-all active:scale-95"
          aria-label="Toggle menu"
        >
          {open ? (
            <RiMenuUnfold2Fill size={22} className="text-white" />
          ) : (
            <RiMenuUnfoldFill size={22} className="text-white" />
          )}
        </button>
        <GlobalSearch />
      </div>

      {/* Right side - Notifications & Profile */}
      <div className="flex items-center gap-2.5">
        {/* Theme Toggle */}
        <Tooltip title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}>
          <button
            onClick={toggleTheme}
            className="flex items-center justify-center p-2 rounded-full hover:bg-white/10 transition-all text-white active:scale-95 group relative"
            aria-label="Toggle Theme"
          >
            {theme === 'light' ? (
              <RiMoonFill size={20} className="text-white opacity-80 group-hover:opacity-100" />
            ) : (
              <RiSunLine size={20} className="text-white opacity-80 group-hover:opacity-100" />
            )}
          </button>
        </Tooltip>

        <div className="w-[1px] h-4 bg-white/10 mx-0.5" />

        {/* Reports Notification */}
        <Popover
          content={
            <NotificationPopover
              title="Reports Overview"
              icon={HiOutlineDocumentReport}
              counts={counts.reports}
              path="/admin/reports"
              statuses={[
                { label: "Pending Issues", key: "PENDING", colorClass: "bg-red-500" },
                { label: "Being Reviewed", key: "REVIEWED", colorClass: "bg-orange-500" },
                { label: "Resolved Items", key: "RESOLVED", colorClass: "bg-green-500" }
              ]}
            />
          }
          trigger={['hover', 'click']}
          placement="bottomRight"
          overlayClassName="rich-notification-popover"
          mouseEnterDelay={0.1}
        >
          <button
            onClick={() => router.push("/admin/reports")}
            className="flex items-center justify-center p-2 rounded-full hover:bg-white/10 transition-all text-white active:scale-95 relative"
          >
            <Badge count={counts.reports?.PENDING} size="small" offset={[2, 0]} className="custom-badge" showZero={false} overflowCount={99}>
              <HiOutlineDocumentReport size={20} className="text-white opacity-80 hover:opacity-100" />
            </Badge>
          </button>
        </Popover>

        {/* Support Notification */}
        <Popover
          content={
            <NotificationPopover
              title="Support Desk"
              icon={HiOutlineSupport}
              counts={counts.support}
              path="/admin/support"
              statuses={[
                { label: "Open Tickets", key: "OPEN", colorClass: "bg-blue-500" },
                { label: "In Progress", key: "IN_PROGRESS", colorClass: "bg-orange-500" },
                { label: "Closed Tickets", key: "CLOSED", colorClass: "bg-slate-400" }
              ]}
            />
          }
          trigger={['hover', 'click']}
          placement="bottomRight"
          overlayClassName="rich-notification-popover"
        >
          <button
            onClick={() => router.push("/admin/support")}
            className="flex items-center justify-center p-2 rounded-full hover:bg-white/10 transition-all text-white active:scale-95"
          >
            <Badge count={counts.support?.OPEN} size="small" offset={[2, 0]} className="custom-badge" showZero={false} overflowCount={99}>
              <HiOutlineSupport size={20} className="text-white opacity-80 hover:opacity-100" />
            </Badge>
          </button>
        </Popover>

        {/* Contact Messages Notification */}
        <Popover
          content={
            <NotificationPopover
              title="Contact Center"
              icon={HiOutlineMail}
              counts={counts.contacts}
              path="/admin/contact-us"
              statuses={[
                { label: "New Messages", key: "PENDING", colorClass: "bg-red-500" },
                { label: "Under Review", key: "REVIEWED", colorClass: "bg-blue-500" },
                { label: "Replied/Resolved", key: "RESOLVED", colorClass: "bg-green-500" }
              ]}
            />
          }
          trigger={['hover', 'click']}
          placement="bottomRight"
          overlayClassName="rich-notification-popover"
        >
          <button
            onClick={() => router.push("/admin/contact-us")}
            className="flex items-center justify-center p-2 rounded-full hover:bg-white/10 transition-all text-white active:scale-95"
          >
            <Badge count={counts.contacts?.PENDING} size="small" offset={[2, 0]} className="custom-badge" showZero={false} overflowCount={99}>
              <HiOutlineMail size={20} className="text-white opacity-80 hover:opacity-100" />
            </Badge>
          </button>
        </Popover>

        <div className="w-[1px] h-6 bg-white/20 mx-1" />

          <button
            onClick={() => setIsProfileOpen(true)}
            className="flex items-center gap-2 p-1 px-1 rounded-full transition-all border border-white/20 group shadow-sm active:scale-95"
          >
            <Avatar
              size={24}
              src={user?.profileImage}
              icon={<FaUserCircle />}
              className="bg-transparent border-0 ring-1 ring-white/30"
            />
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
