"use client";
import { Pagination, Table, Tag, Tooltip } from "antd";
import React, { useState } from "react";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { FaEye } from "react-icons/fa";
import Loading from "@/animations/homePageLoader";
import { useMutation, useQueryClient } from "react-query";
import { toast } from "react-toastify";
import { CustomPopover } from "@/components/popHover";
import { timestampToDate } from "@/utils/date";
import { UPDATE_REPORT_STATUS } from "@/app/api/admin/reports";
import { popoverContent } from "@/components/popHover/popHoverContent";
import ViewModal from "./ViewModal";
import ConfirmModal from "@/components/shared/ConfirmModal";

function ReportsTable({ reportsList, onChange, setFilters }) {
    const queryClient = useQueryClient();
    const [viewModal, setViewModal] = useState({ open: false, data: null });
    const [confirmModal, setConfirmModal] = useState({
        isOpen: false,
        title: "",
        description: "",
        onConfirm: null,
        variant: "primary",
        confirmText: "Confirm",
        cancelText: "Cancel"
    });

    const closeConfirmModal = () => {
        setConfirmModal((prev) => ({ ...prev, isOpen: false }));
    };

    // Status mutation (REVIEWED / RESOLVED)
    const statusMutation = useMutation({
        mutationFn: UPDATE_REPORT_STATUS,
        onSuccess: (data) => {
            queryClient.invalidateQueries(["reportsList"]);
            queryClient.invalidateQueries("reportStatusCounts");
            toast.success(data?.message || "Status updated successfully");
            closeConfirmModal();
        },
        onError: (error) => {
            toast.error(error?.response?.data?.message || "Failed to update status");
            closeConfirmModal();
        },
    });

    const handleUpdateStatus = (data, newStatus) => {
        setConfirmModal({
            isOpen: true,
            title: `Update Report Status`,
            description: `Are you sure you want to mark this report as ${newStatus}?`,
            confirmText: 'Yes, Update',
            cancelText: 'Cancel',
            variant: 'primary',
            onConfirm: () => statusMutation.mutate({ _id: data._id, status: newStatus })
        });
    };

    const handleSorting = (pagination, filters, sorter) => {
        setFilters(prev => ({
            ...prev,
            sortingKey: sorter.field,
            sortOrder: sorter.order === "ascend" ? 1 : -1
        }));
    };

    const actionMenu = [
        {
            heading: "View",
            icon: <FaEye size={16} />,
            handleFunction: (record) => setViewModal({ open: true, data: record }),
        },
        {
            heading: "Mark Reviewed",
            icon: <span style={{ color: '#2563eb', fontWeight: 700, fontSize: 13 }}>R</span>,
            handleFunction: (record) => handleUpdateStatus(record, 'REVIEWED'),
        },
        {
            heading: "Mark Resolved",
            icon: <span style={{ color: '#16a34a', fontWeight: 700, fontSize: 13 }}>✓</span>,
            handleFunction: (record) => handleUpdateStatus(record, 'RESOLVED'),
        },
        {
            heading: "Mark Pending",
            icon: <span style={{ color: '#ea580c', fontWeight: 700, fontSize: 13 }}>P</span>,
            handleFunction: (record) => handleUpdateStatus(record, 'PENDING'),
        },
    ];

    const columns = [
        {
            title: "Reporter",
            dataIndex: "reporter",
            key: "reporter",
            width: 200,
            render: (reporter) => (
                <div className="capitalize overflow-hidden whitespace-nowrap text-ellipsis">
                    {reporter ? `${reporter.firstName} ${reporter.lastName}` : "Anonymous"}
                    <div className="text-[10px] text-gray-500">{reporter?.phone || "-"}</div>
                </div>
            ),
        },
        {
            title: "Target Type",
            dataIndex: "targetType",
            key: "targetType",
            width: 120,
            align: "center",
            render: (type) => (
                <Tag color={type === 'BUSINESS' ? 'blue' : type === 'PLACE' ? 'green' : 'orange'}>
                    {type}
                </Tag>
            ),
        },
        {
            title: "Reason",
            dataIndex: "reason",
            key: "reason",
            width: 200,
            render: (reason) => (
                <Tooltip title={reason} placement="topLeft">
                    <div className="overflow-hidden whitespace-nowrap text-ellipsis cursor-pointer">
                        {reason}
                    </div>
                </Tooltip>
            ),
        },
        {
            title: "Description",
            dataIndex: "description",
            key: "description",
            width: 300,
            render: (desc) => (
                <Tooltip title={desc} placement="topLeft">
                    <div className="overflow-hidden whitespace-nowrap text-ellipsis cursor-pointer">
                        {desc || "-"}
                    </div>
                </Tooltip>
            ),
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            align: "center",
            width: 120,
            render: (status) => {
                const colorMap = {
                    RESOLVED: "success",
                    REVIEWED: "processing",
                    PENDING: "warning",
                };
                return (
                    <Tag color={colorMap[status] || "default"}>
                        {status || "PENDING"}
                    </Tag>
                );
            },
        },
        {
            title: "Created At",
            dataIndex: "createdAt",
            key: "createdAt",
            width: 150,
            render: (text) => <div className="whitespace-nowrap">{timestampToDate(text)}</div>,
        },
        {
            title: "Actions",
            key: "actions",
            width: 80,
            align: "center",
            render: (record) => (
                <div className="flex items-center justify-center">
                    <CustomPopover
                        triggerContent={
                            <HiOutlineDotsHorizontal
                                size={28}
                                className="hover:text-secondary cursor-pointer"
                            />
                        }
                        popoverContent={() => popoverContent(actionMenu, record)}
                    />
                </div>
            ),
        }
    ];

    return (
        <>
            <Table
                rowKey="_id"
                className="antd-table-custom rounded"
                size="small"
                tableLayout="fixed"
                bordered
                scroll={{ x: 1200 }}
                loading={{
                    spinning: reportsList?.status === "loading",
                    indicator: <Loading />,
                }}
                columns={columns}
                dataSource={reportsList?.data?.data}
                pagination={false}
                onChange={handleSorting}
            />

            <Pagination
                className="flex justify-end mt-4"
                pageSize={reportsList?.data?.pagination?.itemsPerPage}
                total={reportsList?.data?.pagination?.totalItems}
                current={reportsList?.data?.pagination?.currentPage}
                onChange={(page) => onChange({ currentPage: Number(page) })}
            />

            <ViewModal viewModal={viewModal} setViewModal={setViewModal} />

            <ConfirmModal
                isOpen={confirmModal.isOpen}
                onClose={closeConfirmModal}
                onConfirm={confirmModal.onConfirm}
                title={confirmModal.title}
                description={confirmModal.description}
                confirmText={confirmModal.confirmText}
                cancelText={confirmModal.cancelText}
                variant={confirmModal.variant}
                loading={statusMutation.isLoading}
            />
        </>
    );
}

export default ReportsTable;
