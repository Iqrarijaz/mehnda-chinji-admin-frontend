"use client";
import React, { useState } from "react";
import { Avatar, Tag, Tooltip, Collapse, Empty } from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { GiCricketBat } from "react-icons/gi";

import ConfirmModal from "@/components/shared/ConfirmModal";
import CustomButton from "@/components/shared/CustomButton";
import { DELETE_CRICKET_TEAM } from "@/app/api/admin/cricket";
import { ADMIN_KEYS } from "@/constants/queryKeys";
import { PLAYER_ROLE_LABELS, PLAYER_ROLE_SHORT } from "@/constants/cricket";

import TeamFormModal from "./TeamFormModal";

/**
 * Teams & Roster.
 *
 * Each team expands into its squad. Deleting is refused server-side while the
 * team still appears in a fixture, so the confirm copy says as much rather than
 * letting the admin discover it from an error toast.
 */
const TeamsTab = ({ tournament }) => {
    const queryClient = useQueryClient();
    const [modal, setModal] = useState({ name: null, data: null, state: false });
    const [confirmModal, setConfirmModal] = useState({ state: false, onConfirm: null, title: "", content: "" });

    const closeConfirm = () => setConfirmModal({ state: false, onConfirm: null, title: "", content: "" });

    const removeTeam = useMutation({
        mutationKey: ["deleteCricketTeam"],
        mutationFn: (teamId) => DELETE_CRICKET_TEAM({ tournamentId: tournament._id, teamId }),
        onSuccess: (data) => {
            toast.success(data?.message || "Team removed successfully");
            queryClient.invalidateQueries({ queryKey: [ADMIN_KEYS.CRICKET.TOURNAMENT_DETAILS, tournament._id] });
            queryClient.invalidateQueries({ queryKey: [ADMIN_KEYS.CRICKET.TOURNAMENTS] });
            queryClient.invalidateQueries({ queryKey: [ADMIN_KEYS.CRICKET.TEAMS] });
            closeConfirm();
        },
        onError: (error) => {
            toast.error(error?.errorMessage || "Failed to remove team");
            closeConfirm();
        }
    });

    const teams = tournament.teams || [];

    const items = teams.map((team) => ({
        key: team._id,
        label: (
            <div className="flex items-center justify-between gap-3 w-full pr-2">
                <div className="flex items-center gap-2 min-w-0">
                    {team.logo ? (
                        <Avatar src={team.logo} size={30} shape="square" className="border border-slate-100" />
                    ) : (
                        <Avatar shape="square" size={30} className="!bg-teal-50 !text-[#006666] !text-[10px] !font-bold">
                            {team.shortName}
                        </Avatar>
                    )}
                    <div className="flex flex-col min-w-0">
                        <span className="text-[12px] font-bold text-slate-800 dark:text-slate-100 capitalize truncate">
                            {team.name}
                        </span>
                        <span className="text-[9px] text-slate-400 font-medium truncate">
                            {team.players?.length || 0} players
                            {team.captainName ? ` · Captain: ${team.captainName}` : ""}
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                    <Tag className="!text-[9px] !font-bold !rounded !bg-slate-50 !border-slate-200 !text-slate-600 hidden md:inline-block">
                        {team.stats?.played || 0}P · {team.stats?.won || 0}W · {team.stats?.points || 0}pts
                    </Tag>
                    <button
                        type="button"
                        title="Edit team & roster"
                        onClick={(event) => {
                            event.stopPropagation();
                            setModal({ name: "EditTeam", data: team, state: true });
                        }}
                        className="h-[28px] w-[28px] flex items-center justify-center rounded text-[#006666] dark:text-teal-400 hover:bg-teal-50 dark:hover:bg-teal-900/20 transition-colors"
                    >
                        <EditOutlined />
                    </button>
                    <button
                        type="button"
                        title="Remove team"
                        onClick={(event) => {
                            event.stopPropagation();
                            setConfirmModal({
                                state: true,
                                title: "Remove Team",
                                content: `Remove "${team.name}" from this tournament? If it is already part of a scheduled fixture, delete those fixtures first.`,
                                onConfirm: () => removeTeam.mutate(team._id)
                            });
                        }}
                        className="h-[28px] w-[28px] flex items-center justify-center rounded text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                    >
                        <DeleteOutlined />
                    </button>
                </div>
            </div>
        ),
        children: (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                {(team.players || []).map((player) => (
                    <div
                        key={player._id || player.name}
                        className="flex items-center gap-2 border border-slate-100 dark:border-slate-800 rounded p-2"
                    >
                        <Avatar src={player.image || undefined} size={28} className="!bg-slate-100 !text-slate-500 !text-[10px]">
                            {player.name?.[0]?.toUpperCase()}
                        </Avatar>
                        <div className="flex flex-col min-w-0 flex-1">
                            <div className="flex items-center gap-1">
                                <span className="text-[11px] font-semibold text-slate-800 dark:text-slate-200 capitalize truncate">
                                    {player.name}
                                </span>
                                {player.isCaptain && (
                                    <Tooltip title="Captain">
                                        <span className="text-[8px] font-bold bg-[#006666] text-white rounded-full h-[14px] w-[14px] flex items-center justify-center shrink-0">
                                            C
                                        </span>
                                    </Tooltip>
                                )}
                            </div>
                            <span className="text-[9px] text-slate-400 font-medium truncate">
                                <Tooltip title={PLAYER_ROLE_LABELS[player.role]}>
                                    <span>{PLAYER_ROLE_SHORT[player.role] || player.role}</span>
                                </Tooltip>
                                {player.jerseyNumber !== null && player.jerseyNumber !== undefined ? ` · #${player.jerseyNumber}` : ""}
                                {player.phone ? ` · ${player.phone}` : ""}
                            </span>
                        </div>
                    </div>
                ))}
                {(team.players || []).length === 0 && (
                    <span className="text-[11px] text-slate-400 font-medium">No players in this squad yet.</span>
                )}
            </div>
        )
    }));

    return (
        <div className="space-y-3">
            <div className="flex justify-between items-center">
                <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                    Registered Teams ({teams.length})
                </p>
                <CustomButton
                    label="Register Team"
                    icon={<PlusOutlined />}
                    onClick={() => setModal({ name: "AddTeam", data: null, state: true })}
                />
            </div>

            {teams.length === 0 ? (
                <Empty
                    image={<GiCricketBat className="w-8 h-8 text-teal-100 mx-auto" />}
                    description={<span className="text-[12px] text-slate-500">No teams registered yet. Add the first squad to start scheduling fixtures.</span>}
                />
            ) : (
                <Collapse items={items} className="cricket-teams-collapse bg-transparent" expandIconPosition="end" />
            )}

            <TeamFormModal modal={modal} setModal={setModal} tournamentId={tournament._id} />

            {confirmModal.state && (
                <ConfirmModal
                    isOpen={confirmModal.state}
                    onClose={closeConfirm}
                    title={confirmModal.title}
                    description={confirmModal.content}
                    onConfirm={confirmModal.onConfirm}
                    loading={removeTeam.isPending}
                    variant="danger"
                />
            )}
        </div>
    );
};

export default TeamsTab;
