import React from "react";
import PropTypes from "prop-types";

const colorStyles = {
    teal: {
        container: "border-teal-500/20 dark:border-teal-900/30 text-teal-600 dark:text-teal-400",
        iconBg: "bg-teal-50 dark:bg-teal-900/25",
        accentColor: "#006666"
    },
    indigo: {
        container: "border-indigo-500/20 dark:border-indigo-900/30 text-indigo-600 dark:text-indigo-400",
        iconBg: "bg-indigo-50 dark:bg-indigo-900/25",
        accentColor: "#6366f1"
    },
    amber: {
        container: "border-amber-500/20 dark:border-amber-900/30 text-amber-600 dark:text-amber-400",
        iconBg: "bg-amber-50 dark:bg-amber-900/25",
        accentColor: "#f59e0b"
    },
    emerald: {
        container: "border-emerald-500/20 dark:border-emerald-900/30 text-emerald-600 dark:text-emerald-400",
        iconBg: "bg-emerald-50 dark:bg-emerald-900/25",
        accentColor: "#10b981"
    },
    blue: {
        container: "border-blue-500/20 dark:border-blue-900/30 text-blue-600 dark:text-blue-400",
        iconBg: "bg-blue-50 dark:bg-blue-900/25",
        accentColor: "#3b82f6"
    },
    rose: {
        container: "border-rose-500/20 dark:border-rose-900/30 text-rose-600 dark:text-rose-400",
        iconBg: "bg-rose-50 dark:bg-rose-900/25",
        accentColor: "#f43f5e"
    }
};

const DashboardCard = React.memo(({ title, value, icon, color = "teal", trendChart = null }) => {
    const styles = colorStyles[color] || colorStyles.teal;

    return (
        <div
            className={`p-2.5 rounded-lg border border-slate-100 dark:border-slate-800/80 bg-white dark:bg-slate-900 transition-all duration-300 relative overflow-hidden group backdrop-blur-sm flex items-center justify-between gap-2.5 hover:shadow-sm hover:border-slate-200 dark:hover:border-slate-700/50`}
            style={{ borderLeft: `3px solid ${styles.accentColor}` }}
        >
            <div className="flex items-center gap-2 min-w-0">
                <div 
                    className={`p-1.5 rounded ${styles.iconBg} ${styles.container} group-hover:scale-105 transition-transform text-sm flex items-center justify-center`}
                >
                    {icon}
                </div>
                <div className="min-w-0">
                    <h4 className="text-[8px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest leading-none mb-0.5 truncate">{title}</h4>
                    <span className="text-sm font-black text-slate-800 dark:text-slate-100 tracking-tight leading-none">
                        {value}
                    </span>
                </div>
            </div>
            {trendChart && (
                <div className="w-10 h-5 flex-shrink-0 opacity-70 group-hover:opacity-100 transition-opacity">
                    {trendChart}
                </div>
            )}
        </div>
    );
});

DashboardCard.displayName = "DashboardCard";

DashboardCard.propTypes = {
    title: PropTypes.string.isRequired,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    icon: PropTypes.node.isRequired,
    color: PropTypes.string,
    trendChart: PropTypes.node
};

export default DashboardCard;
