"use client";
import React from "react";
import { Button } from "antd";
import { HiOutlineInbox } from "react-icons/hi2";
import { cn } from "@/utils/helper";

const EmptyState = ({
    icon = <HiOutlineInbox className="w-12 h-12 text-slate-300" />,
    title = "No data found",
    description = "There are no records to display at the moment.",
    actionTitle,
    onAction,
    className
}) => {
    return (
        <div className={cn(
            "flex flex-col items-center justify-center p-12 text-center bg-white border border-dashed border-slate-200 rounded",
            className
        )}>
            <div className="mb-4 p-4 bg-slate-50 rounded-full">
                {icon}
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">{title}</h3>
            <p className="text-slate-500 text-sm max-w-xs mb-6">
                {description}
            </p>
            {actionTitle && onAction && (
                <Button
                    type="primary"
                    onClick={onAction}
                    className="!h-[42px] !px-6 !rounded !bg-[#006666] !border-none font-bold shadow-lg shadow-teal-900/10 hover:!bg-[#004d4d] transition-all"
                >
                    {actionTitle}
                </Button>
            )}
        </div>
    );
};

export default EmptyState;
