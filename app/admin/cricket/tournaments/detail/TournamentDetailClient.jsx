"use client";
import React, { Suspense, useState } from "react";
import { Tabs, Tag, Skeleton } from "antd";
import { useSearchParams, useRouter } from "next/navigation";
import { ArrowLeftOutlined, EditOutlined } from "@ant-design/icons";
import { FaTrophy } from "react-icons/fa6";

import InnerPageCard from "@/components/layout/InnerPageCard";
import EmptyState from "@/components/shared/EmptyState";
import CustomButton from "@/components/shared/CustomButton";
import { timestampToDate } from "@/utils/date";
import { STATUS_COLORS, STATUS_LABELS } from "@/constants/cricket";

import { useTournamentDetails } from "../hooks/useTournamentDetails";
import TournamentFormModal from "../components/TournamentFormModal";
import OverviewTab from "./components/OverviewTab";
import TeamsTab from "./components/TeamsTab";
import FixturesTab from "./components/FixturesTab";
import AdminsTab from "./components/AdminsTab";

/**
 * Tournament detail dashboard.
 *
 * The tournament id travels as a query parameter rather than a route segment:
 * the portal is built with `output: 'export'`, so a dynamic segment would need
 * every id known at build time.
 */
function TournamentDetailView() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const id = searchParams.get("id");

    const [modal, setModal] = useState({ name: null, data: null, state: false });
    const { query, tournament, matches } = useTournamentDetails(id);

    if (!id) {
        return (
            <InnerPageCard>
                <EmptyState
                    icon={<FaTrophy className="w-10 h-10 text-teal-100" />}
                    title="No tournament selected"
                    description="Open a tournament from the tournaments list to manage its teams, fixtures and scorers."
                    actionTitle="Back to Tournaments"
                    onAction={() => router.push("/admin/cricket/tournaments")}
                    className="my-8"
                />
            </InnerPageCard>
        );
    }

    if (query.isLoading) {
        return (
            <InnerPageCard>
                <Skeleton active paragraph={{ rows: 8 }} />
            </InnerPageCard>
        );
    }

    if (!tournament) {
        return (
            <InnerPageCard>
                <EmptyState
                    icon={<FaTrophy className="w-10 h-10 text-teal-100" />}
                    title="Tournament not found"
                    description="This tournament may have been deleted. Head back to the list to pick another."
                    actionTitle="Back to Tournaments"
                    onAction={() => router.push("/admin/cricket/tournaments")}
                    className="my-8"
                />
            </InnerPageCard>
        );
    }

    const palette = STATUS_COLORS[tournament.status];

    return (
        <InnerPageCard>
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4">
                <div className="flex items-start gap-3 min-w-0">
                    <button
                        onClick={() => router.push("/admin/cricket/tournaments")}
                        title="Back to tournaments"
                        className="flex items-center justify-center h-[32px] w-[32px] rounded border-2 border-slate-100 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:border-[#006666] hover:text-[#006666] transition-colors shrink-0"
                    >
                        <ArrowLeftOutlined />
                    </button>
                    <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                            <h1 className="text-lg font-bold text-slate-900 dark:text-slate-100 capitalize truncate">
                                {tournament.name}
                            </h1>
                            <Tag color={palette?.tag || "default"} className="!text-[9px] !font-bold !uppercase !rounded">
                                {STATUS_LABELS[tournament.status] || tournament.status}
                            </Tag>
                            <Tag className="!text-[9px] !font-bold !rounded !bg-slate-50 !border-slate-200 !text-slate-600">
                                {tournament.format} · {tournament.defaultMaxOvers} overs
                            </Tag>
                        </div>
                        <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium mt-0.5">
                            {tournament.venue}, {tournament.city} · {timestampToDate(tournament.startDate)}
                            {tournament.endDate ? ` – ${timestampToDate(tournament.endDate)}` : ""}
                        </p>
                    </div>
                </div>

                <CustomButton
                    label="Edit Settings"
                    icon={<EditOutlined />}
                    onClick={() => setModal({ name: "EditTournament", data: tournament, state: true })}
                />
            </div>

            <Tabs
                defaultActiveKey="overview"
                className="cricket-detail-tabs"
                items={[
                    {
                        key: "overview",
                        label: <span className="text-[12px] font-semibold">Overview & Standings</span>,
                        children: <OverviewTab tournament={tournament} matches={matches} />
                    },
                    {
                        key: "teams",
                        label: <span className="text-[12px] font-semibold">Teams & Roster ({tournament.teams?.length || 0})</span>,
                        children: <TeamsTab tournament={tournament} />
                    },
                    {
                        key: "fixtures",
                        label: <span className="text-[12px] font-semibold">Fixtures ({matches?.length || 0})</span>,
                        children: <FixturesTab tournament={tournament} matches={matches} />
                    },
                    {
                        key: "admins",
                        label: <span className="text-[12px] font-semibold">Admins & Scorers ({tournament.admins?.length || 0})</span>,
                        children: <AdminsTab tournament={tournament} />
                    }
                ]}
            />

            <TournamentFormModal modal={modal} setModal={setModal} />
        </InnerPageCard>
    );
}

export default function TournamentDetailClient() {
    return (
        <Suspense
            fallback={
                <InnerPageCard>
                    <Skeleton active paragraph={{ rows: 8 }} />
                </InnerPageCard>
            }
        >
            <TournamentDetailView />
        </Suspense>
    );
}
