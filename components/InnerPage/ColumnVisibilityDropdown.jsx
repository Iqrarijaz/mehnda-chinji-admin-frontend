import React from "react";
import { Menu, Dropdown, Button, Checkbox } from "antd";
import { SettingOutlined } from "@ant-design/icons";

function ColumnVisibilityDropdown({ options, columnOptions, visibleColumns, setVisibleColumns, className = "" }) {
    const displayOptions = options || columnOptions || [];

    const visibilityDropdown = (
        <div className="bg-white dark:bg-slate-900 !rounded !p-2 shadow-xl border border-slate-100 dark:border-slate-800 min-w-[180px] transition-colors duration-300">
            <div className="px-2 pb-2 mb-2 border-b border-slate-100 dark:border-slate-800 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest transition-colors duration-300">
                Toggle Columns
            </div>
            <Checkbox.Group
                value={visibleColumns}
                onChange={setVisibleColumns}
                className="flex flex-col gap-2"
            >
                {displayOptions.map((opt) => (
                    <div key={opt.value} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded py-1 px-2 transition-colors duration-300">
                        <Checkbox value={opt.value} className="text-sm text-slate-700 dark:text-slate-300 w-full hover:!text-teal-600 transition-colors">
                            <span className="text-[11px] font-medium">{opt.label}</span>
                        </Checkbox>
                    </div>
                ))}
            </Checkbox.Group>
        </div>
    );

    return (
        <Dropdown dropdownRender={() => visibilityDropdown} trigger={["click"]} placement="bottomRight">
            <Button
                icon={<SettingOutlined className="!text-[10px]" />}
                className={`!rounded-[2px] !h-[32px] !px-3 !border-slate-200 dark:!border-slate-800 !text-slate-600 dark:!text-slate-400 !bg-white dark:!bg-slate-900 hover:!border-teal-600 dark:hover:!border-teal-500/50 hover:!text-teal-600 dark:hover:!text-teal-400 flex items-center gap-1.5 !text-[11px] font-medium transition-all duration-300 shadow-sm hover:shadow-md ${className}`}
            >
                Columns
            </Button>
        </Dropdown>
    );
}

export default ColumnVisibilityDropdown;
