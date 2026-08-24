"use client";
import React from "react";
import { Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { ConfigItemCard } from "./ConfigItemCard";

export const CategoriesTab = React.memo(({ categories, onAdd, onToggle, onEdit, onDelete }) => {
    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                    Primary Category Tiles (Home Grid)
                </span>
                <Button
                    type="dashed"
                    icon={<PlusOutlined />}
                    onClick={onAdd}
                    className="rounded-lg text-xs border-0 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200"
                >
                    Add Category
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {categories.map((cat, idx) => (
                    <ConfigItemCard
                        key={cat.id || idx}
                        item={cat}
                        onToggle={(checked) => onToggle(idx, checked)}
                        onEdit={() => onEdit(idx, cat)}
                        onDelete={() => onDelete(idx)}
                    />
                ))}
            </div>
        </div>
    );
});

CategoriesTab.displayName = "CategoriesTab";
