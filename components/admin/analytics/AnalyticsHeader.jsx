import React, { memo, useCallback } from "react";
import { Radio, DatePicker, Button, Tooltip } from "antd";
import { ReloadOutlined } from "@ant-design/icons";

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
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 bg-white dark:bg-slate-900 px-5 py-4 rounded border border-slate-100 dark:border-slate-800 shadow-none">
            {/* Title */}
            <div>
                <h1 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white tracking-tight m-0 uppercase">
                    Analytics & Usage Insights
                </h1>
            </div>

            {/* Single Line Controls: Range Tabs + Custom Date Picker + Refresh Button */}
            <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5 w-full lg:w-auto justify-start lg:justify-end">
                {/* Preset Range Selector */}
                <Radio.Group
                    value={range}
                    onChange={handleRangeRadioChange}
                    optionType="button"
                    buttonStyle="solid"
                    size="middle"
                    className="flex-shrink-0"
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
