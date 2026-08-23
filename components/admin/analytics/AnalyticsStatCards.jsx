import React, { memo, useMemo } from "react";
import {
    UserOutlined,
    ShopOutlined,
    ClockCircleOutlined,
    TrophyOutlined
} from "@ant-design/icons";

// Internal Memoized Stat Item
const StatItem = memo(({ title, value, subtext, icon, colorClass }) => (
    <div className="bg-white dark:bg-slate-900 rounded p-4 border-0 border-none shadow-none flex items-center justify-between transition-colors">
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
        <div className={`w-10 h-10 flex items-center justify-center bg-transparent ${colorClass} text-2xl font-bold`}>
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
                colorClass: "text-sky-600 dark:text-sky-400"
            },
            {
                id: "marketplace_listings",
                title: "Marketplace Listings",
                value: (overview.totalListings ?? 0).toLocaleString(),
                subtext: `${(overview.activeListings ?? 0).toLocaleString()} Active / Live`,
                icon: <ShopOutlined />,
                colorClass: "text-emerald-600 dark:text-emerald-400"
            },
            {
                id: "peak_usage",
                title: "Peak Usage Window",
                value: peakHour,
                subtext: "Highest hourly user traffic",
                icon: <ClockCircleOutlined />,
                colorClass: "text-amber-600 dark:text-amber-400"
            },
            {
                id: "cricket_tournaments",
                title: "Cricket Tournaments",
                value: (overview.totalTournaments ?? 0).toLocaleString(),
                subtext: `${(overview.totalMatches ?? 0).toLocaleString()} Total Match Fixtures`,
                icon: <TrophyOutlined />,
                colorClass: "text-purple-600 dark:text-purple-400"
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
                />
            ))}
        </div>
    );
});

AnalyticsStatCards.displayName = "AnalyticsStatCards";

export default AnalyticsStatCards;
