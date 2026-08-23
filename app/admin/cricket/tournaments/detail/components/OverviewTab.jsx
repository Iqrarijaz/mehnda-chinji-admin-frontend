"use client";
import React from "react";
import { Table, Tag, Avatar, Empty } from "antd";
import { FaTrophy } from "react-icons/fa6";

import { STATUS_COLORS, STATUS_LABELS } from "@/constants/cricket";

/**
 * Overview & Standings.
 *
 * The points table is derived server-side by the scoring engine and lives on
 * each team's `stats`, so this tab only sorts and renders it — points first,
 * then net run rate, which is how a cricket ladder is ordered.
 */

const InfoCell = ({ label, value }) => (
    <div className="flex flex-col gap-0.5">
        <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">{label}</span>
        <span className="text-[12px] font-semibold text-slate-800 dark:text-slate-200 break-words">{value || "—"}</span>
    </div>
);

const OverviewTab = ({ tournament, matches = [] }) => {
    const standings = React.useMemo(() => {
        const teams = [...(tournament.teams || [])];
        return teams
            .map((team) => ({ ...team, stats: team.stats || {} }))
            .sort((a, b) => {
                const points = (b.stats.points || 0) - (a.stats.points || 0);
                if (points !== 0) return points;
                return (b.stats.netRunRate || 0) - (a.stats.netRunRate || 0);
            });
    }, [tournament.teams]);

    const liveCount = matches.filter((m) => m.status === "LIVE").length;
    const completedCount = matches.filter((m) => m.status === "COMPLETED").length;

    const columns = [
        {
            title: "#",
            key: "position",
            width: 48,
            align: "center",
            render: (_, __, index) => (
                <span className="text-[11px] font-bold text-slate-400">{index + 1}</span>
            )
        },
        {
            title: "Team",
            key: "team",
            render: (_, record) => (
                <div className="flex items-center gap-2">
                    {record.logo ? (
                        <Avatar src={record.logo} size={28} shape="square" className="border border-slate-100" />
                    ) : (
                        <Avatar shape="square" size={28} className="!bg-teal-50 !text-[#006666] !text-[10px] !font-bold">
                            {record.shortName}
                        </Avatar>
                    )}
                    <div className="flex flex-col">
                        <span className="text-[11px] font-bold text-slate-800 dark:text-slate-100 capitalize">{record.name}</span>
                        <span className="text-[9px] text-slate-400 font-medium">{record.shortName}</span>
                    </div>
                </div>
            )
        },
        { title: "P", key: "played", align: "center", render: (_, r) => <Stat value={r.stats.played} /> },
        { title: "W", key: "won", align: "center", render: (_, r) => <Stat value={r.stats.won} /> },
        { title: "L", key: "lost", align: "center", render: (_, r) => <Stat value={r.stats.lost} /> },
        { title: "T", key: "tied", align: "center", render: (_, r) => <Stat value={r.stats.tied} /> },
        { title: "NR", key: "noResult", align: "center", render: (_, r) => <Stat value={r.stats.noResult} /> },
        {
            title: "Pts",
            key: "points",
            align: "center",
            render: (_, r) => (
                <span className="text-[11px] font-bold text-[#006666] dark:text-teal-400">{r.stats.points || 0}</span>
            )
        },
        {
            title: "NRR",
            key: "nrr",
            align: "center",
            render: (_, r) => {
                const nrr = Number(r.stats.netRunRate || 0);
                return (
                    <span className={`text-[11px] font-bold ${nrr > 0 ? "text-green-600" : nrr < 0 ? "text-red-500" : "text-slate-500"}`}>
                        {nrr > 0 ? "+" : ""}{nrr.toFixed(3)}
                    </span>
                );
            }
        }
    ];

    return (
        <div className="space-y-5">
            {/* Summary strip */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <SummaryCard label="Teams" value={tournament.teams?.length || 0} />
                <SummaryCard label="Fixtures" value={matches.length} />
                <SummaryCard label="Live Now" value={liveCount} accent={liveCount > 0} />
                <SummaryCard label="Completed" value={completedCount} />
            </div>

            {/* Tournament facts */}
            <section className="border border-slate-100 dark:border-slate-800 rounded p-4">
                <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3">
                    Tournament Details
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <InfoCell label="City" value={tournament.city} />
                    <InfoCell label="Venue" value={tournament.venue} />
                    <InfoCell label="Format" value={`${tournament.format} · ${tournament.defaultMaxOvers} overs`} />
                    <InfoCell
                        label="Status"
                        value={
                            <Tag color={STATUS_COLORS[tournament.status]?.tag || "default"} className="!text-[9px] !font-bold !uppercase !rounded">
                                {STATUS_LABELS[tournament.status] || tournament.status}
                            </Tag>
                        }
                    />
                    <InfoCell label="Winner Prize" value={tournament.prizes?.winnerPrize} />
                    <InfoCell label="Runner-up Prize" value={tournament.prizes?.runnerUpPrize} />
                    <InfoCell label="Man of the Series" value={tournament.prizes?.manOfTheSeriesPrize} />
                    <InfoCell label="Best Bowler" value={tournament.prizes?.bestBowlerPrize} />
                </div>
            </section>

            {/* Organisers & guests */}
            {(tournament.organizers?.length > 0 || tournament.guests?.length > 0) && (
                <section className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {tournament.organizers?.length > 0 && (
                        <div className="border border-slate-100 dark:border-slate-800 rounded p-4">
                            <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3">Organizers</p>
                            <div className="space-y-2">
                                {tournament.organizers.map((person) => (
                                    <PersonRow key={person._id || person.name} person={person} subtitle={person.role} />
                                ))}
                            </div>
                        </div>
                    )}
                    {tournament.guests?.length > 0 && (
                        <div className="border border-slate-100 dark:border-slate-800 rounded p-4">
                            <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3">Guests</p>
                            <div className="space-y-2">
                                {tournament.guests.map((person) => (
                                    <PersonRow key={person._id || person.name} person={person} subtitle={person.title} />
                                ))}
                            </div>
                        </div>
                    )}
                </section>
            )}

            {/* Standings */}
            <section>
                <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2">
                    Points Table
                </p>
                {standings.length === 0 ? (
                    <Empty
                        image={<FaTrophy className="w-8 h-8 text-teal-100 mx-auto" />}
                        description={<span className="text-[12px] text-slate-500">Register teams to build the points table.</span>}
                    />
                ) : (
                    <div className="place-holder-table modern-table overflow-hidden">
                        <Table
                            dataSource={standings}
                            columns={columns}
                            rowKey="_id"
                            pagination={false}
                            size="small"
                            className="custom-ant-table"
                            scroll={{ x: "max-content" }}
                        />
                    </div>
                )}
            </section>
        </div>
    );
};

const Stat = ({ value }) => (
    <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-300">{value || 0}</span>
);

const SummaryCard = ({ label, value, accent = false }) => (
    <div className={`border rounded p-3 ${accent ? "border-green-200 bg-green-50/50 dark:bg-green-950/10 dark:border-green-900/30" : "border-slate-100 dark:border-slate-800"}`}>
        <p className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">{label}</p>
        <p className={`text-xl font-bold mt-0.5 ${accent ? "text-green-600" : "text-slate-800 dark:text-slate-100"}`}>{value}</p>
    </div>
);

const PersonRow = ({ person, subtitle }) => (
    <div className="flex items-center gap-2">
        <Avatar src={person.image || undefined} size={26} className="!bg-slate-100 !text-slate-500 !text-[10px]">
            {person.name?.[0]?.toUpperCase()}
        </Avatar>
        <div className="flex flex-col min-w-0">
            <span className="text-[11px] font-semibold text-slate-800 dark:text-slate-200 capitalize truncate">{person.name}</span>
            <span className="text-[9px] text-slate-400 font-medium truncate">{subtitle}{person.phone ? ` · ${person.phone}` : ""}</span>
        </div>
    </div>
);

export default OverviewTab;
