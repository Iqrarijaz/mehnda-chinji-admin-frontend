import React, { memo, useMemo } from "react";
import { Spin, Empty } from "antd";
import { ClockCircleOutlined } from "@ant-design/icons";
import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Cell
} from "recharts";

const PeakUsageChart = memo(function PeakUsageChart({ data = [], isLoading }) {
    const maxActiveHour = useMemo(() => {
        if (!data.length) return null;
        return [...data].sort((a, b) => b.activeCount - a.activeCount)[0];
    }, [data]);

    const maxCount = maxActiveHour?.activeCount || 0;

    return (
        <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-100 dark:border-slate-700/60 shadow-sm flex flex-col h-full">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <span className="w-8 h-8 rounded-lg bg-amber-100/60 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center text-sm font-bold">
                        <ClockCircleOutlined />
                    </span>
                    <div>
                        <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 m-0">
                            24-Hour Peak Activity Heatmap
                        </h4>
                        <p className="text-[11px] text-slate-400 m-0">
                            Highest Peak: <span className="font-semibold text-amber-600 dark:text-amber-400">{maxActiveHour ? `${maxActiveHour.hour} (${maxActiveHour.activeCount} active)` : "N/A"}</span>
                        </p>
                    </div>
                </div>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Hourly Distribution
                </span>
            </div>

            <div className="flex-1 w-full min-h-[260px] flex items-center justify-center">
                {isLoading ? (
                    <Spin />
                ) : data.length === 0 ? (
                    <Empty description="No hourly activity data available" />
                ) : (
                    <ResponsiveContainer width="100%" height={260}>
                        <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                            <XAxis dataKey="hour" tick={{ fontSize: 9, fill: "#94a3b8" }} interval={1} />
                            <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} allowDecimals={false} />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: "#1e293b",
                                    borderRadius: "8px",
                                    border: "none",
                                    color: "#fff",
                                    fontSize: "12px"
                                }}
                                itemStyle={{ color: "#f59e0b" }}
                            />
                            <Bar dataKey="activeCount" name="Active Users" radius={[4, 4, 0, 0]}>
                                {data.map((entry, index) => {
                                    const isPeak = maxCount > 0 && entry.activeCount === maxCount;
                                    return (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={isPeak ? "#ea580c" : "#f59e0b"}
                                            fillOpacity={isPeak ? 1 : 0.75}
                                        />
                                    );
                                })}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                )}
            </div>
        </div>
    );
});

PeakUsageChart.displayName = "PeakUsageChart";

export default PeakUsageChart;
