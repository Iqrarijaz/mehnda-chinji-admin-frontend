import React, { memo, useMemo } from "react";
import { Spin, Empty } from "antd";
import { PieChartOutlined } from "@ant-design/icons";
import {
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Tooltip
} from "recharts";

const CATEGORY_COLORS = [
    "#0284c7",
    "#10b981",
    "#f59e0b",
    "#8b5cf6",
    "#ec4899",
    "#06b6d4",
    "#84cc16",
    "#64748b"
];

const MarketplaceCategoryChart = memo(function MarketplaceCategoryChart({ data = [], isLoading }) {
    const totalCount = useMemo(() => {
        return data.reduce((acc, curr) => acc + (curr.count || 0), 0);
    }, [data]);

    const formattedData = useMemo(() => {
        return data.map((item, idx) => ({
            ...item,
            color: CATEGORY_COLORS[idx % CATEGORY_COLORS.length],
            percentage: totalCount > 0 ? ((item.count / totalCount) * 100).toFixed(1) : 0
        }));
    }, [data, totalCount]);

    return (
        <div className="bg-white dark:bg-slate-900 rounded p-5 border border-slate-100 dark:border-slate-800 shadow-none flex flex-col h-full">
            <div className="flex items-center justify-between mb-4 border-b border-slate-50 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                    <span className="w-8 h-8 rounded bg-purple-100/60 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 flex items-center justify-center text-sm font-bold">
                        <PieChartOutlined />
                    </span>
                    <div>
                        <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 m-0">
                            Marketplace Category Share
                        </h4>
                        <p className="text-[11px] text-slate-400 m-0">
                            Total Categorized Items: <span className="font-semibold text-purple-600 dark:text-purple-400">{totalCount.toLocaleString()}</span>
                        </p>
                    </div>
                </div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800">
                    Breakdown
                </span>
            </div>

            <div className="flex-1 w-full min-h-[260px] flex flex-col items-center justify-center">
                {isLoading ? (
                    <Spin />
                ) : formattedData.length === 0 ? (
                    <Empty description="No category data available" />
                ) : (
                    <>
                        <ResponsiveContainer width="100%" height={180}>
                            <PieChart>
                                <Pie
                                    data={formattedData}
                                    dataKey="count"
                                    nameKey="category"
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={80}
                                    innerRadius={45}
                                    paddingAngle={3}
                                >
                                    {formattedData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: "#0f172a",
                                        borderRadius: "4px",
                                        border: "1px solid #334155",
                                        color: "#fff",
                                        fontSize: "12px"
                                    }}
                                    formatter={(val, name, item) => [
                                        `${val} items (${item.payload.percentage}%)`,
                                        name
                                    ]}
                                />
                            </PieChart>
                        </ResponsiveContainer>

                        {/* Category Chips Legend */}
                        <div className="flex flex-wrap items-center justify-center gap-2 mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 w-full">
                            {formattedData.slice(0, 6).map((item) => (
                                <div
                                    key={item.category}
                                    className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-50 dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/50 text-[11px]"
                                >
                                    <span
                                        className="w-2 h-2 rounded-full"
                                        style={{ backgroundColor: item.color }}
                                    />
                                    <span className="font-medium text-slate-700 dark:text-slate-300 capitalize">
                                        {item.category}
                                    </span>
                                    <span className="text-slate-400 font-semibold">
                                        {item.percentage}%
                                    </span>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
});

MarketplaceCategoryChart.displayName = "MarketplaceCategoryChart";

export default MarketplaceCategoryChart;
