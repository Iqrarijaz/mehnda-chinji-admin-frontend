"use client";
import React, { useState } from "react";
import { Table, Avatar, Tag, Tooltip, Select, Button } from "antd";
import { EyeOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { HiRefresh } from "react-icons/hi";
import { GiCricketBat } from "react-icons/gi";

import SearchInput from "@/components/InnerPage/SearchInput";
import InnerPageCard from "@/components/layout/InnerPageCard";
import EmptyState from "@/components/shared/EmptyState";
import { TableSkeleton } from "@/components/shared/Skeletons";
import { useDebounce } from "@/hooks/useDebounce";
import { GET_CRICKET_TOURNAMENTS } from "@/app/api/admin/cricket";
import { ADMIN_KEYS } from "@/constants/queryKeys";
import {
    PLAYER_ROLE_LABELS,
    PLAYER_ROLE_SHORT,
    STATUS_COLORS,
    STATUS_LABELS,
    TOURNAMENT_STATUS
} from "@/constants/cricket";

import { useCricketTeams } from "./hooks/useCricketTeams";

/**
 * Teams & Squads — every squad on the platform, flattened out of the
 * tournaments that own them, with the roster expandable inline.
 */
export default function CricketTeamsPage() {
    const router = useRouter();
    const [filters, setFilters] = useState({
        page: 1,
        limit: 20,
        tournamentId: null,
        status: null,
        search: "",
        onChangeSearch: false
    });

    const debFilter = useDebounce(filters, filters.onChangeSearch ? 1000 : 0);
    const { listQuery, isRefreshing, handleRefresh } = useCricketTeams(debFilter);

    // Tournament picker options — a light list purely to drive the filter.
    const tournamentsQuery = useQuery({
        queryKey: [ADMIN_KEYS.CRICKET.TOURNAMENTS, "teamFilterOptions"],
        queryFn: () => GET_CRICKET_TOURNAMENTS({ page: 1, limit: 100 })
    });

    const tournamentOptions = (tournamentsQuery.data?.data?.docs || []).map((tournament) => ({
        value: tournament._id,
        label: `${tournament.name} (${tournament.city})`
    }));

    const columns = [
        {
            title: "Team",
            key: "team",
            render: (_, record) => (
                <div className="flex items-center gap-2 min-w-0">
                    {record.logo ? (
                        <Avatar src={record.logo} size={32} shape="square" className="border border-slate-100" />
                    ) : (
                        <Avatar shape="square" size={32} className="!bg-teal-50 !text-[#006666] !text-[10px] !font-bold">
                            {record.shortName}
                        </Avatar>
                    )}
                    <div className="flex flex-col min-w-0">
                        <span className="text-[11px] font-bold text-slate-800 dark:text-slate-100 capitalize truncate">
                            {record.name}
                        </span>
                        <span className="text-[9px] text-slate-400 font-medium truncate">
                            {record.shortName} · {record.playersCount} players
                        </span>
                    </div>
                </div>
            )
        },
        {
            title: "Tournament",
            key: "tournament",
            render: (_, record) => (
                <button
                    onClick={() => router.push(`/admin/cricket/tournaments/detail?id=${record.tournament?._id}`)}
                    className="flex flex-col min-w-0 text-left group"
                >
                    <span className="text-[10px] font-semibold text-slate-700 dark:text-slate-300 capitalize truncate group-hover:text-[#006666] dark:group-hover:text-teal-400 transition-colors">
                        {record.tournament?.name || "—"}
                    </span>
                    <span className="text-[9px] text-slate-400 font-medium truncate">
                        {record.tournament?.city} · {record.tournament?.format}
                    </span>
                </button>
            )
        },
        {
            title: "Captain",
            key: "captain",
            render: (_, record) => (
                <div className="flex flex-col min-w-0">
                    <span className="text-[10px] font-semibold text-slate-700 dark:text-slate-300 capitalize truncate">
                        {record.captainName || "—"}
                    </span>
                    {record.captainPhone && (
                        <span className="text-[9px] text-slate-400 font-medium truncate">{record.captainPhone}</span>
                    )}
                </div>
            )
        },
        {
            title: "Record",
            key: "record",
            render: (_, record) => (
                <span className="text-[10px] font-semibold text-slate-600 dark:text-slate-300 whitespace-nowrap">
                    {record.stats?.played || 0}P · {record.stats?.won || 0}W · {record.stats?.lost || 0}L
                </span>
            )
        },
        {
            title: "Points",
            key: "points",
            align: "center",
            render: (_, record) => (
                <span className="text-[11px] font-bold text-[#006666] dark:text-teal-400">{record.stats?.points || 0}</span>
            )
        },
        {
            title: "NRR",
            key: "nrr",
            align: "center",
            render: (_, record) => {
                const nrr = Number(record.stats?.netRunRate || 0);
                return (
                    <span className={`text-[10px] font-bold ${nrr > 0 ? "text-green-600" : nrr < 0 ? "text-red-500" : "text-slate-500"}`}>
                        {nrr > 0 ? "+" : ""}{nrr.toFixed(3)}
                    </span>
                );
            }
        },
        {
            title: "Tournament Status",
            key: "status",
            render: (_, record) => {
                const status = record.tournament?.status;
                return (
                    <Tag color={STATUS_COLORS[status]?.tag || "default"} className="!text-[9px] !font-bold !uppercase !rounded">
                        {STATUS_LABELS[status] || status || "—"}
                    </Tag>
                );
            }
        },
        {
            title: "Manage",
            key: "manage",
            align: "center",
            width: 70,
            fixed: "right",
            render: (_, record) => (
                <Tooltip title="Open tournament to edit this roster">
                    <Button
                        type="text"
                        icon={<EyeOutlined className="text-[#006666] dark:text-teal-400" />}
                        onClick={() => router.push(`/admin/cricket/tournaments/detail?id=${record.tournament?._id}`)}
                        className="hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full"
                    />
                </Tooltip>
            )
        }
    ];

    const { docs = [], totalDocs = 0, limit = 20, page = 1 } = listQuery?.data?.data || {};

    return (
        <InnerPageCard>
            <div className="flex flex-col md:flex-row justify-between mb-3 gap-3 items-start md:items-center">
                <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                    Teams & Squads {totalDocs > 0 ? `(${totalDocs})` : ""}
                </p>

                <div className="flex items-center gap-2 w-full md:w-auto justify-end flex-wrap">
                    <Select
                        allowClear
                        showSearch
                        optionFilterProp="label"
                        placeholder="All tournaments"
                        value={filters.tournamentId || undefined}
                        onChange={(value) => setFilters((prev) => ({ ...prev, tournamentId: value || null, page: 1 }))}
                        options={tournamentOptions}
                        loading={tournamentsQuery.isLoading}
                        className="!w-[200px]"
                        size="small"
                    />
                    <Select
                        allowClear
                        placeholder="Status"
                        value={filters.status || undefined}
                        onChange={(value) => setFilters((prev) => ({ ...prev, status: value || null, page: 1 }))}
                        options={TOURNAMENT_STATUS.map((status) => ({ value: status, label: STATUS_LABELS[status] }))}
                        className="!w-[120px]"
                        size="small"
                    />
                    <SearchInput setFilters={setFilters} className="!max-w-[180px]" />
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
                    icon={<GiCricketBat className="w-10 h-10 text-teal-100" />}
                    title="No teams found"
                    description="No squads match your filters. Teams are registered from a tournament's Teams & Roster tab."
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
                            indicator: <TableSkeleton rows={8} columns={6} />
                        }}
                        expandable={{
                            expandedRowRender: (record) => (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 py-1">
                                    {(record.players || []).map((player) => (
                                        <div
                                            key={player._id || player.name}
                                            className="flex items-center gap-2 border border-slate-100 dark:border-slate-800 rounded p-2"
                                        >
                                            <Avatar src={player.image || undefined} size={24} className="!bg-slate-100 !text-slate-500 !text-[9px]">
                                                {player.name?.[0]?.toUpperCase()}
                                            </Avatar>
                                            <div className="flex flex-col min-w-0 flex-1">
                                                <div className="flex items-center gap-1">
                                                    <span className="text-[10px] font-semibold text-slate-800 dark:text-slate-200 capitalize truncate">
                                                        {player.name}
                                                    </span>
                                                    {player.isCaptain && (
                                                        <span className="text-[7px] font-bold bg-[#006666] text-white rounded-full h-[13px] w-[13px] flex items-center justify-center shrink-0">
                                                            C
                                                        </span>
                                                    )}
                                                </div>
                                                <Tooltip title={PLAYER_ROLE_LABELS[player.role]}>
                                                    <span className="text-[9px] text-slate-400 font-medium">
                                                        {PLAYER_ROLE_SHORT[player.role] || player.role}
                                                        {player.jerseyNumber !== null && player.jerseyNumber !== undefined ? ` · #${player.jerseyNumber}` : ""}
                                                    </span>
                                                </Tooltip>
                                            </div>
                                        </div>
                                    ))}
                                    {(record.players || []).length === 0 && (
                                        <span className="text-[11px] text-slate-400 font-medium">No players in this squad.</span>
                                    )}
                                </div>
                            ),
                            rowExpandable: (record) => (record.players || []).length > 0
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
        </InnerPageCard>
    );
}
