"use client";
import React from "react";
import { Skeleton, Card, Divider } from "antd";
import { cn } from "@/utils/helper";

export const SkeletonPulse = ({ className }) => (
    <div className={cn("animate-pulse bg-slate-200 rounded", className)} />
);

export const TableSkeleton = ({ rows = 5, columns = 5 }) => {
    return (
        <div className="w-full border border-slate-100 rounded-xl overflow-hidden bg-white shadow-sm">
            <div className="bg-slate-50/50 h-12 border-b border-slate-100 flex items-center px-4 gap-4">
                {Array.from({ length: columns }).map((_, i) => (
                    <Skeleton.Input key={i} active size="small" className="!w-full !min-w-0" />
                ))}
            </div>
            {Array.from({ length: rows }).map((_, rowIndex) => (
                <div key={rowIndex} className="h-16 border-b border-slate-50 flex items-center px-4 gap-4 last:border-0">
                    {Array.from({ length: columns }).map((_, colIndex) => (
                        <Skeleton.Input key={colIndex} active size="small" className="!w-full !min-w-0" />
                    ))}
                </div>
            ))}
        </div>
    );
};

export const StatCardSkeleton = () => {
    return (
        <Card className="min-w-[200px] flex-1 rounded-xl border-slate-100 shadow-sm" bodyStyle={{ padding: '20px' }}>
            <div className="flex justify-between items-start mb-4">
                <Skeleton.Input active size="small" className="!w-20" />
                <Skeleton.Avatar active shape="square" size="large" className="!rounded-lg" />
            </div>
            <Skeleton.Input active size="large" className="!w-16" />
        </Card>
    );
};

export const FormSkeleton = ({ fields = 4 }) => {
    return (
        <div className="space-y-6">
            <div className="bg-slate-50/50 p-6 rounded-2xl border border-slate-100 space-y-6">
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
};
