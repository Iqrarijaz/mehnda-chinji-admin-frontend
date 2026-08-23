"use client";
import React, { Suspense, useState } from "react";
import { Tag, Skeleton } from "antd";
import { useSearchParams, useRouter } from "next/navigation";
import { ArrowLeftOutlined, EditOutlined } from "@ant-design/icons";
import { GiCoinflip } from "react-icons/gi";
import { FaRegCalendarCheck } from "react-icons/fa6";

import InnerPageCard from "@/components/layout/InnerPageCard";
import EmptyState from "@/components/shared/EmptyState";
import CustomButton from "@/components/shared/CustomButton";
import MatchFormModal from "@/components/admin/cricket/MatchFormModal";
import TossModal from "@/components/admin/cricket/TossModal";
import { timestampToDateWithTime } from "@/utils/date";
import { STATUS_COLORS, STATUS_LABELS, STAGE_LABELS } from "@/constants/cricket";

import { useMatchDetails } from "../hooks/useMatchDetails";
import Scorecard from "./components/Scorecard";
import ScorerPanel from "./components/ScorerPanel";
import OverHistory from "./components/OverHistory";
import SquadList from "./components/SquadList";

/**
 * Match detail & live scorer view.
 *
 * Like the tournament dashboard, the match id travels as a query parameter so
 * the page stays statically exportable.
 */
function MatchDetailView() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const id = searchParams.get("id");

    const [modal, setModal] = useState({ name: null, data: null, state: false });
    const { query, match, teams, totalPredictions } = useMatchDetails(id);

    if (!id) {
        return (
            <InnerPageCard>
                <EmptyState
                    icon={<FaRegCalendarCheck className="w-10 h-10 text-teal-100" />}
                    title="No match selected"
                    description="Open a fixture from the matches list to view its scorecard and scorer panel."
                    actionTitle="Back to Matches"
                    onAction={() => router.push("/admin/cricket/matches")}
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

    if (!match) {
        return (
            <InnerPageCard>
                <EmptyState
                    icon={<FaRegCalendarCheck className="w-10 h-10 text-teal-100" />}
                    title="Match not found"
                    description="This fixture may have been deleted. Head back to the list to pick another."
                    actionTitle="Back to Matches"
                    onAction={() => router.push("/admin/cricket/matches")}
                    className="my-8"
                />
            </InnerPageCard>
        );
    }

    const palette = STATUS_COLORS[match.status];
    const tournamentId = match.tournamentId?._id || match.tournamentId;

    return (
        <InnerPageCard>
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4">
                <div className="flex items-start gap-3 min-w-0">
                    <button
                        onClick={() => router.push("/admin/cricket/matches")}
                        title="Back to matches"
                        className="flex items-center justify-center h-[32px] w-[32px] rounded border-2 border-slate-100 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:border-[#006666] hover:text-[#006666] transition-colors shrink-0"
                    >
                        <ArrowLeftOutlined />
                    </button>
                    <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                            <h1 className="text-lg font-bold text-slate-900 dark:text-slate-100 truncate">
                                {match.matchTitle}
                            </h1>
                            <Tag color={palette?.tag || "default"} className="!text-[9px] !font-bold !uppercase !rounded">
                                {STATUS_LABELS[match.status] || match.status}
                            </Tag>
                            <Tag className="!text-[9px] !font-bold !rounded !bg-slate-50 !border-slate-200 !text-slate-600">
                                {STAGE_LABELS[match.stage] || match.stage} · {match.maxOvers} overs
                            </Tag>
                        </div>
                        <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium mt-0.5">
                            {match.venue} · {timestampToDateWithTime(match.scheduledAt)}
                            {match.tournamentId?.name ? (
                                <>
                                    {" · "}
                                    <button
                                        onClick={() => router.push(`/admin/cricket/tournaments/detail?id=${tournamentId}`)}
                                        className="text-[#006666] dark:text-teal-400 font-semibold hover:underline"
                                    >
                                        {match.tournamentId.name}
                                    </button>
                                </>
                            ) : null}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <CustomButton
                        label="Record Toss"
                        type="secondary"
                        icon={<GiCoinflip />}
                        onClick={() => setModal({ name: "Toss", data: match, state: true })}
                    />
                    <CustomButton
                        label="Edit Fixture"
                        icon={<EditOutlined />}
                        onClick={() => setModal({ name: "EditMatch", data: match, state: true })}
                    />
                </div>
            </div>

            <div className="space-y-4">
                <Scorecard match={match} totalPredictions={totalPredictions} />

                {/* Scorer control panel */}
                <section className="border-2 border-[#006666]/20 dark:border-teal-900/40 rounded p-4">
                    <p className="text-[10px] font-bold text-[#006666] dark:text-teal-400 uppercase tracking-widest mb-3">
                        Scorer Control Panel
                    </p>
                    <ScorerPanel match={match} teams={teams} />
                </section>

                {/* Over history */}
                <section className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                    <OverHistory innings={match.innings1} title="Innings 1 — Over History" />
                    <OverHistory innings={match.innings2} title="Innings 2 — Over History" />
                </section>

                {/* Squads */}
                <section className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                    <SquadList team={teams?.teamA} label={match.teamA?.name} />
                    <SquadList team={teams?.teamB} label={match.teamB?.name} />
                </section>
            </div>

            <MatchFormModal modal={modal} setModal={setModal} tournamentId={tournamentId} />
            <TossModal modal={modal} setModal={setModal} />
        </InnerPageCard>
    );
}

export default function MatchDetailClient() {
    return (
        <Suspense
            fallback={
                <InnerPageCard>
                    <Skeleton active paragraph={{ rows: 8 }} />
                </InnerPageCard>
            }
        >
            <MatchDetailView />
        </Suspense>
    );
}
