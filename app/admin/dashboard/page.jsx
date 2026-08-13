"use client";

import React, { useEffect, useState, useMemo, useCallback } from "react";
import UseMount from "@/hooks/useMount";
import DashboardCard from "@/components/shared/DashboardCard";
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
    useCommunityStats,
    useMarketplaceStats,
    useSupportStats,
    useUserTrends
} from "./hooks/useDashboard";
import TrendingChart from "@/components/shared/TrendingChart";
import UserTrendsChart from "@/components/shared/UserTrendsChart";

import { timestampToDate } from "@/utils/date";

// Memoized Quick Action Button with premium tactical styling
const QuickActionButton = React.memo(({ icon, label, description, onClick, colorClass = "text-teal-600" }) => (
    <button
        onClick={onClick}
        className="flex flex-col items-start p-3.5 rounded-lg border border-slate-100 dark:border-slate-800/50 hover:border-teal-200 dark:hover:border-teal-900/40 hover:bg-white dark:hover:bg-slate-800 transition-all duration-300 group bg-slate-50/30 dark:bg-slate-900/50 relative overflow-hidden active:scale-[0.97] w-full"
    >
        <div className={`w-8 h-8 flex items-center justify-center bg-transparent ${colorClass} group-hover:scale-110 transition-transform duration-300 mb-2 text-2xl font-bold`}>
            {React.cloneElement(icon, { className: "text-2xl" })}
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
QuickActionButton.displayName = "QuickActionButton";

function DashBoard() {
    const isMounted = UseMount();
    const router = useRouter();

    const { data: community = {}, isLoading: commLoading, refetch: refetchComm } = useCommunityStats();
    const { data: marketplace = {}, isLoading: marketLoading, refetch: refetchMarket } = useMarketplaceStats();
    const { data: support = {}, isLoading: supportLoading, refetch: refetchSupport } = useSupportStats();
    const { data: userTrends = [], refetch: refetchTrends } = useUserTrends(7);

    const loading = commLoading || marketLoading || supportLoading;

    const stats = useMemo(() => {
        const u = community.users || {};
        const b = marketplace.businesses || {};
        const e = marketplace.essentials || {};
        const m = marketplace.listings || {};
        return {
            users: {
                active: u.active || u.ACTIVE || 0,
                inactive: u.inactive || u.INACTIVE || 0,
                total: u.total || 0
            },
            businesses: {
                approved: b.approved || b.APPROVED || 0,
                pending: b.pending || b.PENDING || 0,
                rejected: b.rejected || b.REJECTED || 0,
                total: b.total || 0
            },
            essentials: {
                approved: e.approved || e.APPROVED || 0,
                pending: e.pending || e.PENDING || 0,
                rejected: e.rejected || e.REJECTED || 0,
                total: e.total || 0
            },
            marketplaceListings: {
                live: m.live || 0,
                pending: m.pending || 0,
                rejected: m.rejected || 0,
                sold: m.sold || 0,
                total: m.total || 0
            },
            reports: support.reports || { PENDING: 0, REVIEWED: 0, RESOLVED: 0, TOTAL: 0 },
            support: support.support || support.supportTickets || { OPEN: 0, IN_PROGRESS: 0, CLOSED: 0, TOTAL: 0 },
            contacts: support.contacts || support.contactRequests || { PENDING: 0, REVIEWED: 0, RESOLVED: 0, TOTAL: 0 }
        };
    }, [community, marketplace, support]);

    const fetchData = async () => {
        refetchComm();
        refetchMarket();
        refetchSupport();
        refetchTrends();
    };

    // Helper to generate trend sparkline data ending at current count
    const generateTrendData = useCallback((currentCount) => {
        if (!currentCount) return Array(7).fill({ value: 0 });
        return Array.from({ length: 7 }).map((_, i) => {
            const day = i + 1;
            const noise = Math.floor(Math.random() * (currentCount * 0.05));
            const baseValue = Math.floor((currentCount / 7) * day);
            return { value: Math.max(0, baseValue - noise) };
        });
    }, []);

    const dashboardStats = useMemo(() => [
        { title: "User Directory", count: stats.users.total, icon: <UserOutlined />, color: "teal", hexColor: "#006666" },
        { title: "Approved Businesses", count: stats.businesses.approved, icon: <ShopOutlined />, color: "indigo", hexColor: "#6366f1" },
        { title: "Approved Essentials", count: stats.essentials.approved, icon: <EnvironmentOutlined />, color: "emerald", hexColor: "#10b981" },
        { title: "Pending Reviews", count: stats.businesses.pending + stats.essentials.pending + stats.marketplaceListings.pending, icon: <ClockCircleOutlined />, color: "amber", hexColor: "#f59e0b" }
    ], [stats]);

    if (!isMounted) return null;

    return (
        <div className="space-y-6 min-h-screen">
            {/* Premium Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded bg-[#006666] flex items-center justify-center text-white">
                        <RocketOutlined className="text-2xl" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-2xl font-black text-slate-800 dark:text-slate-100 tracking-tight leading-none uppercase">
                                Dashboard
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
                    <div className="flex items-center gap-2 text-[10px] font-black text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-900/10 px-3 py-2 rounded-full border border-teal-100 dark:border-teal-900/20 uppercase tracking-widest ">
                        <div className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse" />
                        Live Monitor Active
                    </div>
                    <button
                        onClick={fetchData}
                        className="p-2 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-400 dark:text-slate-500 hover:text-teal-600 dark:hover:text-teal-400 hover:border-teal-200 dark:hover:border-teal-900/30 transition-all active:scale-95"
                    >
                        <HistoryOutlined />
                    </button>
                </div>
            </div>

            {/* Premium Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {dashboardStats.map((stat, i) => (
                    <DashboardCard
                        key={i}
                        title={stat.title}
                        value={(stat.count || 0).toLocaleString()}
                        icon={stat.icon}
                        color={stat.color}
                        trendChart={
                            <TrendingChart data={generateTrendData(stat.count)} color={stat.hexColor} height={16} />
                        }
                    />
                ))}
            </div>

            {/* Daily User Trends & Analytics Chart Section */}
            <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-100 dark:border-slate-800 p-5 shadow-sm">
                <div className="flex items-center justify-between mb-4 border-b border-slate-100 dark:border-slate-800 pb-3">
                    <div>
                        <h3 className="text-sm font-black text-slate-800 dark:text-slate-100 uppercase tracking-wider">
                            Daily User Activity & Signup Trends
                        </h3>
                        <p className="text-[10px] font-medium text-slate-400 mt-0.5">
                            Real-time tracking of active app users vs new user registrations over date & time
                        </p>
                    </div>
                    <Tag color="cyan" className="font-bold text-[10px] uppercase px-2 py-0.5">
                        7-Day Analysis
                    </Tag>
                </div>
                <UserTrendsChart data={userTrends} />
            </div>

            {/* Layout Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Center Section: Quick Actions & Alerts */}
                <div className="lg:col-span-12 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Quick Shortcuts */}
                        <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-100 dark:border-slate-800 overflow-hidden">
                            <div className="px-5 py-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/20 flex items-center justify-between">
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Tactical Shortcuts</span>
                                <PlusOutlined className="text-slate-300 dark:text-slate-600 text-xs" />
                            </div>
                            <div className="p-4 grid grid-cols-2 gap-3">
                                {[
                                    { label: "Add Essential", description: "Map new location", icon: <EnvironmentOutlined />, onClick: () => router.push("/admin/essentials?action=add"), colorClass: "text-amber-500" },
                                    { label: "Register Biz", description: "Onboard business", icon: <ShopOutlined />, onClick: () => router.push("/admin/business?action=add"), colorClass: "text-blue-500" },
                                    { label: "New Admin", description: "Elevate permissions", icon: <UserAddOutlined />, onClick: () => router.push("/admin/admin-users?action=add"), colorClass: "text-teal-500" },
                                    { label: "System Status", description: "Operational", icon: <HistoryOutlined />, onClick: () => fetchData(), colorClass: "text-slate-400" }
                                ].map((item, i) => (
                                    <QuickActionButton
                                        key={i}
                                        {...item}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Attention Required */}
                        <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-100 dark:border-slate-800 overflow-hidden">
                            <div className="px-5 py-3 border-b border-slate-50 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/20 flex items-center justify-between">
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-red-500">Critical Attention</span>
                                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                            </div>
                            <div className="divide-y divide-slate-50 dark:divide-slate-800">
                                {[
                                    { label: "Pending Reports", count: stats.reports.PENDING || 0, icon: <AlertOutlined />, color: "text-red-500", link: "/admin/reports" },
                                    { label: "Support Tickets", count: stats.support.OPEN || 0, icon: <CustomerServiceOutlined />, color: "text-amber-500", link: "/admin/support" },
                                    { label: "New Messages", count: stats.contacts.PENDING || 0, icon: <MailOutlined />, color: "text-blue-500", link: "/admin/contact-us" }
                                ].map((item, idx) => (
                                    <div
                                        key={idx}
                                        onClick={() => router.push(item.link)}
                                        className="px-5 py-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer group"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={`w-7 h-7 bg-transparent ${item.color} flex items-center justify-center text-xl font-bold group-hover:scale-110 transition-transform`}>
                                                {React.cloneElement(item.icon, { className: "text-xl" })}
                                            </div>
                                            <span className="text-xs font-bold text-slate-600 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-slate-100 transition-colors">{item.label}</span>
                                        </div>
                                        <span className={`text-[11px] font-black px-2 py-0.5 rounded bg-transparent ${item.color}`}>
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
