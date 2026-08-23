"use client";
import React, { memo } from "react";
import { Skeleton } from "antd";
import { cn } from "@/utils/helper";

export const SkeletonPulse = memo(function SkeletonPulse({ className }) {
    return (
        <div className={cn("animate-pulse bg-slate-200 dark:bg-slate-700/70 rounded-none", className)} />
    );
});

export const TableSkeleton = memo(function TableSkeleton({ rows = 5, columns = 5 }) {
    return (
        <div className="w-full border border-slate-100 dark:border-slate-800 rounded-none overflow-hidden bg-white dark:bg-slate-900">
            <div className="bg-slate-50/50 dark:bg-slate-800/40 h-12 border-b border-slate-100 dark:border-slate-800 flex items-center px-4 gap-4">
                {Array.from({ length: columns }).map((_, i) => (
                    <Skeleton.Input key={i} active size="small" className="!w-full !min-w-0" />
                ))}
            </div>
            {Array.from({ length: rows }).map((_, rowIndex) => (
                <div key={rowIndex} className="h-16 border-b border-slate-50 dark:border-slate-800/50 flex items-center px-4 gap-4 last:border-0">
                    {Array.from({ length: columns }).map((_, colIndex) => (
                        <Skeleton.Input key={colIndex} active size="small" className="!w-full !min-w-0" />
                    ))}
                </div>
            ))}
        </div>
    );
});

export const StatCardSkeleton = memo(function StatCardSkeleton() {
    return (
        <div className="w-full md:w-auto md:min-w-[110px] md:max-w-[160px] flex-1 h-[40px] rounded-none border border-slate-200/80 dark:border-slate-700/80 bg-white dark:bg-slate-800 flex items-center justify-center px-3 gap-2 overflow-hidden shadow-none">
            <SkeletonPulse className="w-6 h-4" />
            <SkeletonPulse className="w-14 h-2.5" />
        </div>
    );
});

export const DashboardCardSkeleton = memo(function DashboardCardSkeleton() {
    return (
        <div className="w-full h-[76px] rounded-none border border-slate-100/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 p-4 flex items-center justify-between overflow-hidden shadow-none">
            <div className="space-y-2 flex-1">
                <SkeletonPulse className="w-20 h-3" />
                <SkeletonPulse className="w-16 h-6" />
            </div>
            <SkeletonPulse className="w-10 h-10 rounded-none" />
        </div>
    );
});

export const FormSkeleton = memo(function FormSkeleton({ fields = 4 }) {
    return (
        <div className="space-y-6">
            <div className="bg-slate-50/50 dark:bg-slate-800/40 p-6 rounded-none border border-slate-100 dark:border-slate-800 space-y-6">
                {Array.from({ length: 2 }).map((_, i) => (
                    <div key={i} className="space-y-2">
                        <Skeleton.Input active size="small" className="!w-24" />
                        <Skeleton.Input active block size="large" />
                    </div>
                ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Array.from({ length: 2 }).map((_, i) => (
                    <div key={i} className="space-y-2">
                        <Skeleton.Input active size="small" className="!w-24" />
                        <Skeleton.Input active block size="large" />
                    </div>
                ))}
            </div>
            <div className="space-y-2">
                <Skeleton.Input active size="small" className="!w-24" />
                <Skeleton.Input active block size="large" />
            </div>
        </div>
    );
});
