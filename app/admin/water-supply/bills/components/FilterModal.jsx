import React from "react";
import { DatePicker } from "antd";
import dayjs from "dayjs";
import { HiRefresh, HiDownload } from "react-icons/hi";
import ResponsiveFilterModal from "@/components/shared/ResponsiveFilterModal";
import ColumnVisibilityDropdown from "@/components/InnerPage/ColumnVisibilityDropdown";
import { FaFilter } from "react-icons/fa";

const FilterModal = React.memo(({ 
    open, 
    onCancel, 
    filters, 
    onChange, 
    columnOptions, 
    visibleColumns, 
    setVisibleColumns, 
    handleRefresh, 
    isRefreshing, 
    handleExport, 
    hasData 
}) => {
    const handleReset = () => {
        onChange({ billingMonth: null, currentPage: 1 });
        if (onCancel) onCancel();
    };

    const activeCount = [
        filters.billingMonth
    ].filter(Boolean).length;

    return (
        <ResponsiveFilterModal
            title="Filters & Actions"
            icon={<FaFilter size={14} />}
            open={open}
            onCancel={onCancel}
            onApply={onCancel}
            onReset={handleReset}
            activeFiltersCount={activeCount}
        >
            <div className="flex flex-col gap-4">
                <div className="space-y-1 px-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Billing Month</label>
                    <DatePicker
                        picker="month"
                        format="MMMM YYYY"
                        value={filters.billingMonth ? dayjs(filters.billingMonth, "YYYY-MM") : null}
                        onChange={(date) => onChange({ billingMonth: date ? date.format("YYYY-MM") : null, currentPage: 1 })}
                        className="w-full !h-[32px] !rounded-[2px] !border-2 !border-[#006666] dark:!border-teal-900/50 !bg-white dark:!bg-slate-900 transition-all duration-300 hover:!border-teal-600 dark:hover:!border-teal-500/50"
                        placeholder="Select Month & Year"
                        allowClear
                    />
                </div>

                <div className="space-y-1 px-1 flex flex-col">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Table Columns</label>
                    <div className="w-full flex">
                        <ColumnVisibilityDropdown
                            options={columnOptions}
                            visibleColumns={visibleColumns}
                            setVisibleColumns={setVisibleColumns}
                            className="!w-full justify-center"
                        />
                    </div>
                </div>

                <div className="space-y-1 px-1 pt-2 border-t border-slate-100 dark:border-slate-800">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Actions</label>
                    <div className="flex gap-2">
                        <button
                            onClick={() => { handleRefresh(); onCancel(); }}
                            disabled={isRefreshing}
                            className="flex-1 flex items-center justify-center gap-2 !h-[32px] !border-2 !rounded-[2px] !border-[#006666] dark:!border-teal-900/50 !bg-white dark:!bg-slate-800 !text-[#006666] dark:!text-teal-400 hover:!bg-[#006666] dark:hover:!bg-teal-600 hover:!text-white shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed text-[11px] font-medium"
                        >
                            <HiRefresh size={14} className={isRefreshing ? "animate-spin" : ""} />
                            Refresh
                        </button>

                        <button
                            onClick={() => { handleExport(); onCancel(); }}
                            disabled={!hasData}
                            className="flex-1 flex items-center justify-center gap-2 !h-[32px] !border-2 !rounded-[2px] !border-[#006666] dark:!border-teal-900/50 !bg-white dark:!bg-slate-800 !text-[#006666] dark:!text-teal-400 hover:!bg-[#006666] dark:hover:!bg-teal-600 hover:!text-white shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed text-[11px] font-medium"
                        >
                            <HiDownload size={14} />
                            Export
                        </button>
                    </div>
                </div>
            </div>
        </ResponsiveFilterModal>
    );
});

FilterModal.displayName = "FilterModal";

export default FilterModal;
