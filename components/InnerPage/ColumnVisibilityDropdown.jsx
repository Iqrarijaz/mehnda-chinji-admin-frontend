import React, { memo } from "react";
import { Dropdown, Button, Checkbox } from "antd";
import { SettingOutlined } from "@ant-design/icons";

const ColumnVisibilityDropdown = memo(function ColumnVisibilityDropdown({
    options,
    columnOptions,
    visibleColumns,
    setVisibleColumns,
    className = ""
}) {
    const displayOptions = options || columnOptions || [];

    const visibilityDropdown = (
        <div className="bg-white dark:bg-slate-900 rounded-none p-3 border border-slate-200 dark:border-slate-800 min-w-[200px] shadow-none transition-colors duration-200">
            <div className="px-1 pb-2 mb-2 border-b border-slate-100 dark:border-slate-800 text-[10px] font-bold text-slate-400 dark:text-slate-400 uppercase tracking-widest">
                Toggle Columns
            </div>
            <Checkbox.Group
                value={visibleColumns}
                onChange={setVisibleColumns}
                className="flex flex-col gap-2.5"
            >
                {displayOptions.map((opt) => (
                    <div key={opt.value} className="hover:bg-slate-50 dark:hover:bg-slate-800/80 rounded-none py-1 px-1.5 transition-colors">
                        <Checkbox value={opt.value} className="text-xs text-slate-700 dark:text-slate-200 w-full hover:!text-teal-600 dark:hover:!text-teal-400 transition-colors">
                            <span className="text-xs font-normal">{opt.label}</span>
                        </Checkbox>
                    </div>
                ))}
            </Checkbox.Group>
        </div>
    );

    return (
        <Dropdown dropdownRender={() => visibilityDropdown} trigger={["click"]} placement="bottomRight">
            <Button
                icon={<SettingOutlined className="!text-xs text-teal-600 dark:text-teal-400" />}
                className={`rounded-none !border !border-slate-200 dark:!border-slate-700 !h-[40px] !px-3.5 !text-slate-700 dark:!text-slate-200 !bg-white dark:!bg-slate-800 hover:!bg-[#006666] hover:!text-white dark:hover:!bg-[#006666] dark:hover:!text-white flex items-center gap-1.5 !text-xs font-medium transition-all duration-200 shadow-none ${className}`}
            >
                Columns
            </Button>
        </Dropdown>
    );
});

ColumnVisibilityDropdown.displayName = "ColumnVisibilityDropdown";

export default ColumnVisibilityDropdown;
