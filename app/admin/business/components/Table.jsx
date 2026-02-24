"use client";
import { Table, Pagination, Tooltip } from "antd";
import React, { useState } from "react";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { FaEdit, FaTrash, FaCheck, FaTimes } from "react-icons/fa";
import Loading from "@/animations/homePageLoader";
import { useMutation, useQueryClient } from "react-query";
import { toast } from "react-toastify";
import { CustomPopover } from "@/components/popHover";
import { timestampToDate } from "@/utils/date";
import { DELETE_BUSINESS, UPDATE_BUSINESS_STATUS } from "@/app/api/admin/business";
import { popoverContent } from "@/components/popHover/popHoverContent";
import ConfirmModal from "@/components/shared/ConfirmModal";
import { getTagColor } from "@/utils/tagColor";

function BusinessTable({ modal, setModal, businessList, onChange }) {
    const queryClient = useQueryClient();

    const [confirmModal, setConfirmModal] = useState({
        isOpen: false,
        title: "",
        description: "",
        onConfirm: null,
        variant: "primary",
        confirmText: "Confirm",
        cancelText: "Cancel",
    });

    const closeConfirmModal = () =>
        setConfirmModal((prev) => ({ ...prev, isOpen: false }));

    const statusMutation = useMutation({
        mutationFn: UPDATE_BUSINESS_STATUS,
        onSuccess: (data) => {
            queryClient.invalidateQueries("businessList");
            toast.success(data?.message || "Status updated");
            closeConfirmModal();
        },
        onError: (error) => {
            toast.error(error?.response?.data?.message || "Failed to update status");
            closeConfirmModal();
        },
    });

    const deleteMutation = useMutation({
        mutationFn: DELETE_BUSINESS,
        onSuccess: (data) => {
            queryClient.invalidateQueries("businessList");
            toast.success(data?.message || "Business deleted");
            closeConfirmModal();
        },
        onError: (error) => {
            toast.error(error?.response?.data?.message || "Failed to delete");
            closeConfirmModal();
        },
    });

    const handleStatusChange = (record, newStatus) => {
        setConfirmModal({
            isOpen: true,
            title: `Set Status to ${newStatus}`,
            description: `Are you sure you want to ${newStatus.toLowerCase()} "${record.name}"?`,
            confirmText: "Yes, Confirm",
            cancelText: "Cancel",
            variant: newStatus === "REJECTED" ? "danger" : "primary",
            onConfirm: () =>
                statusMutation.mutate({ _id: record._id, status: newStatus }),
        });
    };

    const handleDelete = (record) => {
        setConfirmModal({
            isOpen: true,
            title: "Confirm Deletion",
            description: `Are you sure you want to delete "${record.name}"? This action cannot be undone.`,
            confirmText: "Yes, Delete",
            cancelText: "Cancel",
            variant: "danger",
            onConfirm: () => deleteMutation.mutate({ _id: record._id }),
        });
    };

    const getActionMenu = (record) => {
        const menu = [
            {
                heading: "Edit",
                icon: <FaEdit size={16} />,
                handleFunction: (r) =>
                    setModal({ name: "Update", data: r, state: true }),
            },
        ];

        // Approve: show when PENDING or REJECTED
        if (record.status === "PENDING" || record.status === "REJECTED") {
            menu.push({
                heading: "Approve",
                icon: <FaCheck size={16} />,
                handleFunction: (r) => handleStatusChange(r, "APPROVED"),
            });
        }

        // Reject: show when PENDING or APPROVED
        if (record.status === "PENDING" || record.status === "APPROVED") {
            menu.push({
                heading: "Reject",
                icon: <FaTimes size={16} />,
                handleFunction: (r) => handleStatusChange(r, "REJECTED"),
            });
        }

        menu.push({
            heading: "Delete",
            icon: <FaTrash size={16} />,
            handleFunction: (r) => handleDelete(r),
        });

        return menu;
    };

    const columns = [
        {
            title: "Business Name",
            dataIndex: "name",
            key: "name",
            width: 160,
            render: (text) => (
                <div className="font-semibold capitalize truncate">{text}</div>
            ),
        },
        {
            title: "Category",
            dataIndex: "categoryEn",
            key: "categoryEn",
            width: 120,
            render: (val) => (
                <div className="capitalize truncate text-gray-600">{val || "—"}</div>
            ),
        },
        {
            title: "Phone",
            dataIndex: "phone",
            key: "phone",
            width: 110,
            render: (val) => val || "—",
        },
        {
            title: "Address",
            dataIndex: "address",
            key: "address",
            width: 180,
            render: (val) => (
                <Tooltip title={val}>
                    <div className="capitalize truncate max-w-[170px]">{val || "—"}</div>
                </Tooltip>
            ),
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            align: "center",
            width: 100,
            render: (status) => {
                const colorMap = {
                    APPROVED: "#16a34a",
                    REJECTED: "#dc2626",
                    PENDING: "#ea580c",
                };
                return (
                    <span
                        className="mr-0 text-[10px] px-2 py-1 rounded capitalize font-semibold text-white"
                        style={{ backgroundColor: colorMap[status] || "#6b7280" }}
                    >
                        {status}
                    </span>
                );
            },
        },
        {
            title: "Registered",
            dataIndex: "createdAt",
            key: "createdAt",
            width: 110,
            render: (text) => (
                <div className="whitespace-nowrap">{timestampToDate(text)}</div>
            ),
        },
        {
            title: "Actions",
            key: "actions",
            width: 70,
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
                        popoverContent={() => popoverContent(getActionMenu(record), record)}
                    />
                </div>
            ),
        },
    ];

    return (
        <>
            <Table
                rowKey="_id"
                className="antd-table-custom rounded"
                size="small"
                tableLayout="fixed"
                bordered
                scroll={{ x: 1100 }}
                loading={{
                    spinning: businessList?.status === "loading",
                    indicator: <Loading />,
                }}
                columns={columns}
                dataSource={businessList?.data?.data}
                pagination={false}
            />

            <Pagination
                className="flex justify-end mt-4"
                pageSize={businessList?.data?.pagination?.itemsPerPage}
                total={businessList?.data?.pagination?.totalItems}
                current={businessList?.data?.pagination?.currentPage}
                onChange={(page) => onChange({ currentPage: Number(page) })}
            />

            <ConfirmModal
                isOpen={confirmModal.isOpen}
                onClose={closeConfirmModal}
                onConfirm={confirmModal.onConfirm}
                title={confirmModal.title}
                description={confirmModal.description}
                confirmText={confirmModal.confirmText}
                cancelText={confirmModal.cancelText}
                variant={confirmModal.variant}
                loading={statusMutation.isLoading || deleteMutation.isLoading}
            />
        </>
    );
}

export default BusinessTable;
