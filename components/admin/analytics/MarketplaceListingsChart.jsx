import React, { memo, useMemo } from "react";
import { Spin, Empty } from "antd";
import { ShopOutlined } from "@ant-design/icons";
import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip
} from "recharts";

const MarketplaceListingsChart = memo(function MarketplaceListingsChart({ data = [], isLoading }) {
    const totalListingsInRange = useMemo(() => {
        return data.reduce((acc, curr) => acc + (curr.listings || 0), 0);
    }, [data]);

    return (
        <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-100 dark:border-slate-700/60 shadow-sm flex flex-col h-full">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <span className="w-8 h-8 rounded-lg bg-emerald-100/60 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-sm font-bold">
                        <ShopOutlined />
                    </span>
                    <div>
                        <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 m-0">
                            Marketplace Listings Velocity
                        </h4>
                        <p className="text-[11px] text-slate-400 m-0">
                            New Items Published: <span className="font-semibold text-emerald-600 dark:text-emerald-400">{totalListingsInRange.toLocaleString()}</span>
                        </p>
                    </div>
                </div>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Volume
                </span>
            </div>

            <div className="flex-1 w-full min-h-[260px] flex items-center justify-center">
                {isLoading ? (
                    <Spin />
                ) : data.length === 0 ? (
                    <Empty description="No marketplace listings published in selected range" />
                ) : (
                    <ResponsiveContainer width="100%" height={260}>
                        <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                            <XAxis dataKey="date" tick={{ fontSize: 10, fill: "#94a3b8" }} />
                            <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} allowDecimals={false} />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: "#1e293b",
                                    borderRadius: "8px",
                                    border: "none",
                                    color: "#fff",
                                    fontSize: "12px"
                                }}
                                itemStyle={{ color: "#10b981" }}
                            />
                            <Bar
                                dataKey="listings"
                                name="New Listings"
                                fill="#10b981"
                                radius={[4, 4, 0, 0]}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                )}
            </div>
        </div>
    );
});

MarketplaceListingsChart.displayName = "MarketplaceListingsChart";

export default MarketplaceListingsChart;
