"use client";
import { Modal, Pagination, Table, Tag } from "antd";
import React, { useState } from "react";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { FaEdit, FaTrash, FaEye } from "react-icons/fa";
import Loading from "@/animations/homePageLoader";
import { Switch } from "antd";
import { useMutation, useQueryClient } from "react-query";
import { toast } from "react-toastify";
import { CustomPopover } from "@/components/popHover";
import { usePlacesContext } from "@/context/admin/places/PlacesContext";
import { timestampToDate } from "@/utils/date";
import { DELETE_PLACE, UPDATE_PLACE_STATUS } from "@/app/api/admin/places";
import { popoverContent } from "@/components/popHover/popHoverContent";
import ViewModal from "./ViewModal";
import { getTagColor } from "@/utils/tagColor";
import ConfirmModal from "@/components/shared/ConfirmModal";

function PlacesTable({ modal, setModal }) {
    const queryClient = useQueryClient();
    const { placesList, onChange, setFilters } = usePlacesContext();
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
            heading: "Delete",
            icon: <FaTrash size={16} />,
            handleFunction: (record) => handleDelete(record),
        },
    ];

    const columns = [
        {
            title: "Name (English)",
            dataIndex: "name",
            key: "name_en",
            sorter: (a, b) => a.name?.en?.localeCompare(b.name?.en),
            width: 150,
            render: (name) => (
                <div className="capitalize overflow-hidden whitespace-nowrap">
                    {name?.en}
                </div>
            ),
        },
        {
            title: "Name (Urdu)",
            dataIndex: "name",
            key: "name_ur",
            width: 150,
            align: "left",
            sorter: (a, b) => a.name?.ur?.localeCompare(b.name?.ur),
            render: (name) => (
                <div className="overflow-hidden whitespace-nowrap text-right font-notoUrdu p-2">
                    {name?.ur}
                </div>
            ),
        },
        {
            title: "Category",
            dataIndex: "categoryName",
            key: "category",
            width: 120,
            align: "center",
            render: (categoryName) => (
                <span
                    className="mr-0 text-[10px] px-2 py-1 rounded capitalize font-semibold text-white"
                    style={{ backgroundColor: getTagColor(categoryName?.en) }}
                >
                    {categoryName?.en || "N/A"}
                </span>
            ),
        },
        {
            title: "Address",
            dataIndex: "address",
            key: "address_en",
            width: 200,
            render: (address) => (
                <div className="overflow-hidden whitespace-nowrap text-ellipsis" title={address?.en}>
                    {address?.en}
                </div>
            ),
        },
        {
            title: "Phone",
            dataIndex: "phone",
            key: "phone",
            width: 120,
            render: (phone) => (
                <div className="overflow-hidden whitespace-nowrap">
                    {phone?.length > 0 ? phone[0] : "-"}
                    {phone?.length > 1 && <span className="text-gray-500 ml-1">(+{phone.length - 1})</span>}
                </div>
            ),
        },
        {
            title: "Status",
            dataIndex: "isActive",
            key: "isActive",
            align: "center",
            width: 100,
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
                loading={manageStatusMutation.isLoading || deleteMutation.isLoading}
            />
        </>
    );
}

export default PlacesTable;
