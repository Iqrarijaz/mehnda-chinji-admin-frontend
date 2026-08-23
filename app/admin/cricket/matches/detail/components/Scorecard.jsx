"use client";
import React from "react";
import { Avatar, Tag, Progress } from "antd";

import { formatInningsScore, formatOvers, STATUS_COLORS, STATUS_LABELS } from "@/constants/cricket";

/**
 * Scorecard summary — both innings side by side, plus the app-side prediction
 * split the user API collects.
 */

const TeamScore = ({ team, innings, isBatting }) => (
    <div className={`flex-1 border rounded p-3 ${isBatting ? "border-green-200 bg-green-50/40 dark:bg-green-950/10 dark:border-green-900/30" : "border-slate-100 dark:border-slate-800"}`}>
        <div className="flex items-center gap-2 mb-2">
            {team?.logo ? (
                <Avatar src={team.logo} size={30} shape="square" className="border border-slate-100" />
            ) : (
                <Avatar shape="square" size={30} className="!bg-teal-50 !text-[#006666] !text-[10px] !font-bold">
                    {team?.name?.slice(0, 3)?.toUpperCase()}
                </Avatar>
            )}
            <div className="flex flex-col min-w-0">
                <span className="text-[12px] font-bold text-slate-800 dark:text-slate-100 capitalize truncate">
                    {team?.name || "—"}
                </span>
                {isBatting && <span className="text-[9px] font-bold text-green-600 uppercase tracking-wider">Batting</span>}
            </div>
        </div>
        <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 leading-none">
            {innings ? `${innings.totalRuns || 0}/${innings.totalWickets || 0}` : "—"}
        </p>
        <p className="text-[10px] text-slate-400 font-medium mt-1">
            {innings ? `${formatOvers(innings.totalOvers)} / ${innings.maxOvers} overs` : "Yet to bat"}
        </p>
    </div>
);

const Scorecard = ({ match, totalPredictions = 0 }) => {
    const palette = STATUS_COLORS[match.status];

    const activeInnings = match.currentInnings === 2 ? match.innings2 : match.innings1;
    const battingId = String(activeInnings?.battingTeamId || "");
    const isLive = match.status === "LIVE";

    const teamAVotes = match.predictionsSummary?.teamAVotes || 0;
    const teamBVotes = match.predictionsSummary?.teamBVotes || 0;
    const teamAProbability = match.predictionsSummary?.teamAProbability ?? 50;

    const tossWinnerName =
        String(match.tossWinnerId) === String(match.teamA?.id)
            ? match.teamA?.name
            : String(match.tossWinnerId) === String(match.teamB?.id)
                ? match.teamB?.name
                : null;

    return (
        <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
                <TeamScore
                    team={match.teamA}
                    innings={String(match.innings1?.battingTeamId) === String(match.teamA?.id) ? match.innings1 : match.innings2}
                    isBatting={isLive && battingId === String(match.teamA?.id)}
                />
                <div className="flex items-center justify-center px-2">
                    <span className="text-[10px] font-bold text-slate-300 dark:text-slate-600 uppercase tracking-widest">vs</span>
                </div>
                <TeamScore
                    team={match.teamB}
                    innings={String(match.innings1?.battingTeamId) === String(match.teamB?.id) ? match.innings1 : match.innings2}
                    isBatting={isLive && battingId === String(match.teamB?.id)}
                />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <Fact label="Status" value={
                    <Tag color={palette?.tag || "default"} className="!text-[9px] !font-bold !uppercase !rounded">
                        {STATUS_LABELS[match.status] || match.status}
                    </Tag>
                } />
                <Fact label="Toss" value={tossWinnerName ? `${tossWinnerName} · ${match.tossDecision === "BAT" ? "chose to bat" : "chose to bowl"}` : "Not recorded"} />
                <Fact label="Innings 1" value={formatInningsScore(match.innings1)} />
                <Fact label="Innings 2" value={formatInningsScore(match.innings2)} />
            </div>

            {match.result && (
                <div className="border border-teal-100 dark:border-teal-900/30 bg-teal-50/50 dark:bg-teal-950/10 rounded p-3">
                    <p className="text-[9px] font-bold text-teal-600 dark:text-teal-400 uppercase tracking-widest">Result</p>
                    <p className="text-[13px] font-bold text-slate-800 dark:text-slate-100 mt-0.5">{match.result}</p>
                    {match.manOfTheMatch?.name && (
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium mt-1">
                            Man of the Match: {match.manOfTheMatch.name}
                        </p>
                    )}
                </div>
            )}

            {/* Prediction split from the app audience */}
            <div className="border border-slate-100 dark:border-slate-800 rounded p-3">
                <div className="flex items-center justify-between mb-2">
                    <p className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                        App Predictions
                    </p>
                    <span className="text-[10px] text-slate-400 font-medium">
                        {totalPredictions} {totalPredictions === 1 ? "vote" : "votes"}
                    </span>
                </div>
                <Progress
                    percent={100}
                    success={{ percent: teamAProbability, strokeColor: "#006666" }}
                    strokeColor="#f59e0b"
                    showInfo={false}
                    size="small"
                />
                <div className="flex justify-between mt-1">
                    <span className="text-[10px] font-semibold text-[#006666] dark:text-teal-400 truncate max-w-[45%]">
                        {match.teamA?.name} · {teamAProbability}% ({teamAVotes})
                    </span>
                    <span className="text-[10px] font-semibold text-amber-600 truncate max-w-[45%] text-right">
                        {match.teamB?.name} · {100 - teamAProbability}% ({teamBVotes})
                    </span>
                </div>
            </div>
        </div>
    );
};

const Fact = ({ label, value }) => (
    <div className="border border-slate-100 dark:border-slate-800 rounded p-3">
        <p className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">{label}</p>
        <div className="text-[12px] font-semibold text-slate-800 dark:text-slate-100 mt-1 break-words">{value}</div>
    </div>
);

export default Scorecard;
