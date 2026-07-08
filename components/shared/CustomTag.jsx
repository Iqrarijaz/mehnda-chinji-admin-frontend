import React from "react";
import PropTypes from "prop-types";

const colorStyles = {
    green: "bg-green-50 dark:bg-green-950/20 text-green-700 dark:text-green-400 border-green-200 dark:border-green-900/30",
    red: "bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-400 border-red-200 dark:border-red-900/30",
    blue: "bg-blue-50 dark:bg-blue-950/20 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-900/30",
    orange: "bg-orange-50 dark:bg-orange-950/20 text-orange-700 dark:text-orange-400 border-orange-200 dark:border-orange-900/30",
    slate: "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-400 border-slate-200 dark:border-slate-700",
    teal: "bg-teal-50 dark:bg-teal-950/20 text-teal-700 dark:text-teal-400 border-teal-200 dark:border-teal-900/30",
    amber: "bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-900/30",
    purple: "bg-purple-50 dark:bg-purple-950/20 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-900/30",
    pink: "bg-pink-50 dark:bg-pink-950/20 text-pink-700 dark:text-pink-400 border-pink-200 dark:border-pink-900/30",
};

const CustomTag = React.memo(({ text, color = "slate", className = "", style = {} }) => {
    const activeColorClass = colorStyles[color] || colorStyles.slate;

    return (
        <span
            className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold border uppercase tracking-wider transition-colors duration-300 ${activeColorClass} ${className}`}
            style={style}
        >
            {text}
        </span>
    );
});

CustomTag.displayName = "CustomTag";

CustomTag.propTypes = {
    text: PropTypes.string.isRequired,
    color: PropTypes.oneOf([
        "green",
        "red",
        "blue",
        "orange",
        "slate",
        "teal",
        "amber",
        "purple",
        "pink",
    ]),
    className: PropTypes.string,
    style: PropTypes.object,
};

export default CustomTag;
