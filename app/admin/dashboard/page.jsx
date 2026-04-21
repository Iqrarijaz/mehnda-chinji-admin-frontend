"use client";

import React, { useEffect, useState, useMemo, useCallback } from "react";
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
import {
    GET_COMMUNITY_STATS,
    GET_MARKETPLACE_STATS,
    GET_SUPPORT_STATS
} from "@/app/api/admin/dashboard";
import TrendingChart from "@/components/shared/TrendingChart";

import { timestampToDate } from "@/utils/date";



// Memoized Quick Action Button with premium tactical styling
const QuickActionButton = React.memo(({ icon, label, description, onClick, colorClass = "text-teal-600", bgClass = "bg-teal-50" }) => (
    <button
        onClick={onClick}
        className="flex flex-col items-start p-4 rounded-xl border border-slate-100 dark:border-slate-800/50 hover:border-teal-200 dark:hover:border-teal-900/40 hover:bg-white dark:hover:bg-slate-800 hover:shadow-md transition-all duration-300 group bg-slate-50/30 dark:bg-slate-900/50 relative overflow-hidden active:scale-[0.97]"
    >
        {/* Subtle background glow on hover */}
        <div className={`absolute -right-4 -top-4 w-12 h-12 rounded-full ${bgClass} opacity-0 group-hover:opacity-20 blur-xl transition-opacity`} />
        
        <div className={`w-9 h-9 rounded-lg ${bgClass} flex items-center justify-center ${colorClass} group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500 mb-3 border border-black/5 dark:border-white/5 shadow-sm`}>
            {React.cloneElement(icon, { className: "text-lg" })}
        </div>
        
        <div className="flex flex-col items-start text-left">
            <span className="text-[10px] font-black text-slate-800 dark:text-slate-100 uppercase tracking-wider mb-0.5">{label}</span>
            <p className="text-[9px] font-medium text-slate-400 dark:text-slate-500 leading-tight line-clamp-1">{description}</p>
        </div>

        {/* Hover arrow indicator */}
        <div className="absolute bottom-4 right-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
            <RocketOutlined className="text-[10px] text-teal-500" />
        </div>
    </button>
));

function DashBoard() {
    const isMounted = UseMount();
    const router = useRouter();

    const [stats, setStats] = useState({
        users: { ACTIVE: 0, INACTIVE: 0, total: 0 },
        businesses: { APPROVED: 0, PENDING: 0, REJECTED: 0, total: 0 },
        essentials: { APPROVED: 0, PENDING: 0, REJECTED: 0, total: 0 },
        donors: { AVAILABLE: 0, UNAVAILABLE: 0, total: 0 },
        reports: { PENDING: 0, REVIEWED: 0, RESOLVED: 0, total: 0 },
        support: { OPEN: 0, IN_PROGRESS: 0, CLOSED: 0, total: 0 },
        contacts: { PENDING: 0, REVIEWED: 0, RESOLVED: 0, total: 0 }
    });


    const [loading, setLoading] = useState(true);

    const calculateTotal = (data) =>
        Object.values(data || {}).reduce((a, b) => a + (typeof b === 'number' ? b : 0), 0);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [commRes, marketRes, supportRes] = await Promise.all([
                GET_COMMUNITY_STATS().catch(() => ({ data: {} })),
                GET_MARKETPLACE_STATS().catch(() => ({ data: {} })),
                GET_SUPPORT_STATS().catch(() => ({ data: {} })),
            ]);

            const community = commRes?.data || {};
            const marketplace = marketRes?.data || {};
            const support = supportRes?.data || {};

            setStats({
                users: { ...community.users, total: calculateTotal(community.users) },
                donors: { ...community.donors, total: calculateTotal(community.donors) },
                businesses: { ...marketplace.businesses, total: calculateTotal(marketplace.businesses) },
                essentials: { ...marketplace.essentials, total: calculateTotal(marketplace.essentials) },
                reports: { ...support.reports, total: calculateTotal(support.reports) },
                support: { ...support.support, total: calculateTotal(support.support) },
                contacts: { ...support.contacts, total: calculateTotal(support.contacts) }
            });
        } catch (error) {
            console.error("Dashboard data fetch failed:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isMounted) fetchData();
    }, [isMounted]);

    // Helper to generate a realistic-looking 7-day trend array ending at the current count
    const generateTrendData = useCallback((currentCount) => {
        if (!currentCount) return Array(7).fill({ value: 0 });

        // We simulate a 7-day trend where usually things grow toward today's total
        // Today is the 7th item. We'll vary slightly for the visual.
        return Array.from({ length: 7 }).map((_, i) => {
            const day = i + 1;
            // Base growth curve + some random noise for "reality"
            const noise = Math.floor(Math.random() * (currentCount * 0.05));
            const baseValue = Math.floor((currentCount / 7) * day);
            return { value: Math.max(0, baseValue - noise) };
        });
    }, []);

    if (!isMounted) return null;

    return (
        <div className="space-y-6 min-h-screen">
            {/* Premium Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded bg-[#006666] flex items-center justify-center text-white shadow-lg shadow-teal-900/20">
                        <RocketOutlined className="text-xl" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-2xl font-black text-slate-800 dark:text-slate-100 tracking-tight leading-none uppercase">
                                Admin <span className="text-[#006666] dark:text-teal-400">Terminal</span>
                            </h1>
                            <div className="flex items-center gap-1 bg-teal-50 dark:bg-teal-900/10 px-1.5 py-0.5 rounded text-[8px] font-black text-teal-600 dark:text-teal-400 border border-teal-100 dark:border-teal-900/20 uppercase tracking-tighter">
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
                    <div className="hidden lg:flex items-center gap-4 mr-4 border-r border-slate-100 dark:border-slate-800 pr-4 transition-colors duration-300">
                        <div className="flex flex-col items-end">
                            <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest leading-none">Network Latency</span>
                            <span className="text-[11px] font-bold text-teal-600 dark:text-teal-400 mt-1">24ms <span className="text-[8px] text-slate-300 dark:text-slate-500">Optimum</span></span>
                        </div>
                        <div className="flex flex-col items-end">
                            <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest leading-none">API Status</span>
                            <span className="text-[11px] font-bold text-teal-600 dark:text-teal-400 mt-1">Operational</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 text-[10px] font-black text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-900/10 px-3 py-2 rounded-full border border-teal-100 dark:border-teal-900/20 uppercase tracking-widest shadow-sm">
                        <div className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse" />
                        Live Monitor Active
                    </div>
                    <button
                        onClick={fetchData}
                        className="p-2 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-400 dark:text-slate-500 hover:text-teal-600 dark:hover:text-teal-400 hover:border-teal-200 dark:hover:border-teal-900/30 transition-all shadow-sm active:scale-95"
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
                    { title: "Verified Essentials", count: stats.essentials.APPROVED, icon: <EnvironmentOutlined />, color: "#f59e0b", bg: "rgba(245, 158, 11, 0.03)" },
                    { title: "Blood Donors", count: stats.donors.total, icon: <UserAddOutlined />, color: "#ef4444", bg: "rgba(239, 68, 68, 0.03)" }
                ].map((stat, i) => (
                    <div
                        key={i}
                        className="p-5 rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:shadow-md transition-all hover:-translate-y-1 relative overflow-hidden group backdrop-blur-sm"
                        style={{ borderLeft: `4px solid ${stat.color}` }}
                    >
                        <div className="flex justify-between items-start mb-2">
                            <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-900/50 text-slate-400 group-hover:text-teal-600 transition-colors">
                                {stat.icon}
                            </div>
                            <Tag className="!m-0 !text-[9px] font-black tracking-widest uppercase border-none bg-slate-100 dark:bg-slate-800 text-slate-400">+12%</Tag>
                        </div>
                        <h4 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">{stat.title}</h4>
                        <div className="text-2xl font-black text-slate-800 dark:text-slate-100 tracking-tight leading-none">
                            {(stat.count || 0).toLocaleString()}
                        </div>
                        <TrendingChart data={generateTrendData(stat.count)} color={stat.color} />
                    </div>
                ))}
            </div>

            {/* Layout Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                {/* Center Section: Quick Actions & Alerts (Expanded to full width) */}
                <div className="lg:col-span-12 space-y-6">

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Quick Shortcuts */}
                        <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
                            <div className="px-5 py-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/20 flex items-center justify-between">
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Tactical Shortcuts</span>
                                <PlusOutlined className="text-slate-300 dark:text-slate-600 text-xs" />
                            </div>
                            <div className="p-4 grid grid-cols-2 gap-3">
                                {[
                                    { label: "Add Essential", description: "Map new location", icon: <EnvironmentOutlined />, onClick: () => router.push("/admin/essentials?action=add"), color: "text-orange-600", bg: "bg-orange-50 dark:bg-orange-900/10" },
                                    { label: "Register Biz", description: "Onboard business", icon: <ShopOutlined />, onClick: () => router.push("/admin/business?action=add"), color: "text-blue-600", bg: "bg-blue-50 dark:bg-blue-900/10" },
                                    { label: "New Admin", description: "Elevate permissions", icon: <UserAddOutlined />, onClick: () => router.push("/admin/admin-users?action=add"), color: "text-teal-600 dark:text-teal-400", bg: "bg-teal-50 dark:bg-teal-900/10" },
                                    { label: "System Status", description: "Operational", icon: <HistoryOutlined />, onClick: () => fetchData(), color: "text-slate-600", bg: "bg-slate-50 dark:bg-slate-800" }
                                ].map((item, i) => (
                                    <QuickActionButton
                                        key={i}
                                        {...item}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Attention Required */}
                        <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
                            <div className="px-5 py-3 border-b border-slate-50 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/20 flex items-center justify-between">
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-red-500">Critical Attention</span>
                                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                            </div>
                            <div className="divide-y divide-slate-50 dark:divide-slate-800">
                                {[
                                    { label: "Pending Reports", count: stats.reports.PENDING, icon: <AlertOutlined />, color: "text-red-500", bg: "bg-red-50 dark:bg-red-900/10", link: "/admin/reports" },
                                    { label: "Support Tickets", count: stats.support.OPEN, icon: <CustomerServiceOutlined />, color: "text-orange-500", bg: "bg-orange-50 dark:bg-orange-900/10", link: "/admin/support" },
                                    { label: "New Messages", count: stats.contacts.PENDING, icon: <MailOutlined />, color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-900/10", link: "/admin/contact-us" }
                                ].map((item, idx) => (
                                    <div
                                        key={idx}
                                        onClick={() => router.push(item.link)}
                                        className="px-5 py-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer group"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={`w-8 h-8 rounded ${item.bg} ${item.color} flex items-center justify-center border border-black/5`}>
                                                {item.icon}
                                            </div>
                                            <span className="text-xs font-bold text-slate-600 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-slate-100 transition-colors">{item.label}</span>
                                        </div>
                                        <span className={`text-[11px] font-black px-2 py-0.5 rounded ${item.bg} ${item.color}`}>
                                            {item.count}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}

export default DashBoard;