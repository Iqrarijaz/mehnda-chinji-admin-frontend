"use client";
import React from "react";
import { Button, Switch, Tag, Tooltip, Popconfirm } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { FaImage } from "react-icons/fa";

export const ConfigItemCard = React.memo(({ item, onToggle, onEdit, onDelete }) => {
    const isRemoteImage = typeof item.icon === "string" && (item.icon.startsWith("http") || item.icon.startsWith("data:"));

    return (
        <div
            className={`flex items-center justify-between p-3.5 rounded-xl border-0 transition-all duration-200 ${
                item.isActive !== false
                    ? "bg-white dark:bg-slate-900/70 shadow-sm"
                    : "bg-slate-100/70 dark:bg-slate-900/30 opacity-60"
            }`}
        >
            <div className="flex items-center gap-3 min-w-0 flex-1">
                <div className="w-11 h-11 rounded-xl bg-slate-100 dark:bg-slate-800/80 border-0 flex items-center justify-center shrink-0 overflow-hidden p-1">
                    {isRemoteImage ? (
                        <img src={item.icon} alt={item.label} className="w-full h-full object-contain" />
                    ) : item.icon ? (
                        <Tag color="cyan" className="m-0 text-[10px] font-mono px-1 py-0.5 max-w-[40px] truncate border-0">
                            {item.icon}
                        </Tag>
                    ) : (
                        <FaImage className="text-slate-400" size={16} />
                    )}
                </div>

                <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate">
                            {item.label}
                        </span>
                        <span className="text-[10px] font-mono bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-slate-500">
                            #{item.order ?? 0}
                        </span>
                        {item.appVersions && item.appVersions.length > 0 ? (
                            <Tag color="purple" className="text-[10px] font-mono m-0 border-0">
                                {item.appVersions.join(", ")}
                            </Tag>
                        ) : (
                            <Tag color="default" className="text-[10px] text-slate-400 m-0 border-0 bg-slate-100 dark:bg-slate-800">
                                All Versions
                            </Tag>
                        )}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                        <span className="text-[11px] font-mono text-teal-600 dark:text-teal-400 truncate">
                            id: {item.id}
                        </span>
                        {item.route && (
                            <span className="text-[11px] text-slate-400 font-mono truncate">
                                • {item.route}
                            </span>
                        )}
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-3 shrink-0 ml-3">
                <Tooltip title={item.isActive !== false ? "Visible on Mobile" : "Hidden from Mobile"}>
                    <Switch
                        checked={item.isActive !== false}
                        onChange={(checked) => onToggle(checked)}
                        size="small"
                        checkedChildren="ON"
                        unCheckedChildren="OFF"
                    />
                </Tooltip>

                <Button size="small" onClick={onEdit} className="rounded-md text-xs border-0 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200">
                    Edit
                </Button>

                <Popconfirm
                    title="Delete Item"
                    description={`Are you sure you want to remove "${item.label}"?`}
                    onConfirm={onDelete}
                    okText="Yes"
                    cancelText="No"
                    okButtonProps={{ danger: true }}
                >
                    <Button size="small" danger icon={<DeleteOutlined />} className="rounded-md border-0 bg-red-50 dark:bg-red-900/20" />
                </Popconfirm>
            </div>
        </div>
    );
});

ConfigItemCard.displayName = "ConfigItemCard";
