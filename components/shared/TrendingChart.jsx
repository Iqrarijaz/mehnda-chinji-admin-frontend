
import React from "react";
import {
  AreaChart,
  Area,
  ResponsiveContainer,
  YAxis,
  XAxis,
  CartesianGrid,
  Tooltip
} from "recharts";

/**
 * A ultra-minimal, premium sparkline component for dashboard stat cards.
 * @param {Array} data - Array of objects containing "value" and optionally "name" or "date"
 * @param {string} color - Stroke and gradient color
 */
const TrendingChart = ({ data = [], color = "#006666" }) => {
  // Ensure we have data, otherwise show a flat line toward zero
  const safeData = data.length > 0 ? data : Array(7).fill({ value: 0 });

  return (
    <div className="w-full h-10 mt-2 overflow-hidden opacity-60 group-hover:opacity-100 transition-opacity duration-500">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={safeData} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id={`colorTrend-${color.replace("#", "")}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.3} />
              <stop offset="95%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <Area
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={2}
            fillOpacity={1}
            fill={`url(#colorTrend-${color.replace("#", "")})`}
            animationDuration={1500}
            isAnimationActive={true}
          />
          {/* We hide axes and grids for the sparkline look */}
          <XAxis hide />
          <YAxis hide domain={['dataMin - 5', 'dataMax + 5']} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TrendingChart;
