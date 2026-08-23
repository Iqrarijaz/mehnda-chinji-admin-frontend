"use client";
import React, { useState } from "react";
import { Select } from "antd";
import { HiRefresh } from "react-icons/hi";

import SearchInput from "@/components/InnerPage/SearchInput";
import ColumnVisibilityDropdown from "@/components/InnerPage/ColumnVisibilityDropdown";
import InnerPageCard from "@/components/layout/InnerPageCard";
import StatCard from "@/components/shared/StatCard";
import { StatCardSkeleton } from "@/components/shared/Skeletons";
import { useDebounce } from "@/hooks/useDebounce";
import MatchFormModal from "@/components/admin/cricket/MatchFormModal";
import TossModal from "@/components/admin/cricket/TossModal";

import MatchesTable from "./components/Table";
import { useCricketMatches } from "./hooks/useCricketMatches";
import { MATCH_STAGES, STAGE_LABELS, STATUS_COLORS } from "@/constants/cricket";

const DEFAULT_COLUMNS = [
    "fixture", "tournament", "stage", "scheduledAt",
    "toss", "score", "result", "status", "actions"
];

const COLUMN_OPTIONS = [
    { label: "Fixture", value: "fixture" },
    { label: "Tournament", value: "tournament" },
    { label: "Stage", value: "stage" },
    { label: "Venue", value: "venue" },
    { label: "Scheduled", value: "scheduledAt" },
    { label: "Toss", value: "toss" },
    { label: "Score", value: "score" },
    { label: "Result", value: "result" },
    { label: "Status", value: "status" }
];

const STAT_CARDS = [
    { label: "Upcoming", short: "Up", key: "UPCOMING" },
    { label: "Live", short: "Live", key: "LIVE" },
    { label: "Completed", short: "Done", key: "COMPLETED" },
    { label: "Abandoned", short: "Aban", key: "ABANDONED" }
];

export default function CricketMatchesPage() {
    const [modal, setModal] = useState({ name: null, data: null, state: false });
    const [filters, setFilters] = useState({
        page: 1,
        limit: 20,
        status: null,
        stage: null,
        search: "",
        onChangeSearch: false
    });
    const [visibleColumns, setVisibleColumns] = useState(DEFAULT_COLUMNS);

    const debFilter = useDebounce(filters, filters.onChangeSearch ? 1000 : 0);
    const { listQuery, countsQuery, isRefreshing, handleRefresh } = useCricketMatches(debFilter);

    const counts = countsQuery.data?.data || { UPCOMING: 0, LIVE: 0, COMPLETED: 0, ABANDONED: 0, total: 0 };

    const onChange = React.useCallback((data) => {
        setFilters((prev) => ({ ...prev, ...data }));
    }, []);

    return (
        <InnerPageCard>
            <div className="flex flex-col md:flex-row justify-between mb-3 gap-3 items-start md:items-center">
                <div className="flex gap-2 items-center flex-wrap">
                    {countsQuery.isLoading ? (
                        Array.from({ length: 4 }).map((_, i) => <StatCardSkeleton key={i} />)
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
                        placeholder="Stage"
                        value={filters.stage || undefined}
                        onChange={(value) => setFilters((prev) => ({ ...prev, stage: value || null, page: 1 }))}
                        options={MATCH_STAGES.map((stage) => ({ value: stage, label: STAGE_LABELS[stage] }))}
                        className="!w-[130px]"
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
                </div>
            </div>

            <MatchesTable
                matchesList={listQuery}
                setModal={setModal}
                onChange={onChange}
                visibleColumns={visibleColumns}
            />

            <MatchFormModal modal={modal} setModal={setModal} />
            <TossModal modal={modal} setModal={setModal} />
        </InnerPageCard>
    );
}
