"use client";
import React from "react";
import { Avatar, Tooltip, Empty } from "antd";

import { PLAYER_ROLE_LABELS, PLAYER_ROLE_SHORT } from "@/constants/cricket";

/** One team's squad, as listed beside its opponent on the match view. */
const SquadList = ({ team, label }) => (
    <div className="border border-slate-100 dark:border-slate-800 rounded p-3">
        <div className="flex items-center gap-2 mb-2">
            {team?.logo ? (
                <Avatar src={team.logo} size={26} shape="square" className="border border-slate-100" />
            ) : (
                <Avatar shape="square" size={26} className="!bg-teal-50 !text-[#006666] !text-[9px] !font-bold">
                    {team?.shortName || "—"}
                </Avatar>
            )}
            <div className="flex flex-col min-w-0">
                <span className="text-[11px] font-bold text-slate-800 dark:text-slate-100 capitalize truncate">
                    {team?.name || label}
                </span>
                <span className="text-[9px] text-slate-400 font-medium">
                    {team?.players?.length || 0} players
                </span>
            </div>
        </div>

        {!team || (team.players || []).length === 0 ? (
            <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description={<span className="text-[11px] text-slate-400">Squad unavailable.</span>}
            />
        ) : (
            <div className="space-y-1">
                {team.players.map((player) => (
                    <div key={player._id || player.name} className="flex items-center gap-2 py-1">
                        <Avatar src={player.image || undefined} size={22} className="!bg-slate-100 !text-slate-500 !text-[9px]">
                            {player.name?.[0]?.toUpperCase()}
                        </Avatar>
                        <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-200 capitalize truncate flex-1">
                            {player.name}
                        </span>
                        {player.isCaptain && (
                            <Tooltip title="Captain">
                                <span className="text-[8px] font-bold bg-[#006666] text-white rounded-full h-[14px] w-[14px] flex items-center justify-center shrink-0">
                                    C
                                </span>
                            </Tooltip>
                        )}
                        <Tooltip title={PLAYER_ROLE_LABELS[player.role]}>
                            <span className="text-[9px] font-bold text-slate-400 shrink-0 w-[30px] text-right">
                                {PLAYER_ROLE_SHORT[player.role] || ""}
                            </span>
                        </Tooltip>
                        <span className="text-[9px] text-slate-300 dark:text-slate-600 font-medium shrink-0 w-[28px] text-right">
                            {player.jerseyNumber !== null && player.jerseyNumber !== undefined ? `#${player.jerseyNumber}` : ""}
                        </span>
                    </div>
                ))}
            </div>
        )}
    </div>
);

export default SquadList;
