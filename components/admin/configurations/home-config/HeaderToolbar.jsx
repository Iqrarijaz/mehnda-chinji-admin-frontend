"use client";
import React from "react";
import { Button } from "antd";
import { ReloadOutlined, SaveOutlined, MobileOutlined } from "@ant-design/icons";

export const HeaderToolbar = React.memo(({ onReload, isRefetching, onSave, isSaving }) => {
    return (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border-0 shadow-none">
            <div>
                <h2 className="text-base font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2 m-0">
                    <MobileOutlined className="text-[#006666] dark:text-teal-400" />
                    Mobile Home Screen Layout Manager
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 m-0 mt-0.5">
                    Manage categories, utilities, icon images, and target app versions for the mobile app home screen.
                </p>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-auto">
                <Button
                    icon={<ReloadOutlined />}
                    onClick={onReload}
                    loading={isRefetching}
                    className="rounded-lg text-xs border-0 bg-white dark:bg-slate-800 shadow-sm"
                >
                    Reload
                </Button>
                <Button
                    type="primary"
                    icon={<SaveOutlined />}
                    onClick={onSave}
                    loading={isSaving}
                    className="!bg-[#006666] hover:!bg-teal-700 rounded-lg text-xs font-semibold border-0 shadow-sm"
                >
                    Save All Changes
                </Button>
            </div>
        </div>
    );
});

HeaderToolbar.displayName = "HeaderToolbar";
