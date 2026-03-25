"use client";
import React from "react";

const StatCard = ({
    title,
    count,
    color = "#006666",
    bg = "#ffffff",
    border = "transparent",
    icon = null,
    active = false,
    onClick,
    subtitle,
}) => {
    const cardBg = active ? "#006666" : bg;
    const cardBorder = active ? "#006666" : border;
    const textColor = active ? "#ffffff" : "#1e293b";
    const accentBar = active ? "rgba(255,255,255,0.25)" : "#006666";

    return (
        <button
            onClick={onClick}
            style={{
                position: "relative",
                maxWidth: 200,
                flex: 1,
                background: cardBg,
                border: `1.5px solid ${cardBorder}`,
                borderRadius: 14,
                padding: "4px 20px",
                cursor: "pointer",
                textAlign: "left",
                overflow: "hidden",
                transition: "all 0.18s ease",
                boxShadow: active
                    ? `0 4px 18px ${color}44`
                    : "0 1px 6px rgba(0,0,0,0.06)",
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

            {/* Top Row */}
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                }}
            >
                {/* Left: Count + Title */}
                <div style={{ display: "flex", alignItems: "baseline" }}>
                    <span
                        style={{
                            fontSize: 26,
                            fontWeight: 800,
                            color: active ? "#ffffff" : color,
                            lineHeight: 1,
                            letterSpacing: "-1px",
                            marginRight: 10, // ✅ 10px space
                        }}
                    >
                        {count ?? 0}
                    </span>

                    <span
                        style={{
                            fontSize: 13,
                            fontWeight: 700,
                            color: textColor,
                            textTransform: "uppercase",
                            letterSpacing: "0.07em",
                        }}
                    >
                        {title}
                    </span>
                </div>

                {/* Right: Icon */}
                {icon && (
                    <span
                        style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            width: 20,
                            height: 20,
                            borderRadius: 9,
                            background: active
                                ? "rgba(255,255,255,0.2)"
                                : `${color}18`,
                            color: active ? "#fff" : color,
                            fontSize: 16,
                            flexShrink: 0,
                        }}
                    >
                        {icon}
                    </span>
                )}
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
                    borderRadius: "0 0 14px 14px",
                    opacity: active ? 1 : 0.55,
                }}
            />
        </button>
    );
};

export default React.memo(StatCard);
