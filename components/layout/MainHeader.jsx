import { MenuContext } from "@/context/MenuContext";
import React, { useContext, useEffect, useState } from "react";
import { RiMenuUnfold2Fill, RiMenuUnfoldFill } from "react-icons/ri";
import { FaUserCircle } from "react-icons/fa";
import { HiOutlineDocumentReport, HiOutlineSupport, HiOutlineMail } from "react-icons/hi";
import { Badge, Tooltip } from "antd";
import { useRouter } from "next/navigation";
import ProfileModal from "./ProfileModal";
import { GET_REPORT_STATUS_COUNTS } from "@/app/api/admin/reports";
import { GET_SUPPORT_STATUS_COUNTS } from "@/app/api/admin/support";
import { GET_CONTACT_STATUS_COUNTS } from "@/app/api/admin/contact-us";

function MainHeader() {
  const { open, toggleMenu } = useContext(MenuContext);
  const router = useRouter();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [counts, setCounts] = useState({
    reports: 0,
    support: 0,
    contacts: 0
  });

  const fetchCounts = async () => {
    try {
      const [reportsRes, supportRes, contactsRes] = await Promise.all([
        GET_REPORT_STATUS_COUNTS(),
        GET_SUPPORT_STATUS_COUNTS(),
        GET_CONTACT_STATUS_COUNTS()
      ]);

      setCounts({
        reports: reportsRes?.data || {},
        support: supportRes?.data || {},
        contacts: contactsRes?.data || {}
      });
    } catch (error) {
      console.error("Error fetching notification counts:", error);
    }
  };

  useEffect(() => {
    fetchCounts();
    // Refresh counts every minute
    const interval = setInterval(fetchCounts, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleToggle = (e) => {
    e.preventDefault();
    toggleMenu(!open);
  };

  return (
    <div className="main-app-header flex items-center justify-between px-6 sticky top-0 z-40">
      <div className="flex items-center gap-4">
        <button
          onClick={handleToggle}
          className="menu-icon flex items-center justify-center"
          aria-label="Toggle menu"
        >
          {open ? (
            <RiMenuUnfold2Fill size={22} className="text-white" />
          ) : (
            <RiMenuUnfoldFill size={22} className="text-white" />
          )}
        </button>
      </div>

      {/* Right side - Notifications & Profile */}
      <div className="flex items-center gap-2">
        {/* Reports Notification */}
        <Tooltip title={`Pending: ${counts.reports?.PENDING || 0}, Reviewed: ${counts.reports?.REVIEWED || 0}, Resolved: ${counts.reports?.RESOLVED || 0}`}>
          <button
            onClick={() => router.push("/admin/reports")}
            className="flex items-center justify-center p-2 rounded-full hover:bg-white/10 transition-all text-white active:scale-95"
          >
            <Badge count={counts.reports?.PENDING} size="small" offset={[2, 0]} className="custom-badge" showZero={false}>
              <HiOutlineDocumentReport size={20} className="text-white" />
            </Badge>
          </button>
        </Tooltip>

        {/* Support Notification */}
        <Tooltip title={`Open: ${counts.support?.OPEN || 0}, In Progress: ${counts.support?.IN_PROGRESS || 0}, Closed: ${counts.support?.CLOSED || 0}`}>
          <button
            onClick={() => router.push("/admin/support")}
            className="flex items-center justify-center p-2 rounded-full hover:bg-white/10 transition-all text-white active:scale-95"
          >
            <Badge count={counts.support?.OPEN} size="small" offset={[2, 0]} className="custom-badge" showZero={false}>
              <HiOutlineSupport size={20} className="text-white" />
            </Badge>
          </button>
        </Tooltip>

        {/* Contact Messages Notification */}
        <Tooltip title={`Pending: ${counts.contacts?.PENDING || 0}, Reviewed: ${counts.contacts?.REVIEWED || 0}, Resolved: ${counts.contacts?.RESOLVED || 0}`}>
          <button
            onClick={() => router.push("/admin/contact-us")}
            className="flex items-center justify-center p-2 rounded-full hover:bg-white/10 transition-all text-white active:scale-95"
          >
            <Badge count={counts.contacts?.PENDING} size="small" offset={[2, 0]} className="custom-badge" showZero={false}>
              <HiOutlineMail size={20} className="text-white" />
            </Badge>
          </button>
        </Tooltip>

        <div className="w-[1px] h-6 bg-white/20 mx-1" />

        <button
          onClick={() => setIsProfileOpen(true)}
          className="flex items-center gap-2 p-1 px-1 rounded-full hover:bg-white/10 transition-all border border-white/20 group shadow-sm active:scale-95"
        >
          <FaUserCircle size={32} className="text-white transition-colors" />
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
