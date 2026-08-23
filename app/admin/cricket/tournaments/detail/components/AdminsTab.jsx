"use client";
import React, { useState } from "react";
import { Avatar, Select, Empty, Tag, Spin } from "antd";
import { DeleteOutlined, UserAddOutlined } from "@ant-design/icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { FaUserShield } from "react-icons/fa";

import ConfirmModal from "@/components/shared/ConfirmModal";
import CustomButton from "@/components/shared/CustomButton";
import { ASSIGN_CRICKET_TOURNAMENT_ADMIN } from "@/app/api/admin/cricket";
import { SEARCH_USERS } from "@/app/api/admin/users";
import { ADMIN_KEYS } from "@/constants/queryKeys";
import { useDebounce } from "@/hooks/useDebounce";

/**
 * Admins & Scorers.
 *
 * Tournament admins are *app users*, not portal admins — they are the people
 * who score this tournament from the mobile app. Assigning one also flips their
 * global cricket-admin flag on the backend, so the copy here says "scoring
 * access" rather than implying portal access.
 */
const AdminsTab = ({ tournament }) => {
    const queryClient = useQueryClient();
    const [search, setSearch] = useState("");
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [confirmModal, setConfirmModal] = useState({ state: false, onConfirm: null, title: "", content: "" });

    const closeConfirm = () => setConfirmModal({ state: false, onConfirm: null, title: "", content: "" });

    const debouncedSearch = useDebounce(search, 400);

    const userSearch = useQuery({
        queryKey: ["cricketAdminUserSearch", debouncedSearch],
        queryFn: () => SEARCH_USERS({ search: debouncedSearch }),
        enabled: debouncedSearch.length >= 2
    });

    const assignedIds = new Set((tournament.admins || []).map((admin) => String(admin._id || admin)));

    const options = (userSearch.data?.data || [])
        .filter((user) => !assignedIds.has(String(user._id)))
        .map((user) => ({
            value: user._id,
            label: `${user.name}${user.phone ? ` · ${user.phone}` : ""}${user.email ? ` · ${user.email}` : ""}`
        }));

    const manageAdmin = useMutation({
        mutationKey: ["assignCricketTournamentAdmin"],
        mutationFn: ASSIGN_CRICKET_TOURNAMENT_ADMIN,
        onSuccess: (data) => {
            toast.success(data?.message || "Tournament admins updated");
            queryClient.invalidateQueries({ queryKey: [ADMIN_KEYS.CRICKET.TOURNAMENT_DETAILS, tournament._id] });
            queryClient.invalidateQueries({ queryKey: [ADMIN_KEYS.CRICKET.ADMINS] });
            setSelectedUserId(null);
            setSearch("");
            closeConfirm();
        },
        onError: (error) => {
            toast.error(error?.errorMessage || error?.message || "Failed to update tournament admins");
            closeConfirm();
        }
    });

    const assign = () => {
        if (!selectedUserId) {
            toast.warning("Search for and select a user to assign");
            return;
        }
        manageAdmin.mutate({ id: tournament._id, targetUserId: selectedUserId, action: "assign" });
    };

    const admins = tournament.admins || [];

    return (
        <div className="space-y-4">
            {/* Assign */}
            <section className="border border-slate-100 dark:border-slate-800 rounded p-4">
                <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2">
                    Assign a Scorer
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium mb-3">
                    Search app users by name or email. The assigned user gains cricket-scoring access for this tournament from the mobile app.
                </p>
                <div className="flex flex-col sm:flex-row gap-2">
                    <Select
                        showSearch
                        allowClear
                        value={selectedUserId}
                        placeholder="Type at least 2 characters to search users…"
                        filterOption={false}
                        onSearch={setSearch}
                        onChange={setSelectedUserId}
                        options={options}
                        notFoundContent={
                            userSearch.isFetching ? (
                                <div className="py-2 text-center"><Spin size="small" /></div>
                            ) : debouncedSearch.length < 2 ? (
                                <span className="text-[11px] text-slate-400">Type at least 2 characters</span>
                            ) : (
                                <span className="text-[11px] text-slate-400">No matching users</span>
                            )
                        }
                        className="flex-1"
                    />
                    <CustomButton
                        label="Assign Scorer"
                        icon={<UserAddOutlined />}
                        onClick={assign}
                        loading={manageAdmin.isPending && manageAdmin.variables?.action === "assign"}
                        disabled={!selectedUserId}
                    />
                </div>
            </section>

            {/* Current admins */}
            <section>
                <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2">
                    Assigned Scorers ({admins.length})
                </p>

                {admins.length === 0 ? (
                    <Empty
                        image={<FaUserShield className="w-8 h-8 text-teal-100 mx-auto" />}
                        description={<span className="text-[12px] text-slate-500">No scorers assigned. Matches can still be scored from this portal.</span>}
                    />
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {admins.map((admin) => (
                            <div
                                key={admin._id}
                                className="flex items-center justify-between gap-2 border border-slate-100 dark:border-slate-800 rounded p-3"
                            >
                                <div className="flex items-center gap-2 min-w-0">
                                    <Avatar src={admin.profileImage || undefined} size={32} className="!bg-slate-100 !text-slate-500 !text-[11px]">
                                        {admin.name?.[0]?.toUpperCase()}
                                    </Avatar>
                                    <div className="flex flex-col min-w-0">
                                        <div className="flex items-center gap-1.5">
                                            <span className="text-[11px] font-bold text-slate-800 dark:text-slate-100 capitalize truncate">
                                                {admin.name}
                                            </span>
                                            {admin.isCricketAdmin && (
                                                <Tag color="green" className="!text-[8px] !font-bold !uppercase !rounded !m-0">Scorer</Tag>
                                            )}
                                        </div>
                                        <span className="text-[9px] text-slate-400 font-medium truncate">
                                            {[admin.email, admin.phone].filter(Boolean).join(" · ") || "—"}
                                        </span>
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    title="Remove scoring access"
                                    onClick={() =>
                                        setConfirmModal({
                                            state: true,
                                            title: "Remove Scorer",
                                            content: `Remove ${admin.name}'s scoring access for "${tournament.name}"?`,
                                            onConfirm: () =>
                                                manageAdmin.mutate({
                                                    id: tournament._id,
                                                    targetUserId: admin._id,
                                                    action: "unassign"
                                                })
                                        })
                                    }
                                    className="h-[28px] w-[28px] flex items-center justify-center rounded text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors shrink-0"
                                >
                                    <DeleteOutlined />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            {confirmModal.state && (
                <ConfirmModal
                    isOpen={confirmModal.state}
                    onClose={closeConfirm}
                    title={confirmModal.title}
                    description={confirmModal.content}
                    onConfirm={confirmModal.onConfirm}
                    loading={manageAdmin.isPending}
                    variant="danger"
                />
            )}
        </div>
    );
};

export default AdminsTab;
