"use client";
import React from "react";
import { Table, Tag, Button, Dropdown, Avatar } from "antd";
import { EditOutlined, DeleteOutlined, EllipsisOutlined, DashboardOutlined, EyeOutlined } from "@ant-design/icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { GiCoinflip } from "react-icons/gi";
import { FaRegCalendarCheck } from "react-icons/fa6";

import ConfirmModal from "@/components/shared/ConfirmModal";
import { TableSkeleton } from "@/components/shared/Skeletons";
import EmptyState from "@/components/shared/EmptyState";
import { DELETE_CRICKET_MATCH } from "@/app/api/admin/cricket";
import { ADMIN_KEYS } from "@/constants/queryKeys";
import { timestampToDateWithTime } from "@/utils/date";
import { STATUS_COLORS, STATUS_LABELS, STAGE_LABELS, formatInningsScore } from "@/constants/cricket";

const MatchesTable = React.memo(({ matchesList, setModal, onChange, visibleColumns = [] }) => {
    const queryClient = useQueryClient();
    const router = useRouter();
    const [confirmModal, setConfirmModal] = React.useState({ state: false, onConfirm: null, title: "", content: "" });

    const closeConfirm = () => setConfirmModal({ state: false, onConfirm: null, title: "", content: "" });

    const openMatch = React.useCallback(
        (id) => router.push(`/admin/cricket/matches/detail?id=${id}`),
        [router]
    );

    const handlePagination = React.useCallback((pagination) => {
        onChange({ page: pagination.current, limit: pagination.pageSize });
    }, [onChange]);

    const handleDelete = useMutation({
        mutationKey: ["deleteCricketMatchFromList"],
        mutationFn: (id) => DELETE_CRICKET_MATCH(id),
        onSuccess: (data) => {
            toast.success(data?.message || "Match deleted successfully");
            queryClient.invalidateQueries({ queryKey: [ADMIN_KEYS.CRICKET.MATCHES] });
            queryClient.invalidateQueries({ queryKey: [ADMIN_KEYS.CRICKET.MATCH_COUNTS] });
            queryClient.invalidateQueries({ queryKey: [ADMIN_KEYS.CRICKET.TOURNAMENT_DETAILS] });
            closeConfirm();
        },
        onError: (error) => {
            toast.error(error?.errorMessage || "Something went wrong");
            closeConfirm();
        }
    });

    const actionMenu = React.useMemo(() => (record) => ({
        items: [
            {
                key: "view",
                label: <span className="font-medium text-slate-700 dark:text-slate-300">View Match Details</span>,
                icon: <EyeOutlined className="text-teal-600 dark:text-teal-400" />,
                onClick: () => openMatch(record._id),
                className: "!rounded hover:!bg-teal-50 dark:hover:!bg-teal-900/20 transition-colors"
            },
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
                    onConfirm: () => handleDelete.mutate(record._id)
                }),
                className: "!rounded hover:!bg-red-50 dark:hover:!bg-red-900/20 transition-colors"
            }
        ],
        className: "!rounded !p-2 !min-w-[200px] border border-slate-100 dark:border-slate-800 dark:bg-slate-900 transition-colors"
    }), [openMatch, setModal, handleDelete]);

    const columns = React.useMemo(() => [
        {
            title: "Fixture",
            key: "fixture",
            render: (_, record) => (
                <div className="flex items-center gap-2 min-w-0">
                    <Avatar shape="square" size={32} className="!bg-teal-50 !text-[#006666] shrink-0">
                        <FaRegCalendarCheck size={13} />
                    </Avatar>
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
                </div>
            )
        },
        {
            title: "Tournament",
            key: "tournament",
            render: (_, record) => (
                <div className="flex flex-col min-w-0">
                    <span className="text-[10px] font-semibold text-slate-700 dark:text-slate-300 capitalize truncate">
                        {record.tournamentId?.name || "—"}
                    </span>
                    <span className="text-[9px] text-slate-400 font-medium truncate">
                        {record.tournamentId?.city || ""}
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
            title: "Venue",
            dataIndex: "venue",
            key: "venue",
            render: (venue) => (
                <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium truncate max-w-[140px] block">{venue}</span>
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
            title: "Toss",
            key: "toss",
            render: (_, record) => {
                if (!record.tossWinnerId) {
                    return <span className="text-[10px] text-slate-400 font-medium">Not recorded</span>;
                }
                const winner =
                    String(record.tossWinnerId) === String(record.teamA?.id) ? record.teamA?.name : record.teamB?.name;
                return (
                    <span className="text-[10px] text-slate-600 dark:text-slate-300 font-medium whitespace-nowrap">
                        {winner} · {record.tossDecision === "BAT" ? "Bat" : "Bowl"}
                    </span>
                );
            }
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
                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium max-w-[170px] truncate block" title={record.result || ""}>
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
    ], [actionMenu, openMatch]);

    const activeColumns = React.useMemo(
        () => columns.filter((col) => col.key === "actions" || visibleColumns.includes(col.key)),
        [columns, visibleColumns]
    );

    const { docs = [], totalDocs = 0, limit = 20, page = 1 } = matchesList?.data?.data || {};

    if (!matchesList?.isLoading && docs.length === 0) {
        return (
            <EmptyState
                icon={<FaRegCalendarCheck className="w-10 h-10 text-teal-100" />}
                title="No fixtures found"
                description="No matches match your current filters. Fixtures are scheduled from a tournament's Fixtures tab."
                className="my-8"
            />
        );
    }

    return (
        <div className="place-holder-table modern-table overflow-hidden">
            <Table
                dataSource={docs}
                columns={activeColumns}
                rowKey="_id"
                onChange={handlePagination}
                className="custom-ant-table"
                scroll={{ x: "max-content" }}
                loading={{
                    spinning: matchesList?.isLoading,
                    indicator: <TableSkeleton rows={8} columns={6} />
                }}
                pagination={{
                    total: totalDocs,
                    pageSize: limit,
                    current: page,
                    showSizeChanger: true,
                    pageSizeOptions: ["10", "20", "50", "100"]
                }}
            />
            {confirmModal.state && (
                <ConfirmModal
                    isOpen={confirmModal.state}
                    onClose={closeConfirm}
                    title={confirmModal.title}
                    description={confirmModal.content}
                    onConfirm={confirmModal.onConfirm}
                    loading={handleDelete.isPending}
                    variant="danger"
                />
            )}
        </div>
    );
});

MatchesTable.displayName = "MatchesTable";

export default MatchesTable;
