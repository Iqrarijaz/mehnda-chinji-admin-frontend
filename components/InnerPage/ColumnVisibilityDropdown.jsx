import React from "react";
import { Menu, Dropdown, Button, Checkbox } from "antd";
import { SettingOutlined } from "@ant-design/icons";

function ColumnVisibilityDropdown({ options, columnOptions, visibleColumns, setVisibleColumns, className = "" }) {
    const displayOptions = options || columnOptions || [];

    const visibilityMenu = (
        <Menu className="!rounded-xl !p-2 shadow-xl border border-slate-100 min-w-[180px]">
            <div className="px-2 pb-2 mb-2 border-b border-slate-100 text-xs font-bold text-slate-400 uppercase tracking-wider">
                Toggle Columns
            </div>
            <Checkbox.Group
                value={visibleColumns}
                onChange={setVisibleColumns}
                className="flex flex-col"
            >
                {displayOptions.map((opt) => (
                    <Menu.Item key={opt.value} className="!bg-transparent !cursor-default hover:!bg-slate-50 !rounded-lg">
                        <Checkbox value={opt.value} className="text-sm text-slate-700 w-full">
                            {opt.label}
                        </Checkbox>
                    </Menu.Item>
                ))}
            </Checkbox.Group>
        </Menu>
    );

    return (
        <Dropdown overlay={visibilityMenu} trigger={["click"]} placement="bottomRight">
            <Button
                icon={<SettingOutlined className="!text-xs" />}
                className={`!rounded-xl !h-[36px] !px-3 !border-slate-200 !text-slate-600 !text-xs font-bold hover:!border-[#006666] hover:!text-[#006666] flex items-center gap-1.5 ${className}`}
            >
                Columns
            </Button>
        </Dropdown>
    );
}

export default ColumnVisibilityDropdown;
