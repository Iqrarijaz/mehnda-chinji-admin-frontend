import React, { memo, useCallback } from "react";
import { Radio, DatePicker, Button, Tooltip } from "antd";
import { ReloadOutlined, CalendarOutlined } from "@ant-design/icons";

const { RangePicker } = DatePicker;

const AnalyticsHeader = memo(function AnalyticsHeader({
    range,
    onRangeChange,
    customDates,
    onCustomDatesChange,
    onRefresh,
    isLoading
}) {
    const handleRangeRadioChange = useCallback((e) => {
        onRangeChange(e.target.value);
    }, [onRangeChange]);

    return (
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-100 dark:border-slate-700/60 shadow-sm">
            <div>
                <h1 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white tracking-tight m-0">
                    Analytics & Usage Insights
                </h1>
                <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mt-1 mb-0">
                    Real-time metrics for user registrations, 24-hour peak usage hours, and marketplace activity
                </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
                {/* Preset Range Selector */}
                <Radio.Group
                    value={range}
                    onChange={handleRangeRadioChange}
                    optionType="button"
                    buttonStyle="solid"
                    size="middle"
                >
                    <Radio.Button value="7d">7 Days</Radio.Button>
                    <Radio.Button value="30d">30 Days</Radio.Button>
                    <Radio.Button value="90d">90 Days</Radio.Button>
                    <Radio.Button value="1y">1 Year</Radio.Button>
                </Radio.Group>

                {/* Custom Date Range Picker */}
                <RangePicker
                    value={customDates}
                    onChange={onCustomDatesChange}
                    size="middle"
                    className="rounded-lg dark:bg-slate-900 dark:border-slate-700"
                    placeholder={["Start Date", "End Date"]}
                    allowClear
                />

                {/* Refresh Button */}
                {onRefresh && (
                    <Tooltip title="Refresh Analytics Data">
                        <Button
                            icon={<ReloadOutlined spin={isLoading} />}
                            onClick={onRefresh}
                            size="middle"
                            className="flex items-center justify-center rounded-lg"
                        />
                    </Tooltip>
                )}
            </div>
        </div>
    );
});

AnalyticsHeader.displayName = "AnalyticsHeader";

export default AnalyticsHeader;
