"use client";
import React from "react";
import { Empty, Tag } from "antd";

import { totalExtras } from "@/constants/cricket";

/**
 * Over-by-over commentary for one innings, newest first — the running record
 * a scorer checks against before correcting an over.
 */
const OverHistory = ({ innings, title }) => {
    const overs = [...(innings?.overs || [])].sort((a, b) => b.overNumber - a.overNumber);

    return (
        <div className="border border-slate-100 dark:border-slate-800 rounded p-3">
            <div className="flex items-center justify-between mb-2">
                <p className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">{title}</p>
                <span className="text-[10px] text-slate-400 font-medium">{overs.length} overs</span>
            </div>

            {overs.length === 0 ? (
                <Empty
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    description={<span className="text-[11px] text-slate-400">No overs recorded yet.</span>}
                />
            ) : (
                <div className="space-y-1.5 max-h-[360px] overflow-y-auto pr-1">
                    {overs.map((over) => {
                        const extras = totalExtras(over.extras);
                        return (
                            <div
                                key={over._id || over.overNumber}
                                className="flex items-start gap-3 border border-slate-100 dark:border-slate-800 rounded p-2"
                            >
                                <div className="h-[26px] w-[26px] rounded bg-teal-50 dark:bg-teal-900/20 text-[#006666] dark:text-teal-400 flex items-center justify-center text-[10px] font-bold shrink-0">
                                    {over.overNumber}
                                </div>
                                <div className="flex flex-col min-w-0 flex-1">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <span className="text-[11px] font-bold text-slate-800 dark:text-slate-100">
                                            {over.runsScored} {over.runsScored === 1 ? "run" : "runs"}
                                        </span>
                                        {over.wickets > 0 && (
                                            <Tag color="red" className="!text-[8px] !font-bold !uppercase !rounded !m-0">
                                                {over.wickets} {over.wickets === 1 ? "wicket" : "wickets"}
                                            </Tag>
                                        )}
                                        {extras > 0 && (
                                            <Tag className="!text-[8px] !font-bold !rounded !m-0 !bg-slate-50 !border-slate-200 !text-slate-600">
                                                {extras} extra{extras === 1 ? "" : "s"}
                                            </Tag>
                                        )}
                                    </div>
                                    <span className="text-[9px] text-slate-400 font-medium truncate">
                                        {over.bowlerName}
                                        {over.commentary ? ` · ${over.commentary}` : ""}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default OverHistory;
