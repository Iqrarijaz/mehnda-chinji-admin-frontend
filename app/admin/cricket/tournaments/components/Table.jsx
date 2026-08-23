"use client";
import React from "react";
import { Table, Tag, Button, Dropdown, Avatar, Image, Tooltip } from "antd";
import { EditOutlined, DeleteOutlined, EyeOutlined, EllipsisOutlined } from "@ant-design/icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

import ConfirmModal from "@/components/shared/ConfirmModal";
import { TableSkeleton } from "@/components/shared/Skeletons";
import EmptyState from "@/components/shared/EmptyState";
import { FaTrophy } from "react-icons/fa6";
import { DELETE_CRICKET_TOURNAMENT } from "@/app/api/admin/cricket";
import { timestampToDate } from "@/utils/date";
import { ADMIN_KEYS } from "@/constants/queryKeys";
import { STATUS_COLORS, STATUS_LABELS } from "@/constants/cricket";

const TournamentsTable = React.memo(({ tournamentsList, setModal, onChange, visibleColumns = [] }) => {
    const queryClient = useQueryClient();
    const router = useRouter();
    const [confirmModal, setConfirmModal] = React.useState({
        state: false, onConfirm: null, title: "", content: ""
    });

    const closeConfirm = () => setConfirmModal({ state: false, onConfirm: null, title: "", content: "" });

    const openDetail = React.useCallback(
        (id) => router.push(`/admin/cricket/tournaments/detail?id=${id}`),
        [router]
    );

    const handlePagination = React.useCallback((pagination) => {
        onChange({ page: pagination.current, limit: pagination.pageSize });
    }, [onChange]);

    const handleDelete = useMutation({
        mutationKey: ["deleteCricketTournament"],
        mutationFn: (id) => DELETE_CRICKET_TOURNAMENT(id),
        onSuccess: (data) => {
            toast.success(data?.message || "Tournament deleted successfully");
            queryClient.invalidateQueries({ queryKey: [ADMIN_KEYS.CRICKET.TOURNAMENTS] });
            queryClient.invalidateQueries({ queryKey: [ADMIN_KEYS.CRICKET.TOURNAMENT_COUNTS] });
            queryClient.invalidateQueries({ queryKey: [ADMIN_KEYS.CRICKET.MATCHES] });
            closeConfirm();
        },
        onError: (error) => {
            toast.error(error?.errorMessage || "Something went wrong");
        }
    });

    const actionMenu = React.useMemo(() => (record) => ({
        items: [
            {
                key: "view",
                label: <span className="font-medium text-slate-700 dark:text-slate-300">Manage Tournament</span>,
                icon: <EyeOutlined className="text-teal-600 dark:text-teal-400" />,
                onClick: () => openDetail(record._id),
                className: "!rounded hover:!bg-teal-50 dark:hover:!bg-teal-900/20 transition-colors"
            },
            {
                key: "edit",
                label: <span className="font-medium text-slate-700 dark:text-slate-300">Edit Settings</span>,
                icon: <EditOutlined className="text-[#006666] dark:text-teal-500" />,
                onClick: () => setModal({ name: "EditTournament", data: record, state: true }),
                className: "!rounded hover:!bg-blue-50 dark:hover:!bg-blue-900/20 transition-colors"
            },
            { type: "divider", className: "!my-1" },
            {
                key: "delete",
                label: <span className="font-medium text-red-600 dark:text-red-500">Delete Tournament</span>,
                icon: <DeleteOutlined className="text-red-500 dark:text-red-400" />,
                onClick: () => setConfirmModal({
                    state: true,
                    title: "Delete Tournament",
                    content: `Delete "${record.name}"? Its fixtures are removed from the app feed along with it.`,
                    onConfirm: () => handleDelete.mutate(record._id)
                }),
                className: "!rounded hover:!bg-red-50 dark:hover:!bg-red-900/20 transition-colors"
            }
        ],
        className: "!rounded !p-2 !min-w-[180px] border border-slate-100 dark:border-slate-800 dark:bg-slate-900 transition-colors"
    }), [setModal, handleDelete, openDetail]);

    const columns = React.useMemo(() => [
        {
            title: "Tournament",
            key: "tournament",
            render: (_, record) => (
                <div className="flex items-center gap-3">
                    {record.bannerImage ? (
                        <Image
                            src={record.bannerImage}
                            alt={record.name}
                            width={40}
                            height={40}
                            className="rounded-md object-cover border border-slate-100"
                            preview={false}
                        />
                    ) : (
                        <Avatar shape="square" size={40} className="!bg-teal-50 !text-[#006666]">
                            <FaTrophy size={16} />
                        </Avatar>
                    )}
                    <div className="flex flex-col min-w-0">
                        <button
                            onClick={() => openDetail(record._id)}
                            className="font-bold text-slate-800 dark:text-slate-100 text-[11px] truncate leading-tight capitalize text-left hover:text-[#006666] dark:hover:text-teal-400 transition-colors"
                        >
                            {record.name}
                        </button>
                        <span className="text-[9px] text-slate-400 dark:text-slate-500 font-medium">
                            {record.venue}
                        </span>
                    </div>
                </div>
            )
        },
        {
            title: "City",
            dataIndex: "city",
            key: "city",
            render: (city) => (
                <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium capitalize">{city || "—"}</span>
            )
        },
        {
            title: "Format",
            key: "format",
            render: (_, record) => (
                <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300">{record.format}</span>
                    <span className="text-[9px] text-slate-400 dark:text-slate-500 font-medium">
                        {record.defaultMaxOvers} overs
                    </span>
                </div>
            )
        },
        {
            title: "Teams",
            dataIndex: "teamsCount",
            key: "teamsCount",
            align: "center",
            render: (count) => (
                <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300">{count ?? 0}</span>
            )
        },
        {
            title: "Fixtures",
            dataIndex: "matchesCount",
            key: "matchesCount",
            align: "center",
            render: (count) => (
                <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300">{count ?? 0}</span>
            )
        },
        {
            title: "Schedule",
            key: "schedule",
            render: (_, record) => (
                <div className="flex flex-col">
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium whitespace-nowrap">
                        {timestampToDate(record.startDate)}
                    </span>
                    <span className="text-[9px] text-slate-400 dark:text-slate-500 font-medium whitespace-nowrap">
                        {record.endDate ? `to ${timestampToDate(record.endDate)}` : "open ended"}
                    </span>
                </div>
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
            title: "Prizes",
            key: "prizes",
            render: (_, record) => (
                <Tooltip
                    title={
                        <div className="text-[11px] space-y-0.5">
                            <div>Winner: {record.prizes?.winnerPrize || "—"}</div>
                            <div>Runner-up: {record.prizes?.runnerUpPrize || "—"}</div>
                            {record.prizes?.manOfTheSeriesPrize && <div>Man of the Series: {record.prizes.manOfTheSeriesPrize}</div>}
                            {record.prizes?.bestBowlerPrize && <div>Best Bowler: {record.prizes.bestBowlerPrize}</div>}
                        </div>
                    }
                >
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium truncate max-w-[140px] block cursor-help">
                        {record.prizes?.winnerPrize || "—"}
                    </span>
                </Tooltip>
            )
        },
        {
            title: "Created At",
            dataIndex: "createdAt",
            key: "createdAt",
            render: (date) => (
                <div className="text-[10px] text-slate-400 dark:text-slate-500 font-medium whitespace-nowrap">
                    {timestampToDate(date)}
                </div>
            )
        },
        {
            title: "Actions",
            key: "actions",
            align: "center",
            width: 80,
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
    ], [actionMenu, openDetail]);

    const activeColumns = React.useMemo(
        () => columns.filter((col) => col.key === "actions" || visibleColumns.includes(col.key)),
        [columns, visibleColumns]
    );

    const { docs = [], totalDocs = 0, limit = 20, page = 1 } = tournamentsList?.data?.data || {};

    if (!tournamentsList?.isLoading && docs.length === 0) {
        return (
            <EmptyState
                icon={<FaTrophy className="w-10 h-10 text-teal-100" />}
                title="No tournaments found"
                description="No cricket tournaments match your current filters. Adjust the filters or create the first one."
                actionTitle="Create Tournament"
                onAction={() => setModal({ name: "AddTournament", data: null, state: true })}
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
                    spinning: tournamentsList?.isLoading,
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

TournamentsTable.displayName = "TournamentsTable";

export default TournamentsTable;
