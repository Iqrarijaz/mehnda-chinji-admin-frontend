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
        <div className="bg-white dark:bg-slate-900 rounded p-5 border-0 border-none shadow-none flex flex-col h-full">
            <div className="flex items-center justify-between mb-4 border-b border-slate-50 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2.5">
                    <span className="bg-transparent text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-xl font-bold">
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
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800">
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
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" strokeOpacity={0.3} />
                            <XAxis dataKey="date" tick={{ fontSize: 10, fill: "#94a3b8" }} />
                            <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} allowDecimals={false} />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: "#0f172a",
                                    borderRadius: "4px",
                                    border: "1px solid #334155",
                                    color: "#fff",
                                    fontSize: "12px"
                                }}
                                itemStyle={{ color: "#10b981" }}
                            />
                            <Bar
                                dataKey="listings"
                                name="New Listings"
                                fill="#10b981"
                                radius={[2, 2, 0, 0]}
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
