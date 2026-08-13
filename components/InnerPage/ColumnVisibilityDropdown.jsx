import React from "react";
import { Menu, Dropdown, Button, Checkbox } from "antd";
import { SettingOutlined } from "@ant-design/icons";

function ColumnVisibilityDropdown({ options, columnOptions, visibleColumns, setVisibleColumns, className = "" }) {
    const displayOptions = options || columnOptions || [];

    const visibilityDropdown = (
        <div className="bg-white dark:bg-slate-900 !rounded-[6px] !p-2 border-0 border-none min-w-[180px] shadow-lg transition-colors duration-300">
            <div className="px-2 pb-2 mb-2 border-b border-slate-100 dark:border-slate-800 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest transition-colors duration-300">
                Toggle Columns
            </div>
            <Checkbox.Group
                value={visibleColumns}
                onChange={setVisibleColumns}
                className="flex flex-col gap-2"
            >
                {displayOptions.map((opt) => (
                    <div key={opt.value} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-[6px] py-1 px-2 transition-colors duration-300">
                        <Checkbox value={opt.value} className="text-sm text-slate-700 dark:text-slate-300 w-full hover:!text-teal-600 transition-colors">
                            <span className="text-[11px] font-normal">{opt.label}</span>
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
                className={`!rounded-[6px] !border-0 !border-none !h-[32px] !px-3 !text-[#006666] dark:!text-teal-400 !bg-white dark:!bg-slate-800 hover:!bg-[#006666] dark:hover:!bg-teal-600 hover:!text-white flex items-center gap-1.5 !text-[11px] font-normal transition-all duration-300 shadow-none ${className}`}
            >
                Columns
            </Button>
        </Dropdown>
    );
}

export default ColumnVisibilityDropdown;
