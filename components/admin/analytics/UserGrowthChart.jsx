import React, { memo, useMemo } from "react";
import { Spin, Empty } from "antd";
import { RiseOutlined } from "@ant-design/icons";
import {
    ResponsiveContainer,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip
} from "recharts";

const UserGrowthChart = memo(function UserGrowthChart({ data = [], isLoading }) {
    const totalRegistrations = useMemo(() => {
        return data.reduce((acc, curr) => acc + (curr.registrations || 0), 0);
    }, [data]);

    const formattedData = useMemo(() => {
        return data.map(item => ({
            ...item,
            formattedDate: item.date
        }));
    }, [data]);

    return (
        <div className="bg-white dark:bg-slate-900 rounded p-5 border-0 border-none shadow-none flex flex-col h-full">
            <div className="flex items-center justify-between mb-4 border-b border-slate-50 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2.5">
                    <span className="bg-transparent text-sky-600 dark:text-sky-400 flex items-center justify-center text-xl font-bold">
                        <RiseOutlined />
                    </span>
                    <div>
                        <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 m-0">
                            User Registrations Growth
                        </h4>
                        <p className="text-[11px] text-slate-400 m-0">
                            Total New Sign-ups: <span className="font-semibold text-sky-600 dark:text-sky-400">{totalRegistrations.toLocaleString()}</span>
                        </p>
                    </div>
                </div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800">
                    Daily Trend
                </span>
            </div>

            <div className="flex-1 w-full min-h-[260px] flex items-center justify-center">
                {isLoading ? (
                    <Spin />
                ) : formattedData.length === 0 ? (
                    <Empty description="No registration data in selected range" />
                ) : (
                    <ResponsiveContainer width="100%" height={260}>
                        <AreaChart data={formattedData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <defs>
                                <linearGradient id="userGrowthGrad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#0284c7" stopOpacity={0.4} />
                                    <stop offset="95%" stopColor="#0284c7" stopOpacity={0.0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" strokeOpacity={0.3} />
                            <XAxis dataKey="formattedDate" tick={{ fontSize: 10, fill: "#94a3b8" }} />
                            <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} allowDecimals={false} />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: "#0f172a",
                                    borderRadius: "4px",
                                    border: "1px solid #334155",
                                    color: "#fff",
                                    fontSize: "12px"
                                }}
                                itemStyle={{ color: "#38bdf8" }}
                            />
                            <Area
                                type="monotone"
                                dataKey="registrations"
                                name="Registrations"
                                stroke="#0284c7"
                                strokeWidth={2.5}
                                fillOpacity={1}
                                fill="url(#userGrowthGrad)"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                )}
            </div>
        </div>
    );
});

UserGrowthChart.displayName = "UserGrowthChart";

export default UserGrowthChart;
