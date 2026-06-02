"use client";
import React, { useState, useEffect } from "react";
import InnerPageCard from "@/components/layout/InnerPageCard";
import { GET_FINANCIAL_REPORT } from "@/app/api/admin/water-supply";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import { DatePicker } from "antd";
import { DollarOutlined, FallOutlined, RiseOutlined } from "@ant-design/icons";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { SkeletonPulse, StatCardSkeleton } from "@/components/shared/Skeletons";
import StatCard from "@/components/shared/StatCard";
import { downloadCSV } from "@/utils/export";
import { HiDownload } from "react-icons/hi";

export default function ReportsPage() {
    const [loading, setLoading] = useState(true);
    const [reportData, setReportData] = useState({
        summary: { totalIncome: 0, totalExpense: 0, netProfit: 0 },
        monthlyDetails: []
    });
    const [filters, setFilters] = useState({
        reportMonth: dayjs().format("YYYY-MM"),
    });

    useEffect(() => {
        fetchReport();
    }, [filters.reportMonth]);

    const fetchReport = async () => {
        try {
            setLoading(true);
            const res = await GET_FINANCIAL_REPORT({ months: 6, reportMonth: filters.reportMonth });
            if (res?.success) {
                // Reverse the array to show chronological order (oldest to newest) in the chart
                const chartData = [...res.data.monthlyDetails].reverse().map(item => {
                    const isDaily = item.month.length > 7;
                    return {
                        ...item,
                        monthLabel: isDaily
                            ? dayjs(item.month).format("MMM DD")
                            : dayjs(item.month + "-01").format("MMM YYYY")
                    };
                });
                setReportData({ summary: res.data.summary, monthlyDetails: chartData });
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || "Failed to fetch financial reports.");
        } finally {
            setLoading(false);
        }
    };

    const handleExport = React.useCallback(() => {
        if (!reportData?.monthlyDetails?.length) return;
        
        const formattedData = reportData.monthlyDetails.map((detail, index) => ({
            "S.No": index + 1,
            "Date": detail.monthLabel || "-",
            "Income": detail.income || 0,
            "Expense": detail.expense || 0,
            "Profit/Loss": (detail.income || 0) - (detail.expense || 0)
        }));
        
        downloadCSV(formattedData, `Water_Financial_Report_${filters.reportMonth || "Last_6_Months"}.csv`);
    }, [reportData?.monthlyDetails, filters.reportMonth]);

    const title = filters.reportMonth ? `Financial Reports (${dayjs(filters.reportMonth, "YYYY-MM").format("MMMM YYYY")})` : "Financial Reports (Last 6 Months)";

    if (loading) {
        return (
            <InnerPageCard title={title}>
                <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-2 md:gap-4 w-full">
                    <div className="grid grid-cols-2 md:flex gap-2 items-center md:flex-nowrap w-full md:w-auto">
                        <StatCardSkeleton />
                        <StatCardSkeleton />
                        <StatCardSkeleton />
                    </div>
                    <div className="flex flex-wrap justify-end w-full md:w-auto gap-1">
                        <DatePicker
                            picker="month"
                            format="MMMM YYYY"
                            value={filters.reportMonth ? dayjs(filters.reportMonth, "YYYY-MM") : null}
                            onChange={(date) => setFilters({ reportMonth: date ? date.format("YYYY-MM") : null })}
                            className="!h-[32px] !border-2 !rounded-[2px] !border-[#006666] dark:!border-teal-900/50 transition-all duration-300 hover:!border-teal-600 dark:hover:!border-teal-500/50"
                            placeholder="Select Month"
                            allowClear
                        />
                        <button
                            disabled
                            title="Download CSV"
                            className="flex items-center justify-center !h-[32px] !w-[32px] !border-2 !rounded-[2px] !border-[#006666] dark:!border-teal-900/50 !bg-white dark:!bg-slate-800 !text-[#006666] dark:!text-teal-400 hover:!bg-[#006666] dark:hover:!bg-teal-600 hover:!text-white shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <HiDownload size={16} />
                        </button>
                    </div>
                </div>
                <SkeletonPulse className="h-[400px] w-full" />
            </InnerPageCard>
        );
    }

    const { summary, monthlyDetails } = reportData;

    return (
        <InnerPageCard title={title}>
            <div className="flex flex-col md:flex-row justify-between items-center mb-2 gap-2 md:gap-4 w-full">
                {/* Summary Cards */}
                <div className="grid grid-cols-2 md:flex gap-2 items-center md:flex-nowrap w-full md:w-auto">
                    <StatCard
                        title="Total Income"
                        shortTitle="Income"
                        count={summary.totalIncome.toLocaleString()}
                        color="#10b981"
                        bg="#ecfdf5"
                        border="#a7f3d0"
                        icon={<RiseOutlined />}
                    />
                    <StatCard
                        title="Total Expenses"
                        shortTitle="Expenses"
                        count={summary.totalExpense.toLocaleString()}
                        color="#ef4444"
                        bg="#fef2f2"
                        border="#fecaca"
                        icon={<FallOutlined />}
                    />
                    <StatCard
                        title="Net Profit"
                        shortTitle="Net"
                        count={summary.netProfit.toLocaleString()}
                        color={summary.netProfit >= 0 ? "#3b82f6" : "#ef4444"}
                        bg={summary.netProfit >= 0 ? "#eff6ff" : "#fef2f2"}
                        border={summary.netProfit >= 0 ? "#bfdbfe" : "#fecaca"}
                        icon={<DollarOutlined />}
                    />
                </div>

                <div className="flex flex-wrap justify-end w-full md:w-auto gap-1">
                    <DatePicker
                        picker="month"
                        format="MMMM YYYY"
                        value={filters.reportMonth ? dayjs(filters.reportMonth, "YYYY-MM") : null}
                        onChange={(date) => setFilters({ reportMonth: date ? date.format("YYYY-MM") : null })}
                        className="!h-[32px] !border-2 !rounded-[2px] !border-[#006666] dark:!border-teal-900/50 transition-all duration-300 hover:!border-teal-600 dark:hover:!border-teal-500/50"
                        placeholder="Select Month"
                        allowClear
                    />
                    <button
                        onClick={handleExport}
                        disabled={!reportData?.monthlyDetails?.length}
                        title="Download CSV"
                        className="flex items-center justify-center !h-[32px] !w-[32px] !border-2 !rounded-[2px] !border-[#006666] dark:!border-teal-900/50 !bg-white dark:!bg-slate-800 !text-[#006666] dark:!text-teal-400 hover:!bg-[#006666] dark:hover:!bg-teal-600 hover:!text-white shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <HiDownload size={16} />
                    </button>
                </div>
            </div>

            {/* Area Chart */}
            <div className="p-5 rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
                <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-6">{filters.reportMonth ? "Income vs Expenses (Daily)" : "Income vs Expenses (Monthly)"}</h4>

                <div className="h-[400px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={monthlyDetails} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <XAxis
                                dataKey="monthLabel"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 10, fill: '#94a3b8' }}
                                dy={10}
                            />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 10, fill: '#94a3b8' }}
                                tickFormatter={(value) => `${value}`}
                                dx={-10}
                            />
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <Tooltip
                                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                                formatter={(value) => [`${value}`, undefined]}
                            />
                            <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '20px' }} />

                            <Area
                                type="monotone"
                                dataKey="income"
                                name="Income"
                                stroke="#10b981"
                                strokeWidth={3}
                                fillOpacity={1}
                                fill="url(#colorIncome)"
                            />
                            <Area
                                type="monotone"
                                dataKey="expense"
                                name="Expenses"
                                stroke="#ef4444"
                                strokeWidth={3}
                                fillOpacity={1}
                                fill="url(#colorExpense)"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </InnerPageCard>
    );
}
