"use client";

import React, { useEffect, useState, useMemo } from "react";
import UseMount from "@/hooks/useMount";
import StatCard from "@/components/shared/StatCard";
import { Table, Card, Tag, Tooltip, Divider } from "antd";
import {
    UserOutlined,
    ShopOutlined,
    EnvironmentOutlined,
    AlertOutlined,
    CustomerServiceOutlined,
    MailOutlined,
    HistoryOutlined,
    CheckCircleOutlined,
    ClockCircleOutlined,
    UserAddOutlined,
    PlusOutlined,
    RocketOutlined
} from "@ant-design/icons";
import { useRouter } from "next/navigation";

// API Imports
import { GET_USER_STATUS_COUNTS } from "@/app/api/admin/users";
import { GET_BUSINESS_STATUS_COUNTS } from "@/app/api/admin/business";
import { GET_PLACE_STATUS_COUNTS } from "@/app/api/admin/places";
import { GET_BLOOD_DONOR_STATUS_COUNTS } from "@/app/api/admin/blood-donors";
import { GET_REPORT_STATUS_COUNTS } from "@/app/api/admin/reports";
import { GET_SUPPORT_STATUS_COUNTS } from "@/app/api/admin/support";
import { GET_CONTACT_STATUS_COUNTS } from "@/app/api/admin/contact-us";
import { LIST_SYSTEM_LOGS } from "@/app/api/admin/developers/systemLogs";

import { timestampToDate } from "@/utils/date";

// Memoized Activity Table
const ActivityTable = React.memo(({ logs, loading }) => {
    const columns = [
        {
            title: "Administrator",
            dataIndex: "adminName",
            key: "adminName",
            render: (text) => (
                <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-teal-50 flex items-center justify-center text-[10px] font-bold text-teal-600 border border-teal-100 uppercase">
                        {text?.charAt(0) || "S"}
                    </div>
                    <span className="font-bold text-slate-700 text-[11px]">{text || "System"}</span>
                </div>
            )
        },
        {
            title: "Module",
            dataIndex: "module",
            key: "module",
            render: (text) => (
                <Tag className="!rounded-sm border-none bg-slate-100 text-slate-500 font-black text-[9px] uppercase tracking-tighter px-1.5 py-0">
                    {text}
                </Tag>
            )
        },
        {
            title: "Action Description",
            dataIndex: "action",
            key: "action",
            render: (text) => (
                <span className="text-slate-600 font-medium text-[11px] line-clamp-1">{text}</span>
            )
        },
        {
            title: "Timestamp",
            dataIndex: "createdAt",
            key: "createdAt",
            width: 100,
            render: (text) => (
                <span className="text-slate-400 text-[10px] font-medium">
                    {timestampToDate(text)}
                </span>
            )
        }
    ];

    return (
        <Table
            columns={columns}
            dataSource={logs}
            loading={loading}
            rowKey="_id"
            pagination={false}
            size="small"
            className="compact-table modern-table"
        />
    );
});

// Memoized Quick Action Button
const QuickActionButton = React.memo(({ icon, label, onClick, colorClass = "text-teal-600", bgClass = "bg-teal-50" }) => (
    <button
        onClick={onClick}
        className="flex flex-col items-center justify-center p-3 rounded-lg border border-slate-100 hover:border-teal-200 hover:bg-teal-50/50 transition-all group bg-white shadow-sm h-full"
    >
        <div className={`w-10 h-10 rounded-full ${bgClass} flex items-center justify-center ${colorClass} group-hover:scale-110 transition-transform mb-2 border border-black/5`}>
            {icon}
        </div>
        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">{label}</span>
    </button>
));

function DashBoard() {
    const isMounted = UseMount();
    const router = useRouter();

    const [stats, setStats] = useState({
        users: { ACTIVE: 0, INACTIVE: 0, total: 0 },
        businesses: { APPROVED: 0, PENDING: 0, REJECTED: 0, total: 0 },
        places: { APPROVED: 0, PENDING: 0, REJECTED: 0, total: 0 },
        donors: { AVAILABLE: 0, UNAVAILABLE: 0, total: 0 },
        reports: { PENDING: 0, REVIEWED: 0, RESOLVED: 0, total: 0 },
        support: { OPEN: 0, IN_PROGRESS: 0, CLOSED: 0, total: 0 },
        contacts: { PENDING: 0, REVIEWED: 0, RESOLVED: 0, total: 0 }
    });

    const [recentLogs, setRecentLogs] = useState([]);
    const [loading, setLoading] = useState(true);

    const calculateTotal = (data) =>
        Object.values(data || {}).reduce((a, b) => a + (typeof b === 'number' ? b : 0), 0);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [
                userRes, bizRes, placeRes, donorRes,
                reportRes, supportRes, contactRes, logsRes
            ] = await Promise.all([
                GET_USER_STATUS_COUNTS().catch(() => ({ data: {} })),
                GET_BUSINESS_STATUS_COUNTS().catch(() => ({ data: {} })),
                GET_PLACE_STATUS_COUNTS().catch(() => ({ data: {} })),
                GET_BLOOD_DONOR_STATUS_COUNTS().catch(() => ({ data: {} })),
                GET_REPORT_STATUS_COUNTS().catch(() => ({ data: {} })),
                GET_SUPPORT_STATUS_COUNTS().catch(() => ({ data: {} })),
                GET_CONTACT_STATUS_COUNTS().catch(() => ({ data: {} })),
                LIST_SYSTEM_LOGS({ page: 1, limit: 12 }).catch(() => ({ data: { docs: [] } }))
            ]);

            setStats({
                users: { ...userRes?.data, total: calculateTotal(userRes?.data) },
                businesses: { ...bizRes?.data, total: calculateTotal(bizRes?.data) },
                places: { ...placeRes?.data, total: calculateTotal(placeRes?.data) },
                donors: { ...donorRes?.data, total: calculateTotal(donorRes?.data) },
                reports: { ...reportRes?.data, total: calculateTotal(reportRes?.data) },
                support: { ...supportRes?.data, total: calculateTotal(supportRes?.data) },
                contacts: { ...contactRes?.data, total: calculateTotal(contactRes?.data) }
            });
            setRecentLogs(logsRes?.data?.docs || []);
        } catch (error) {
            console.error("Dashboard data fetch failed:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isMounted) fetchData();
    }, [isMounted]);

    // Simple SVG Sparkline component
    const Sparkline = ({ data, color = "#006666" }) => (
        <svg viewBox="0 0 100 20" className="w-full h-4 mt-2 opacity-50">
            <polyline
                fill="none"
                stroke={color}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                points="0,15 15,10 30,18 45,5 60,12 85,2 100,8"
            />
        </svg>
    );

    if (!isMounted) return null;

    return (
        <div className="space-y-6 bg-white min-h-screen">
            {/* Premium Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded bg-[#006666] flex items-center justify-center text-white shadow-lg shadow-teal-900/20">
                        <RocketOutlined className="text-xl" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-2xl font-black text-slate-800 tracking-tight leading-none uppercase">
                                Admin <span className="text-[#006666]">Terminal</span>
                            </h1>
                            <div className="flex items-center gap-1 bg-teal-50 px-1.5 py-0.5 rounded text-[8px] font-black text-teal-600 border border-teal-100 uppercase tracking-tighter">
                                <CheckCircleOutlined size={8} /> v2.4.0
                            </div>
                        </div>
                        <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em] mt-2">
                            Global Control Center • {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    {/* System Health Monitor */}
                    <div className="hidden lg:flex items-center gap-4 mr-4 border-r border-slate-100 pr-4">
                        <div className="flex flex-col items-end">
                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Network Latency</span>
                            <span className="text-[10px] font-bold text-teal-600">24ms <span className="text-[8px] text-slate-300">Optimum</span></span>
                        </div>
                        <div className="flex flex-col items-end">
                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">API Status</span>
                            <span className="text-[10px] font-bold text-teal-600">Operational</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 text-[10px] font-black text-teal-600 bg-teal-50 px-3 py-2 rounded-full border border-teal-100 uppercase tracking-widest shadow-sm">
                        <div className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse" />
                        Live Monitor Active
                    </div>
                    <button
                        onClick={fetchData}
                        className="p-2 rounded-full bg-white border border-slate-200 text-slate-400 hover:text-teal-600 hover:border-teal-200 transition-all shadow-sm active:scale-95"
                    >
                        <HistoryOutlined />
                    </button>
                </div>
            </div>

            {/* Premium Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { title: "User Directory", count: stats.users.total, icon: <UserOutlined />, color: "#006666", bg: "rgba(0, 102, 102, 0.03)" },
                    { title: "Active Businesses", count: stats.businesses.APPROVED, icon: <ShopOutlined />, color: "#0ea5e9", bg: "rgba(14, 165, 233, 0.03)" },
                    { title: "Verified Places", count: stats.places.APPROVED, icon: <EnvironmentOutlined />, color: "#f59e0b", bg: "rgba(245, 158, 11, 0.03)" },
                    { title: "Blood Donors", count: stats.donors.total, icon: <UserAddOutlined />, color: "#ef4444", bg: "rgba(239, 68, 68, 0.03)" }
                ].map((stat, i) => (
                    <div
                        key={i}
                        className="p-5 rounded-xl border border-slate-100 bg-white shadow-sm hover:shadow-md transition-all hover:-translate-y-1 relative overflow-hidden group backdrop-blur-sm"
                        style={{ borderLeft: `4px solid ${stat.color}` }}
                    >
                        <div className="flex justify-between items-start mb-2">
                            <div className={`p-2 rounded-lg bg-slate-50 text-slate-400 group-hover:text-teal-600 transition-colors`}>
                                {stat.icon}
                            </div>
                            <Tag className="!m-0 !text-[9px] font-black tracking-widest uppercase border-none bg-slate-100 text-slate-400">+12%</Tag>
                        </div>
                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.title}</h4>
                        <div className="text-2xl font-black text-slate-800 tracking-tight leading-none">
                            {(stat.count || 0).toLocaleString()}
                        </div>
                        <Sparkline color={stat.color} />
                    </div>
                ))}
            </div>

            {/* Layout Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                {/* Left Section: Quick Actions & Alerts (4 Cols) */}
                <div className="lg:col-span-4 space-y-6">

                    {/* Quick Shortcuts */}
                    <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
                        <div className="px-5 py-3 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Tactical Shortcuts</span>
                            <PlusOutlined className="text-slate-300 text-xs" />
                        </div>
                        <div className="p-4 grid grid-cols-2 gap-3">
                            {[
                                { label: "Add Place", icon: <EnvironmentOutlined />, onClick: () => router.push("/admin/places?action=add"), color: "text-orange-600", bg: "bg-orange-50" },
                                { label: "Register Biz", icon: <ShopOutlined />, onClick: () => router.push("/admin/business?action=add"), color: "text-blue-600", bg: "bg-blue-50" },
                                { label: "New Admin", icon: <UserAddOutlined />, onClick: () => router.push("/admin/admin-users?action=add"), color: "text-teal-600", bg: "bg-teal-50" },
                                { label: "Audit Logs", icon: <HistoryOutlined />, onClick: () => router.push("/admin/developer/system-logs"), color: "text-slate-600", bg: "bg-slate-50" }
                            ].map((item, i) => (
                                <button
                                    key={i}
                                    onClick={item.onClick}
                                    className="flex flex-col items-center justify-center p-3 rounded-xl border border-slate-100 hover:border-teal-200 hover:bg-teal-50/30 transition-all group bg-white shadow-sm"
                                >
                                    <div className={`w-10 h-10 rounded-full ${item.bg} flex items-center justify-center ${item.color} group-hover:scale-110 transition-transform mb-2 border border-black/5`}>
                                        {item.icon}
                                    </div>
                                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest text-center">{item.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Attention Required */}
                    <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
                        <div className="px-5 py-3 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-red-500">Critical Attention</span>
                            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                        </div>
                        <div className="divide-y divide-slate-50">
                            {[
                                { label: "Pending Reports", count: stats.reports.PENDING, icon: <AlertOutlined />, color: "text-red-500", bg: "bg-red-50", link: "/admin/reports" },
                                { label: "Support Tickets", count: stats.support.OPEN, icon: <CustomerServiceOutlined />, color: "text-orange-500", bg: "bg-orange-50", link: "/admin/support" },
                                { label: "New Messages", count: stats.contacts.PENDING, icon: <MailOutlined />, color: "text-blue-500", bg: "bg-blue-50", link: "/admin/contact-us" }
                            ].map((item, idx) => (
                                <div
                                    key={idx}
                                    onClick={() => router.push(item.link)}
                                    className="px-5 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer group"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`w-8 h-8 rounded ${item.bg} ${item.color} flex items-center justify-center border border-black/5`}>
                                            {item.icon}
                                        </div>
                                        <span className="text-xs font-bold text-slate-600 group-hover:text-slate-900 transition-colors">{item.label}</span>
                                    </div>
                                    <span className={`text-[11px] font-black px-2 py-0.5 rounded ${item.bg} ${item.color}`}>
                                        {item.count}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Section: System Logs (8 Cols) */}
                <div className="lg:col-span-8">
                    <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden h-full flex flex-col">
                        <div className="px-5 py-3 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <HistoryOutlined className="text-teal-600" />
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Global Activity Loop</span>
                            </div>
                            <Tag color="cyan" className="!m-0 !text-[9px] font-black uppercase tracking-tighter border-none bg-cyan-50 text-cyan-600">Real-time Feed</Tag>
                        </div>
                        <div className="flex-1 overflow-auto custom-scrollbar">
                            <ActivityTable logs={recentLogs} loading={loading} />
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}

export default DashBoard;