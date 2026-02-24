"use client";
import { Modal, Pagination, Table, Tag, Tooltip } from "antd";
import React, { useState } from "react";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { FaEdit, FaTrash, FaEye } from "react-icons/fa";
import Loading from "@/animations/homePageLoader";
import { Switch } from "antd";
import { useMutation, useQueryClient } from "react-query";
import { toast } from "react-toastify";
import { CustomPopover } from "@/components/popHover";
import { timestampToDate } from "@/utils/date";
import { DELETE_PLACE, UPDATE_PLACE_STATUS, UPDATE_PLACE_REQUEST_STATUS } from "@/app/api/admin/places";
import { popoverContent } from "@/components/popHover/popHoverContent";
import ViewModal from "./ViewModal";
import { getTagColor } from "@/utils/tagColor";
import ConfirmModal from "@/components/shared/ConfirmModal";

function PlacesTable({ modal, setModal, placesList, onChange, setFilters }) {
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

    // Request status mutation (APPROVED / REJECTED)
    const requestStatusMutation = useMutation({
        mutationFn: UPDATE_PLACE_REQUEST_STATUS,
        onSuccess: (data) => {
            queryClient.invalidateQueries("placesList");
            toast.success(data?.message);
            closeConfirmModal();
        },
        onError: (error) => {
            toast.error(error?.response?.data?.message || "Failed to update request status");
            closeConfirmModal();
        },
    });

    // Status mutation
    const manageStatusMutation = useMutation({
        mutationFn: UPDATE_PLACE_STATUS,
        onSuccess: (data) => {
            queryClient.invalidateQueries("placesList");
            toast.success(data?.message);
            closeConfirmModal();
        },
        onError: (error) => {
            toast.error(error?.response?.data?.message || "Failed to update status");
            closeConfirmModal();
        },
    });

    // Delete mutation
    const deleteMutation = useMutation({
        mutationFn: DELETE_PLACE,
        onSuccess: (data) => {
            queryClient.invalidateQueries("placesList");
            toast.success(data?.message);
            closeConfirmModal();
        },
        onError: (error) => {
            toast.error(error?.response?.data?.message || "Failed to delete place");
            closeConfirmModal();
        },
    });

    const handleStatus = (data) => {
        setConfirmModal({
            isOpen: true,
            title: 'Confirm Status Change',
            description: `Are you sure you want to ${data?.isActive ? 'deactivate' : 'activate'} this place?`,
            confirmText: 'Yes, Change',
            cancelText: 'No, Keep',
            variant: 'primary',
            onConfirm: () => manageStatusMutation.mutate({
                _id: data._id,
                isActive: !data.isActive
            })
        });
    };

    const handleDelete = (data) => {
        setConfirmModal({
            isOpen: true,
            title: 'Confirm Deletion',
            description: 'Are you sure you want to delete this place? This action cannot be undone.',
            confirmText: 'Yes, Delete',
            cancelText: 'Cancel',
            variant: 'danger',
            onConfirm: () => deleteMutation.mutate({
                _id: data._id,
            })
        });
    };

    const handleApprove = (data) => {
        setConfirmModal({
            isOpen: true,
            title: 'Approve Place',
            description: `Are you sure you want to approve "${data.name}"?`,
            confirmText: 'Yes, Approve',
            cancelText: 'Cancel',
            variant: 'primary',
            onConfirm: () => requestStatusMutation.mutate({ _id: data._id, status: 'APPROVED' })
        });
    };

    const handleReject = (data) => {
        setConfirmModal({
            isOpen: true,
            title: 'Reject Place',
            description: `Are you sure you want to reject "${data.name}"?`,
            confirmText: 'Yes, Reject',
            cancelText: 'Cancel',
            variant: 'danger',
            onConfirm: () => requestStatusMutation.mutate({ _id: data._id, status: 'REJECTED' })
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
            heading: "Edit",
            icon: <FaEdit size={16} />,
            handleFunction: (record) => setModal({
                name: "Update",
                data: record,
                state: true
            }),
        },
        {
            heading: "Approve",
            icon: <span style={{ color: '#16a34a', fontWeight: 700, fontSize: 13 }}>✓</span>,
            handleFunction: (record) => handleApprove(record),
        },
        {
            heading: "Reject",
            icon: <span style={{ color: '#dc2626', fontWeight: 700, fontSize: 13 }}>✕</span>,
            handleFunction: (record) => handleReject(record),
        },
        {
            heading: "Delete",
            icon: <FaTrash size={16} />,
            handleFunction: (record) => handleDelete(record),
        },
    ];

    const columns = [
        {
            title: "Name",
            dataIndex: "name",
            key: "name",
            sorter: (a, b) => a.name?.localeCompare(b.name),
            width: 250,
            render: (name) => (
                <Tooltip
                    title={name}
                    placement="topLeft"
                    overlayStyle={{ maxWidth: 300 }}
                >
                    <div className="capitalize overflow-hidden whitespace-nowrap text-ellipsis cursor-pointer">
                        {name}
                    </div>
                </Tooltip>
            ),
        },
        {
            title: "Category",
            dataIndex: "category",
            key: "category",
            width: 120,
            align: "center",
            render: (category) => (
                <span
                    className="mr-0 text-[10px] px-2 py-1 rounded capitalize font-semibold text-white"
                    style={{ backgroundColor: getTagColor(category) }}
                >
                    {category || "N/A"}
                </span>
            ),
        },
        {
            title: "Address",
            dataIndex: "address",
            key: "address",
            width: 250,
            render: (address) => (
                <Tooltip
                    title={address}
                    placement="topLeft"
                    overlayStyle={{ maxWidth: 350 }}
                >
                    <div className="overflow-hidden whitespace-nowrap text-ellipsis cursor-pointer">
                        {address || "-"}
                    </div>
                </Tooltip>
            ),
        },
        {
            title: "Contact",
            dataIndex: "contact",
            key: "contact",
            width: 150,
            render: (contact) => (
                <div className="overflow-hidden whitespace-nowrap">
                    {contact?.length > 0 ? `${contact[0].name}: ${contact[0].number}` : "-"}
                    {contact?.length > 1 && <span className="text-gray-500 ml-1">(+{contact.length - 1})</span>}
                </div>
            ),
        },
        {
            title: "Request Status",
            dataIndex: "status",
            key: "status",
            align: "center",
            width: 120,
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
                        {status || "PENDING"}
                    </span>
                );
            },
        },
        {
            title: "Active",
            dataIndex: "isActive",
            key: "isActive",
            align: "center",
            width: 80,
            render: (isActive, record) => (
                <Switch
                    checked={isActive}
                    onChange={() => handleStatus(record)}
                    className={isActive ? '' : 'ant-switch-red'}
                />
            ),
        },
        {
            title: "Created At",
            dataIndex: "createdAt",
            key: "createdAt",
            width: 120,
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
                    spinning: placesList?.status === "loading",
                    indicator: <Loading />,
                }}
                columns={columns}
                dataSource={placesList?.data?.data}
                pagination={false}
                onChange={handleSorting}
            />

            <Pagination
                className="flex justify-end mt-4"
                pageSize={placesList?.data?.pagination?.itemsPerPage}
                total={placesList?.data?.pagination?.totalItems}
                current={placesList?.data?.pagination?.currentPage}
                onChange={(page) => onChange({ currentPage: Number(page) })}
            />

            {/* View Modal */}
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
                loading={manageStatusMutation.isLoading || deleteMutation.isLoading || requestStatusMutation.isLoading}
            />
        </>
    );
}

export default PlacesTable;
