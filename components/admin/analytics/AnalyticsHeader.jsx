import React, { memo } from "react";
import { DatePicker, Button, Tooltip } from "antd";
import { ReloadOutlined } from "@ant-design/icons";

const { RangePicker } = DatePicker;

const RANGE_OPTIONS = [
    { value: "7d", label: "7 Days" },
    { value: "30d", label: "30 Days" },
    { value: "90d", label: "90 Days" },
    { value: "1y", label: "1 Year" }
];

const AnalyticsHeader = memo(function AnalyticsHeader({
    range,
    onRangeChange,
    customDates,
    onCustomDatesChange,
    onRefresh,
    isLoading
}) {
    return (
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 bg-white dark:bg-slate-900 px-5 py-4 rounded border-0 border-none shadow-none">
            {/* Title */}
            <div>
                <h1 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white tracking-tight m-0 uppercase">
                    Analytics & Usage Insights
                </h1>
            </div>

            {/* Single Line Controls: Spaced Range Tabs + Custom Date Picker + Refresh Button */}
            <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 w-full lg:w-auto justify-start lg:justify-end">
                {/* Preset Range Selector with Gap and Padding */}
                <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded flex-shrink-0">
                    {RANGE_OPTIONS.map((item) => {
                        const isSelected = range === item.value;
                        return (
                            <button
                                key={item.value}
                                type="button"
                                onClick={() => onRangeChange(item.value)}
                                className={`px-3.5 py-1.5 text-xs font-semibold rounded transition-all duration-200 cursor-pointer ${
                                    isSelected
                                        ? "bg-[#006666] text-white shadow-none"
                                        : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-200/60 dark:hover:bg-slate-700/60 bg-transparent"
                                }`}
                            >
                                {item.label}
                            </button>
                        );
                    })}
                </div>

                {/* Custom Date Range Picker */}
                <RangePicker
                    value={customDates}
                    onChange={onCustomDatesChange}
                    size="middle"
                    className="rounded dark:bg-slate-900 dark:border-slate-700 !h-[40px] flex-shrink-0"
                    placeholder={["Start Date", "End Date"]}
                    allowClear
                />

                {/* Refresh Button */}
                {onRefresh && (
                    <Tooltip title="Refresh Analytics">
                        <Button
                            icon={<ReloadOutlined spin={isLoading} className="text-teal-600 dark:text-teal-400" />}
                            onClick={onRefresh}
                            size="middle"
                            className="flex items-center justify-center rounded dark:bg-slate-800 dark:border-slate-700 !h-[40px] !w-[40px] flex-shrink-0"
                        />
                    </Tooltip>
                )}
            </div>
        </div>
    );
});

AnalyticsHeader.displayName = "AnalyticsHeader";

export default AnalyticsHeader;
