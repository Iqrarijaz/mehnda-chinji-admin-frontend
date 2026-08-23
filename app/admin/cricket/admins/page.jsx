"use client";
import React, { useState } from "react";
import { Table, Avatar, Tag, Switch, Tooltip } from "antd";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { HiRefresh } from "react-icons/hi";
import { FaUserShield } from "react-icons/fa";

import SearchInput from "@/components/InnerPage/SearchInput";
import InnerPageCard from "@/components/layout/InnerPageCard";
import EmptyState from "@/components/shared/EmptyState";
import ConfirmModal from "@/components/shared/ConfirmModal";
import { TableSkeleton } from "@/components/shared/Skeletons";
import { useDebounce } from "@/hooks/useDebounce";
import { TOGGLE_CRICKET_ADMIN } from "@/app/api/admin/users";
import { ADMIN_KEYS } from "@/constants/queryKeys";
import { STATUS_COLORS } from "@/constants/cricket";
import { timestampToDate } from "@/utils/date";

import { useCricketAdmins } from "./hooks/useCricketAdmins";

/**
 * Admins & Scorers — the app users who hold cricket-scoring rights.
 *
 * The switch flips a user's *global* cricket-admin flag. Per-tournament
 * assignment happens on a tournament's own Admins & Scorers tab, so each row
 * links through to the tournaments that user manages.
 */
export default function CricketAdminsPage() {
    const router = useRouter();
    const queryClient = useQueryClient();
    const [filters, setFilters] = useState({ page: 1, limit: 20, search: "", onChangeSearch: false });
    const [confirmModal, setConfirmModal] = useState({ state: false, onConfirm: null, title: "", content: "" });

    const closeConfirm = () => setConfirmModal({ state: false, onConfirm: null, title: "", content: "" });

    const debFilter = useDebounce(filters, filters.onChangeSearch ? 1000 : 0);
    const { listQuery, isRefreshing, handleRefresh } = useCricketAdmins(debFilter);

    const toggleAdmin = useMutation({
        mutationKey: ["toggleCricketAdminFlag"],
        mutationFn: TOGGLE_CRICKET_ADMIN,
        onSuccess: (data) => {
            toast.success(data?.message || "Scoring access updated");
            queryClient.invalidateQueries({ queryKey: [ADMIN_KEYS.CRICKET.ADMINS] });
            closeConfirm();
        },
        onError: (error) => {
            toast.error(error?.errorMessage || "Failed to update scoring access");
            closeConfirm();
        }
    });

    const columns = [
        {
            title: "User",
            key: "user",
            render: (_, record) => (
                <div className="flex items-center gap-2 min-w-0">
                    <Avatar src={record.profileImage || undefined} size={32} className="!bg-slate-100 !text-slate-500 !text-[11px]">
                        {record.name?.[0]?.toUpperCase()}
                    </Avatar>
                    <div className="flex flex-col min-w-0">
                        <span className="text-[11px] font-bold text-slate-800 dark:text-slate-100 capitalize truncate">
                            {record.name}
                        </span>
                        <span className="text-[9px] text-slate-400 font-medium truncate">
                            {[record.email, record.phone].filter(Boolean).join(" · ") || "—"}
                        </span>
                    </div>
                </div>
            )
        },
        {
            title: "Scoring Access",
            key: "isCricketAdmin",
            align: "center",
            render: (_, record) => (
                <Tooltip title={record.isCricketAdmin ? "Revoke global scoring access" : "Grant global scoring access"}>
                    <Switch
                        size="small"
                        checked={Boolean(record.isCricketAdmin)}
                        loading={toggleAdmin.isPending && toggleAdmin.variables?.userId === record._id}
                        onChange={(checked) =>
                            setConfirmModal({
                                state: true,
                                title: checked ? "Grant Scoring Access" : "Revoke Scoring Access",
                                content: checked
                                    ? `Grant ${record.name} cricket-scoring access across the app?`
                                    : `Revoke ${record.name}'s cricket-scoring access? Their per-tournament assignments stay in place until removed from each tournament.`,
                                onConfirm: () => toggleAdmin.mutate({ userId: record._id, isCricketAdmin: checked })
                            })
                        }
                    />
                </Tooltip>
            )
        },
        {
            title: "Tournaments Managed",
            key: "tournaments",
            render: (_, record) => {
                const tournaments = record.managedTournaments || [];
                if (tournaments.length === 0) {
                    return <span className="text-[10px] text-slate-400 font-medium">None assigned</span>;
                }
                return (
                    <div className="flex flex-wrap gap-1 max-w-[320px]">
                        {tournaments.map((tournament) => (
                            <button
                                key={tournament._id}
                                onClick={() => router.push(`/admin/cricket/tournaments/detail?id=${tournament._id}`)}
                                title={`${tournament.name} — ${tournament.city || ""}`}
                            >
                                <Tag
                                    color={STATUS_COLORS[tournament.status]?.tag || "default"}
                                    className="!text-[9px] !font-semibold !rounded !m-0 cursor-pointer hover:!opacity-80 transition-opacity"
                                >
                                    {tournament.name}
                                </Tag>
                            </button>
                        ))}
                    </div>
                );
            }
        },
        {
            title: "Count",
            dataIndex: "tournamentsCount",
            key: "tournamentsCount",
            align: "center",
            render: (count) => (
                <span className="text-[11px] font-bold text-[#006666] dark:text-teal-400">{count ?? 0}</span>
            )
        },
        {
            title: "Account Status",
            dataIndex: "status",
            key: "status",
            render: (status) => (
                <Tag className="!text-[9px] !font-bold !uppercase !rounded !bg-slate-50 !border-slate-200 !text-slate-600">
                    {status || "—"}
                </Tag>
            )
        },
        {
            title: "Joined",
            dataIndex: "createdAt",
            key: "createdAt",
            render: (date) => (
                <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium whitespace-nowrap">
                    {timestampToDate(date)}
                </span>
            )
        }
    ];

    const { docs = [], totalDocs = 0, limit = 20, page = 1 } = listQuery?.data?.data || {};

    return (
        <InnerPageCard>
            <div className="flex flex-col md:flex-row justify-between mb-3 gap-3 items-start md:items-center">
                <div className="flex flex-col">
                    <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                        Admins & Scorers {totalDocs > 0 ? `(${totalDocs})` : ""}
                    </p>
                    <p className="text-[10px] text-slate-400 font-medium mt-0.5">
                        App users who can score cricket from the mobile app. Assign them to a tournament from its own Admins & Scorers tab.
                    </p>
                </div>

                <div className="flex items-center gap-2 w-full md:w-auto justify-end">
                    <SearchInput setFilters={setFilters} className="!max-w-[200px]" />
                    <button
                        onClick={handleRefresh}
                        disabled={isRefreshing}
                        title="Refresh Data"
                        className="flex items-center justify-center !h-[32px] !w-[32px] !border-2 !rounded-[2px] !border-[#006666] dark:!border-teal-900/50 !bg-white dark:!bg-slate-800 !text-[#006666] dark:!text-teal-400 hover:!bg-[#006666] dark:hover:!bg-teal-600 hover:!text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <HiRefresh size={16} className={isRefreshing ? "animate-spin" : ""} />
                    </button>
                </div>
            </div>

            {!listQuery.isLoading && docs.length === 0 ? (
                <EmptyState
                    icon={<FaUserShield className="w-10 h-10 text-teal-100" />}
                    title="No cricket admins yet"
                    description="No app users hold scoring rights. Assign a scorer from a tournament's Admins & Scorers tab."
                    actionTitle="Go to Tournaments"
                    onAction={() => router.push("/admin/cricket/tournaments")}
                    className="my-8"
                />
            ) : (
                <div className="place-holder-table modern-table overflow-hidden">
                    <Table
                        dataSource={docs}
                        columns={columns}
                        rowKey="_id"
                        onChange={(pagination) => setFilters((prev) => ({ ...prev, page: pagination.current, limit: pagination.pageSize }))}
                        className="custom-ant-table"
                        scroll={{ x: "max-content" }}
                        loading={{
                            spinning: listQuery.isLoading,
                            indicator: <TableSkeleton rows={8} columns={5} />
                        }}
                        pagination={{
                            total: totalDocs,
                            pageSize: limit,
                            current: page,
                            showSizeChanger: true,
                            pageSizeOptions: ["10", "20", "50", "100"]
                        }}
                    />
                </div>
            )}

            {confirmModal.state && (
                <ConfirmModal
                    isOpen={confirmModal.state}
                    onClose={closeConfirm}
                    title={confirmModal.title}
                    description={confirmModal.content}
                    onConfirm={confirmModal.onConfirm}
                    loading={toggleAdmin.isPending}
                />
            )}
        </InnerPageCard>
    );
}
