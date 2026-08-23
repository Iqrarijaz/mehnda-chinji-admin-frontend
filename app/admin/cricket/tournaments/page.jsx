"use client";
import React, { useState } from "react";
import { Select } from "antd";
import { HiRefresh } from "react-icons/hi";

import AddButton from "@/components/InnerPage/AddButton";
import SearchInput from "@/components/InnerPage/SearchInput";
import ColumnVisibilityDropdown from "@/components/InnerPage/ColumnVisibilityDropdown";
import InnerPageCard from "@/components/layout/InnerPageCard";
import StatCard from "@/components/shared/StatCard";
import { StatCardSkeleton } from "@/components/shared/Skeletons";
import { useDebounce } from "@/hooks/useDebounce";

import TournamentsTable from "./components/Table";
import TournamentFormModal from "./components/TournamentFormModal";
import { useCricketTournaments } from "./hooks/useCricketTournaments";
import { TOURNAMENT_FORMATS, STATUS_COLORS, STATUS_LABELS } from "@/constants/cricket";

const DEFAULT_COLUMNS = [
    "tournament", "city", "format", "teamsCount", "matchesCount",
    "schedule", "status", "actions"
];

const COLUMN_OPTIONS = [
    { label: "Tournament", value: "tournament" },
    { label: "City", value: "city" },
    { label: "Format", value: "format" },
    { label: "Teams", value: "teamsCount" },
    { label: "Fixtures", value: "matchesCount" },
    { label: "Schedule", value: "schedule" },
    { label: "Status", value: "status" },
    { label: "Prizes", value: "prizes" },
    { label: "Created At", value: "createdAt" }
];

const STAT_CARDS = [
    { label: "Upcoming", short: "Up", key: "UPCOMING" },
    { label: "Live", short: "Live", key: "LIVE" },
    { label: "Completed", short: "Done", key: "COMPLETED" }
];

export default function CricketTournamentsPage() {
    const [modal, setModal] = useState({ name: null, data: null, state: false });
    const [filters, setFilters] = useState({
        page: 1,
        limit: 20,
        status: null,
        format: null,
        search: "",
        onChangeSearch: false
    });
    const [visibleColumns, setVisibleColumns] = useState(DEFAULT_COLUMNS);

    const debFilter = useDebounce(filters, filters.onChangeSearch ? 1000 : 0);
    const { listQuery, countsQuery, isRefreshing, handleRefresh } = useCricketTournaments(debFilter);

    const counts = countsQuery.data?.data || { UPCOMING: 0, LIVE: 0, COMPLETED: 0, total: 0 };

    const onChange = React.useCallback((data) => {
        setFilters((prev) => ({ ...prev, ...data }));
    }, []);

    return (
        <InnerPageCard>
            <div className="flex flex-col md:flex-row justify-between mb-3 gap-3 items-start md:items-center">
                <div className="flex gap-2 items-center flex-wrap">
                    {countsQuery.isLoading ? (
                        Array.from({ length: 3 }).map((_, i) => <StatCardSkeleton key={i} />)
                    ) : (
                        STAT_CARDS.map((card) => {
                            const palette = STATUS_COLORS[card.key];
                            return (
                                <StatCard
                                    key={card.key}
                                    title={card.label}
                                    shortTitle={card.short}
                                    count={counts[card.key] || 0}
                                    color={palette.color}
                                    bg={palette.bg}
                                    border={palette.border}
                                    active={filters.status === card.key}
                                    onClick={() =>
                                        setFilters((prev) => ({
                                            ...prev,
                                            status: prev.status === card.key ? null : card.key,
                                            page: 1
                                        }))
                                    }
                                />
                            );
                        })
                    )}
                </div>

                <div className="flex items-center gap-2 w-full md:w-auto justify-end flex-wrap">
                    <Select
                        allowClear
                        placeholder="Format"
                        value={filters.format || undefined}
                        onChange={(value) => setFilters((prev) => ({ ...prev, format: value || null, page: 1 }))}
                        options={TOURNAMENT_FORMATS.map((f) => ({ value: f, label: f }))}
                        className="!w-[110px]"
                        size="small"
                    />
                    <SearchInput setFilters={setFilters} className="!max-w-[180px]" />
                    <ColumnVisibilityDropdown
                        options={COLUMN_OPTIONS}
                        visibleColumns={visibleColumns}
                        setVisibleColumns={setVisibleColumns}
                    />
                    <button
                        onClick={handleRefresh}
                        disabled={isRefreshing}
                        title="Refresh Data"
                        className="flex items-center justify-center !h-[32px] !w-[32px] !border-2 !rounded-[2px] !border-[#006666] dark:!border-teal-900/50 !bg-white dark:!bg-slate-800 !text-[#006666] dark:!text-teal-400 hover:!bg-[#006666] dark:hover:!bg-teal-600 hover:!text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <HiRefresh size={16} className={isRefreshing ? "animate-spin" : ""} />
                    </button>
                    <AddButton
                        title="Create Tournament"
                        icon={false}
                        onClick={() => setModal({ name: "AddTournament", data: null, state: true })}
                        className="!h-[32px] !rounded !px-4 !text-[10px] font-medium transform hover:scale-[1.02] active:scale-[0.98]"
                    />
                </div>
            </div>

            <TournamentsTable
                tournamentsList={listQuery}
                setModal={setModal}
                onChange={onChange}
                visibleColumns={visibleColumns}
            />

            <TournamentFormModal modal={modal} setModal={setModal} />
        </InnerPageCard>
    );
}
