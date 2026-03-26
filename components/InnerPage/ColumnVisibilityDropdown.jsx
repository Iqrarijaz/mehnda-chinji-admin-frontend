import React from "react";
import { Menu, Dropdown, Button, Checkbox } from "antd";
import { SettingOutlined } from "@ant-design/icons";

function ColumnVisibilityDropdown({ options, columnOptions, visibleColumns, setVisibleColumns, className = "" }) {
    const displayOptions = options || columnOptions || [];

    const visibilityDropdown = (
        <div className="bg-white !rounded !p-2 shadow-xl border border-slate-100 min-w-[180px]">
            <div className="px-2 pb-2 mb-2 border-b border-slate-100 text-xs font-bold text-slate-400 uppercase tracking-wider">
                Toggle Columns
            </div>
            <Checkbox.Group
                value={visibleColumns}
                onChange={setVisibleColumns}
                className="flex flex-col gap-2"
            >
                {displayOptions.map((opt) => (
                    <div key={opt.value} className="hover:bg-slate-50 rounded py-1 px-2 transition-colors">
                        <Checkbox value={opt.value} className="text-sm text-slate-700 w-full">
                            {opt.label}
                        </Checkbox>
                    </div>
                ))}
            </Checkbox.Group>
        </div>
    );

    return (
        <Dropdown dropdownRender={() => visibilityDropdown} trigger={["click"]} placement="bottomRight">
            <Button
                icon={<SettingOutlined className="!text-xs" />}
                className={`!rounded !h-[36px] !px-3 !border-slate-200 !text-slate-600 !text-xs font-bold hover:!border-[#006666] hover:!text-[#006666] flex items-center gap-1.5 ${className}`}
            >
                Columns
            </Button>
        </Dropdown>
    );
}

export default ColumnVisibilityDropdown;
