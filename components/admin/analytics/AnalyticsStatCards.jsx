import React, { memo, useMemo } from "react";
import {
    UserOutlined,
    ShopOutlined,
    ClockCircleOutlined,
    TrophyOutlined
} from "@ant-design/icons";

// Internal Memoized Stat Item
const StatItem = memo(({ title, value, subtext, icon, colorClass, bgClass }) => (
    <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-100 dark:border-slate-700/60 shadow-sm flex items-center justify-between transition-all hover:shadow-md">
        <div>
            <p className="text-xs font-semibold text-slate-400 dark:text-slate-400 uppercase tracking-wider mb-1">
                {title}
            </p>
            <h3 className="text-2xl font-black text-slate-800 dark:text-slate-100 m-0">
                {value}
            </h3>
            {subtext && (
                <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400 mt-1 mb-0">
                    {subtext}
                </p>
            )}
        </div>
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${bgClass} ${colorClass} text-xl font-bold`}>
            {icon}
        </div>
    </div>
));
StatItem.displayName = "StatItem";

const AnalyticsStatCards = memo(function AnalyticsStatCards({ overview = {}, peakHour = "N/A" }) {
    const cardData = useMemo(() => {
        return [
            {
                id: "total_users",
                title: "Total Registered Users",
                value: (overview.totalUsers ?? 0).toLocaleString(),
                subtext: `+${(overview.newUsersInRange ?? 0).toLocaleString()} in selected range`,
                icon: <UserOutlined />,
                colorClass: "text-sky-600 dark:text-sky-400",
                bgClass: "bg-sky-100/60 dark:bg-sky-950/40"
            },
            {
                id: "marketplace_listings",
                title: "Marketplace Listings",
                value: (overview.totalListings ?? 0).toLocaleString(),
                subtext: `${(overview.activeListings ?? 0).toLocaleString()} Active / Live`,
                icon: <ShopOutlined />,
                colorClass: "text-emerald-600 dark:text-emerald-400",
                bgClass: "bg-emerald-100/60 dark:bg-emerald-950/40"
            },
            {
                id: "peak_usage",
                title: "Peak Usage Window",
                value: peakHour,
                subtext: "Highest hourly user traffic",
                icon: <ClockCircleOutlined />,
                colorClass: "text-amber-600 dark:text-amber-400",
                bgClass: "bg-amber-100/60 dark:bg-amber-950/40"
            },
            {
                id: "cricket_tournaments",
                title: "Cricket Tournaments",
                value: (overview.totalTournaments ?? 0).toLocaleString(),
                subtext: `${(overview.totalMatches ?? 0).toLocaleString()} Total Match Fixtures`,
                icon: <TrophyOutlined />,
                colorClass: "text-purple-600 dark:text-purple-400",
                bgClass: "bg-purple-100/60 dark:bg-purple-950/40"
            }
        ];
    }, [overview, peakHour]);

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {cardData.map((item) => (
                <StatItem
                    key={item.id}
                    title={item.title}
                    value={item.value}
                    subtext={item.subtext}
                    icon={item.icon}
                    colorClass={item.colorClass}
                    bgClass={item.bgClass}
                />
            ))}
        </div>
    );
});

AnalyticsStatCards.displayName = "AnalyticsStatCards";

export default AnalyticsStatCards;
