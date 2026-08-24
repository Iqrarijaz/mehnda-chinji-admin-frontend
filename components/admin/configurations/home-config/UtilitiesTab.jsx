"use client";
import React from "react";
import { Button, Switch, Tag, Popconfirm } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import { FaLayerGroup } from "react-icons/fa";
import { ConfigItemCard } from "./ConfigItemCard";

export const UtilitiesTab = React.memo(({
    utilities,
    onAddGroup,
    onToggleGroup,
    onEditGroup,
    onDeleteGroup,
    onAddItem,
    onToggleItem,
    onEditItem,
    onDeleteItem
}) => {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                    Grouped Daily Utility Sections
                </span>
                <Button
                    type="dashed"
                    icon={<PlusOutlined />}
                    onClick={onAddGroup}
                    className="rounded-lg text-xs border-0 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200"
                >
                    Add Utility Group
                </Button>
            </div>

            {utilities.map((group, gIdx) => (
                <div
                    key={group.id || gIdx}
                    className="bg-slate-50/60 dark:bg-slate-900/40 rounded-xl border-0 p-4 space-y-3 shadow-none"
                >
                    {/* Group Header */}
                    <div className="flex items-center justify-between pb-3">
                        <div className="flex items-center gap-2">
                            <FaLayerGroup className="text-teal-600 dark:text-teal-400" size={14} />
                            <span className="text-sm font-bold text-slate-800 dark:text-slate-100">
                                {group.title}
                            </span>
                            <span className="text-[10px] font-mono bg-slate-200 dark:bg-slate-800 px-1.5 py-0.5 rounded text-slate-600">
                                #{group.order ?? 0}
                            </span>
                            {group.appVersions && group.appVersions.length > 0 ? (
                                <Tag color="purple" className="text-[10px] m-0 border-0">
                                    v{group.appVersions.join(", v")}
                                </Tag>
                            ) : (
                                <Tag color="default" className="text-[10px] text-slate-400 m-0 border-0 bg-slate-100 dark:bg-slate-800">
                                    All Versions
                                </Tag>
                            )}
                        </div>

                        <div className="flex items-center gap-3">
                            <Switch
                                checked={group.isActive !== false}
                                onChange={(checked) => onToggleGroup(gIdx, checked)}
                                size="small"
                                checkedChildren="Group ON"
                                unCheckedChildren="Group OFF"
                            />
                            <Button
                                size="small"
                                onClick={() => onEditGroup(gIdx, group)}
                                className="rounded-md text-xs border-0 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200"
                            >
                                Edit Group
                            </Button>
                            <Button
                                size="small"
                                type="dashed"
                                icon={<PlusOutlined />}
                                onClick={() => onAddItem(gIdx, group)}
                                className="rounded-md text-xs border-0 bg-teal-50 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400"
                            >
                                Add Item
                            </Button>
                            <Popconfirm
                                title="Delete Group"
                                description={`Delete group "${group.title}" and its items?`}
                                onConfirm={() => onDeleteGroup(gIdx)}
                                okButtonProps={{ danger: true }}
                            >
                                <Button size="small" danger icon={<DeleteOutlined />} className="rounded-md border-0 bg-red-50 dark:bg-red-900/20" />
                            </Popconfirm>
                        </div>
                    </div>

                    {/* Group Items Grid */}
                    {group.items && group.items.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                            {group.items.map((item, iIdx) => (
                                <ConfigItemCard
                                    key={item.id || iIdx}
                                    item={item}
                                    onToggle={(checked) => onToggleItem(gIdx, iIdx, checked)}
                                    onEdit={() => onEditItem(gIdx, iIdx, item)}
                                    onDelete={() => onDeleteItem(gIdx, iIdx)}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="py-4 text-center text-xs text-slate-400">
                            No items in this group. Click "Add Item" above.
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
});

UtilitiesTab.displayName = "UtilitiesTab";
