"use client";
import React, { useState } from "react";
import { Table, Tag, Button, Dropdown, Empty } from "antd";
import { EditOutlined, DeleteOutlined, EllipsisOutlined, PlusOutlined, DashboardOutlined } from "@ant-design/icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { GiCoinflip } from "react-icons/gi";
import { FaRegCalendarCheck } from "react-icons/fa6";

import ConfirmModal from "@/components/shared/ConfirmModal";
import CustomButton from "@/components/shared/CustomButton";
import MatchFormModal from "@/components/admin/cricket/MatchFormModal";
import TossModal from "@/components/admin/cricket/TossModal";
import { DELETE_CRICKET_MATCH } from "@/app/api/admin/cricket";
import { ADMIN_KEYS } from "@/constants/queryKeys";
import { timestampToDateWithTime } from "@/utils/date";
import { STATUS_COLORS, STATUS_LABELS, STAGE_LABELS, formatInningsScore } from "@/constants/cricket";

/**
 * Fixtures tab — schedule, correct and remove this tournament's matches.
 *
 * Deleting a completed match reverses its contribution to the standings on the
 * backend, which is why that is the supported way to unwind a played fixture.
 */
const FixturesTab = ({ tournament, matches = [] }) => {
    const queryClient = useQueryClient();
    const router = useRouter();
    const [modal, setModal] = useState({ name: null, data: null, state: false });
    const [confirmModal, setConfirmModal] = useState({ state: false, onConfirm: null, title: "", content: "" });

    const closeConfirm = () => setConfirmModal({ state: false, onConfirm: null, title: "", content: "" });

    const openMatch = React.useCallback(
        (id) => router.push(`/admin/cricket/matches/detail?id=${id}`),
        [router]
    );

    const removeMatch = useMutation({
        mutationKey: ["deleteCricketMatch"],
        mutationFn: (id) => DELETE_CRICKET_MATCH(id),
        onSuccess: (data) => {
            toast.success(data?.message || "Match deleted successfully");
            queryClient.invalidateQueries({ queryKey: [ADMIN_KEYS.CRICKET.TOURNAMENT_DETAILS, tournament._id] });
            queryClient.invalidateQueries({ queryKey: [ADMIN_KEYS.CRICKET.MATCHES] });
            queryClient.invalidateQueries({ queryKey: [ADMIN_KEYS.CRICKET.MATCH_COUNTS] });
            closeConfirm();
        },
        onError: (error) => {
            toast.error(error?.errorMessage || "Failed to delete match");
            closeConfirm();
        }
    });

    const actionMenu = React.useMemo(() => (record) => ({
        items: [
            {
                key: "scorer",
                label: <span className="font-medium text-slate-700 dark:text-slate-300">Scorer Control Panel</span>,
                icon: <DashboardOutlined className="text-teal-600 dark:text-teal-400" />,
                onClick: () => openMatch(record._id),
                className: "!rounded hover:!bg-teal-50 dark:hover:!bg-teal-900/20 transition-colors"
            },
            {
                key: "toss",
                label: <span className="font-medium text-slate-700 dark:text-slate-300">Record Toss</span>,
                icon: <GiCoinflip className="text-amber-500" />,
                onClick: () => setModal({ name: "Toss", data: record, state: true }),
                className: "!rounded hover:!bg-amber-50 dark:hover:!bg-amber-900/20 transition-colors"
            },
            {
                key: "edit",
                label: <span className="font-medium text-slate-700 dark:text-slate-300">Edit Fixture</span>,
                icon: <EditOutlined className="text-[#006666] dark:text-teal-500" />,
                onClick: () => setModal({ name: "EditMatch", data: record, state: true }),
                className: "!rounded hover:!bg-blue-50 dark:hover:!bg-blue-900/20 transition-colors"
            },
            { type: "divider", className: "!my-1" },
            {
                key: "delete",
                label: <span className="font-medium text-red-600 dark:text-red-500">Delete Fixture</span>,
                icon: <DeleteOutlined className="text-red-500 dark:text-red-400" />,
                onClick: () => setConfirmModal({
                    state: true,
                    title: "Delete Fixture",
                    content:
                        record.status === "COMPLETED"
                            ? `Delete "${record.matchTitle}"? Its points and net run rate are removed from the standings.`
                            : `Delete "${record.matchTitle}"? This cancels the fixture.`,
                    onConfirm: () => removeMatch.mutate(record._id)
                }),
                className: "!rounded hover:!bg-red-50 dark:hover:!bg-red-900/20 transition-colors"
            }
        ],
        className: "!rounded !p-2 !min-w-[190px] border border-slate-100 dark:border-slate-800 dark:bg-slate-900 transition-colors"
    }), [openMatch, removeMatch]);

    const columns = [
        {
            title: "Fixture",
            key: "fixture",
            render: (_, record) => (
                <div className="flex flex-col min-w-0">
                    <button
                        onClick={() => openMatch(record._id)}
                        className="text-[11px] font-bold text-slate-800 dark:text-slate-100 truncate text-left hover:text-[#006666] dark:hover:text-teal-400 transition-colors"
                    >
                        {record.matchTitle}
                    </button>
                    <span className="text-[9px] text-slate-400 font-medium truncate">
                        {record.teamA?.name} vs {record.teamB?.name}
                    </span>
                </div>
            )
        },
        {
            title: "Stage",
            dataIndex: "stage",
            key: "stage",
            render: (stage) => (
                <span className="text-[10px] font-semibold text-slate-600 dark:text-slate-300">
                    {STAGE_LABELS[stage] || stage}
                </span>
            )
        },
        {
            title: "Scheduled",
            dataIndex: "scheduledAt",
            key: "scheduledAt",
            render: (date) => (
                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium whitespace-nowrap">
                    {timestampToDateWithTime(date)}
                </span>
            )
        },
        {
            title: "Overs",
            dataIndex: "maxOvers",
            key: "maxOvers",
            align: "center",
            render: (overs) => <span className="text-[10px] font-semibold text-slate-600 dark:text-slate-300">{overs}</span>
        },
        {
            title: "Score",
            key: "score",
            render: (_, record) => (
                <div className="flex flex-col">
                    <span className="text-[10px] font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">
                        {formatInningsScore(record.innings1)}
                    </span>
                    <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 whitespace-nowrap">
                        {formatInningsScore(record.innings2)}
                    </span>
                </div>
            )
        },
        {
            title: "Result",
            key: "result",
            render: (_, record) => (
                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium max-w-[180px] truncate block" title={record.result || ""}>
                    {record.result || "—"}
                </span>
            )
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            render: (status) => (
                <Tag color={STATUS_COLORS[status]?.tag || "default"} className="!text-[9px] !font-bold !uppercase !rounded">
                    {STATUS_LABELS[status] || status}
                </Tag>
            )
        },
        {
            title: "Actions",
            key: "actions",
            align: "center",
            width: 70,
            fixed: "right",
            render: (_, record) => (
                <Dropdown menu={actionMenu(record)} trigger={["click"]} placement="bottomRight">
                    <Button
                        type="text"
                        icon={<EllipsisOutlined className="text-lg text-slate-500" />}
                        className="hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full"
                    />
                </Dropdown>
            )
        }
    ];

    return (
        <div className="space-y-3">
            <div className="flex justify-between items-center">
                <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                    Fixtures ({matches.length})
                </p>
                <CustomButton
                    label="Schedule Match"
                    icon={<PlusOutlined />}
                    onClick={() => setModal({ name: "AddMatch", data: null, state: true })}
                    disabled={(tournament.teams?.length || 0) < 2}
                />
            </div>

            {matches.length === 0 ? (
                <Empty
                    image={<FaRegCalendarCheck className="w-8 h-8 text-teal-100 mx-auto" />}
                    description={
                        <span className="text-[12px] text-slate-500">
                            {(tournament.teams?.length || 0) < 2
                                ? "Register at least two teams before scheduling fixtures."
                                : "No fixtures scheduled yet."}
                        </span>
                    }
                />
            ) : (
                <div className="place-holder-table modern-table overflow-hidden">
                    <Table
                        dataSource={matches}
                        columns={columns}
                        rowKey="_id"
                        pagination={false}
                        size="small"
                        className="custom-ant-table"
                        scroll={{ x: "max-content" }}
                    />
                </div>
            )}

            <MatchFormModal modal={modal} setModal={setModal} tournament={tournament} />
            <TossModal modal={modal} setModal={setModal} />

            {confirmModal.state && (
                <ConfirmModal
                    isOpen={confirmModal.state}
                    onClose={closeConfirm}
                    title={confirmModal.title}
                    description={confirmModal.content}
                    onConfirm={confirmModal.onConfirm}
                    loading={removeMatch.isPending}
                    variant="danger"
                />
            )}
        </div>
    );
};

export default FixturesTab;
