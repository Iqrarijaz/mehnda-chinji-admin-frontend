import React from "react";
import {
    AreaChart,
    Area,
    ResponsiveContainer,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    Legend
} from "recharts";

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-slate-900/95 text-white p-3 rounded-lg border border-slate-700 shadow-xl text-xs backdrop-blur-md">
                <p className="font-bold text-slate-300 border-b border-slate-700 pb-1.5 mb-2">{label}</p>
                {payload.map((entry, index) => (
                    <div key={index} className="flex items-center gap-2 my-1">
                        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
                        <span className="text-slate-400 capitalize">{entry.name}:</span>
                        <span className="font-black text-white">{entry.value}</span>
                    </div>
                ))}
            </div>
        );
    }
    return null;
};

const UserTrendsChart = React.memo(({ data = [] }) => {
    const safeData = data.length > 0 ? data : [
        { formattedDate: "Mon", activeUsers: 0, newUsers: 0 },
        { formattedDate: "Tue", activeUsers: 0, newUsers: 0 },
        { formattedDate: "Wed", activeUsers: 0, newUsers: 0 },
        { formattedDate: "Thu", activeUsers: 0, newUsers: 0 },
        { formattedDate: "Fri", activeUsers: 0, newUsers: 0 },
        { formattedDate: "Sat", activeUsers: 0, newUsers: 0 },
        { formattedDate: "Sun", activeUsers: 0, newUsers: 0 }
    ];

    return (
        <div className="w-full h-72">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={safeData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                        <linearGradient id="activeUsersGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#006666" stopOpacity={0.35} />
                            <stop offset="95%" stopColor="#006666" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="newUsersGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#6366F1" stopOpacity={0.35} />
                            <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(148, 163, 184, 0.15)" />
                    <XAxis
                        dataKey="formattedDate"
                        tickLine={false}
                        axisLine={false}
                        tick={{ fontSize: 10, fill: "#94A3B8", fontWeight: 700 }}
                    />
                    <YAxis
                        tickLine={false}
                        axisLine={false}
                        tick={{ fontSize: 10, fill: "#94A3B8", fontWeight: 700 }}
                        allowDecimals={false}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend
                        wrapperStyle={{ paddingTop: "12px", fontSize: "11px", fontWeight: 700 }}
                        formatter={(value) => <span className="text-slate-600 dark:text-slate-300 uppercase tracking-wider text-[10px]">{value}</span>}
                    />
                    <Area
                        name="Active App Users"
                        type="monotone"
                        dataKey="activeUsers"
                        stroke="#006666"
                        strokeWidth={2.5}
                        fillOpacity={1}
                        fill="url(#activeUsersGrad)"
                    />
                    <Area
                        name="New Signups"
                        type="monotone"
                        dataKey="newUsers"
                        stroke="#6366F1"
                        strokeWidth={2.5}
                        fillOpacity={1}
                        fill="url(#newUsersGrad)"
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
});

UserTrendsChart.displayName = "UserTrendsChart";

export default UserTrendsChart;
