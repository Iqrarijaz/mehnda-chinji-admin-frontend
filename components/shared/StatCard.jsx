import React from "react";
import { useTheme } from "@/context/ThemeContext";

const StatCard = ({
    title,
    shortTitle,
    count,
    color = "#006666",
    bg = "#ffffff",
    border = "transparent",
    icon = null,
    active = false,
    onClick,
    subtitle,
}) => {
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    const cardBg = active ? "#006666" : (isDark ? "#0f172a" : bg);
    const cardBorder = active ? "#006666" : (isDark ? "#1e293b" : border);
    const textColor = active ? "#ffffff" : (isDark ? "#f1f5f9" : "#1e293b");
    const accentBar = active ? "rgba(255,255,255,0.25)" : "#006666";

    return (
        <button
            onClick={onClick}
            className="stat-card w-full md:w-auto md:flex-none"
            style={{
                position: "relative",
                background: cardBg,
                border: `2px solid ${cardBorder}`,
                borderRadius: 2,
                padding: "0 10px",
                height: 32,
                display: "flex",
                alignItems: "center",
                cursor: "pointer",
                textAlign: "left",
                overflow: "hidden",
                transition: "all 0.18s ease",
                boxShadow: "none",
            }}
        >
            {/* Accent circle */}
            <span
                style={{
                    position: "absolute",
                    top: -20,
                    right: -20,
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    background: accentBar,
                    opacity: 0.25,
                    pointerEvents: "none",
                }}
            />

            {/* Main Content */}
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                }}
            >
                {/* Left: Icon */}
                {icon && (
                    <span
                        style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            width: 16,
                            height: 16,
                            borderRadius: 4,
                            background: active
                                ? "rgba(255,255,255,0.2)"
                                : `${color}18`,
                            color: active ? "#fff" : color,
                            fontSize: 12,
                            flexShrink: 0,
                        }}
                    >
                        {icon}
                    </span>
                )}

                {/* Right: Title + Count */}
                <div style={{ display: "flex", alignItems: "baseline", gap: "4px" }}>
                    <span
                        className="stat-title"
                        style={{
                            fontSize: 9,
                            fontWeight: 700,
                            color: textColor,
                            textTransform: "uppercase",
                            letterSpacing: "0.05em",
                            opacity: 0.8,
                        }}
                    >
                        <span className="stat-title-full">{title}</span>
                        {shortTitle && <span className="stat-title-short hidden uppercase">{shortTitle}</span>}
                    </span>

                    <span
                        className="stat-count"
                        style={{
                            fontSize: 14,
                            fontWeight: 800,
                            color: active ? "#ffffff" : color,
                            lineHeight: 1,
                        }}
                    >
                        {count ?? 0}
                    </span>
                </div>
            </div>

            {/* Bottom Accent Line */}
            <div
                style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: 3,
                    background: active
                        ? "rgba(255,255,255,0.35)"
                        : color,
                    borderRadius: "0 0 0 0",
                    opacity: active ? 1 : 0.55,
                }}
            />
        </button>
    );
};

export default React.memo(StatCard);
