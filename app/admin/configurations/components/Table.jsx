"use client";

import React, { useState } from "react";
import { Table, Tooltip, Switch } from "antd";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { FaEdit, FaTrash, FaEye } from "react-icons/fa";
import { useMutation, useQueryClient } from "react-query";
import { toast } from "react-toastify";
import { CustomPopover } from "@/components/popHover";
import { popoverContent } from "@/components/popHover/popHoverContent";
import ConfirmModal from "@/components/shared/ConfirmModal";
import Loading from "@/animations/homePageLoader";
import { DELETE_CONFIGURATION, UPDATE_CONFIGURATION } from "@/app/api/admin/configurations";

function ConfigurationsTable({ modal, setModal, configurationsList, filters, onChange }) {
    const queryClient = useQueryClient();
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

    const updateStatus = useMutation({
        mutationFn: UPDATE_CONFIGURATION,
        onSuccess: (data) => {
            toast.success(data?.message || "Status updated successfully");
            queryClient.invalidateQueries("configurationsList");
            closeConfirmModal();
        },
        onError: (error) => {
            toast.error(error?.response?.data?.message || "Something went wrong");
            closeConfirmModal();
        },
    });

    const deleteConfig = useMutation({
        mutationFn: (id) => DELETE_CONFIGURATION(id),
        onSuccess: (data) => {
            toast.success(data?.message || "Deleted successfully");
            queryClient.invalidateQueries("configurationsList");
            closeConfirmModal();
        },
        onError: (error) => {
            toast.error(error?.response?.data?.message || "Something went wrong");
            closeConfirmModal();
        },
    });

    const handleStatusChange = (record) => {
        setConfirmModal({
            isOpen: true,
            title: 'Confirm Status Change',
            description: `Are you sure you want to ${record.isActive ? 'deactivate' : 'activate'} this configuration?`,
            confirmText: 'Yes, Change',
            cancelText: 'No, Keep',
            variant: 'primary',
            onConfirm: () => updateStatus.mutate({ _id: record._id, isActive: !record.isActive })
        });
    };

    const handleDelete = (record) => {
        setConfirmModal({
            isOpen: true,
            title: 'Confirm Deletion',
            description: 'Are you sure you want to delete this configuration? This action cannot be undone.',
            confirmText: 'Yes, Delete',
            cancelText: 'Cancel',
            variant: 'danger',
            onConfirm: () => deleteConfig.mutate(record._id)
        });
    };

    const actionMenu = [
        {
            heading: "View",
            icon: <FaEye size={16} />,
            handleFunction: (record) => setModal({
                name: "View",
                data: record,
                state: true
            }),
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
            title: "Type",
            dataIndex: "type",
            key: "type",
            width: 150,
            render: (type) => <span className="font-bold">{type}</span>,
        },
        {
            title: "Data (JSON)",
            dataIndex: "data",
            key: "data",
            render: (data) => (
                <Tooltip title={<pre className="text-xs">{JSON.stringify(data, null, 2)}</pre>}>
                    <div className="max-w-[400px] overflow-hidden whitespace-nowrap text-ellipsis italic font-mono text-gray-500">
                        {JSON.stringify(data)}
                    </div>
                </Tooltip>
            ),
        },
        {
            title: "Status",
            dataIndex: "isActive",
            key: "isActive",
            width: 100,
            align: "center",
            render: (isActive, record) => (
                <Switch
                    checked={isActive}
                    onChange={() => handleStatusChange(record)}
                    loading={updateStatus.isLoading && updateStatus.variables?._id === record._id}
                />
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
                        popoverContent={() => popoverContent(actionMenu, record)}
                    />
                </div>
            ),
        }
    ];

    const handleTableChange = (pagination, filters, sorter) => {
        onChange({
            sortOrder: sorter.order === "descend" ? -1 : 1,
            sortingKey: sorter.field || "_id",
        });
    };

    return (
        <>
            <Table
                columns={columns}
                dataSource={configurationsList?.data?.data || []}
                loading={{
                    spinning: configurationsList.isLoading,
                    indicator: <Loading />,
                }}
                rowKey="_id"
                pagination={false}
                onChange={handleTableChange}
                className="antd-table-custom rounded"
                size="small"
                bordered
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
                loading={updateStatus.isLoading || deleteConfig.isLoading}
            />
        </>
    );
}

export default ConfigurationsTable;
