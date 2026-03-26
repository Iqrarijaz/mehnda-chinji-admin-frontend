import React, { useState } from "react";
import { Table, Tooltip, Switch, Menu, Dropdown, Button, Checkbox } from "antd";
import { TableSkeleton } from "@/components/shared/Skeletons";
import {
    EditOutlined,
    DeleteOutlined,
    EyeOutlined,
    MoreOutlined,
    SettingOutlined
} from "@ant-design/icons";
import { useMutation, useQueryClient } from "react-query";
import { toast } from "react-toastify";
import ConfirmModal from "@/components/shared/ConfirmModal";
import Loading from "@/animations/homePageLoader";
import { DELETE_CONFIGURATION, UPDATE_CONFIGURATION } from "@/app/api/admin/configurations";

function ConfigurationsTable({ modal, setModal, configurationsList, filters, onChange, visibleColumns }) {
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

    const actionMenu = (record) => ({
        items: [
            {
                key: "view",
                label: <span className="font-medium">View Config</span>,
                icon: <EyeOutlined className="text-emerald-500" />,
                onClick: () => setModal({
                    name: "View",
                    data: record,
                    state: true
                }),
                className: "!rounded hover:!bg-emerald-50",
            },
            {
                key: "edit",
                label: <span className="font-medium">Edit Config</span>,
                icon: <EditOutlined className="text-[#006666]" />,
                onClick: () => setModal({
                    name: "Update",
                    data: record,
                    state: true
                }),
                className: "!rounded hover:!bg-blue-50",
            },
            {
                type: "divider",
                className: "!my-1",
            },
            {
                key: "delete",
                label: <span className="font-medium text-red-600">Delete Config</span>,
                icon: <DeleteOutlined className="text-red-500" />,
                onClick: () => handleDelete(record),
                className: "!rounded hover:!bg-red-50",
            },
        ],
        className: "!rounded !p-2 !min-w-[150px] shadow-xl border border-slate-100",
    });

    const allColumns = [
        {
            title: "Type",
            dataIndex: "type",
            key: "type",
            width: 170,
            sorter: true,
            render: (type) => <span className="font-bold text-slate-800">{type}</span>,
        },
        {
            title: "Data (JSON)",
            dataIndex: "data",
            key: "data",
            width: 250,
            render: (data) => (
                <Tooltip title={<pre className="text-xs">{JSON.stringify(data, null, 2)}</pre>}>
                    <div className="max-w-[400px] overflow-hidden whitespace-nowrap text-ellipsis italic font-mono text-slate-500 font-medium">
                        {JSON.stringify(data)}
                    </div>
                </Tooltip>
            ),
        },
        {
            title: "Status",
            dataIndex: "isActive",
            key: "isActive",
            width: 170,
            align: "center",
            sorter: true,
            render: (isActive, record) => (
                <Switch
                    checked={isActive}
                    onChange={() => handleStatusChange(record)}
                    loading={updateStatus.isLoading && updateStatus.variables?._id === record._id}
                    className={isActive ? '!bg-[#006666]' : '!bg-slate-300'}
                    size="small"
                />
            ),
        },
        {
            title: "",
            key: "actions",
            width: 60,
            align: "right",
            render: (record) => (
                <Dropdown menu={actionMenu(record)} trigger={["click"]} placement="bottomRight">
                    <Button
                        type="text"
                        icon={<MoreOutlined className="text-lg" />}
                        className="!rounded hover:!bg-slate-100 !flex items-center justify-center !h-10 !w-10"
                    />
                </Dropdown>
            ),
        }
    ];

    const handleTableChange = (pagination, filters, sorter) => {
        onChange({
            sortOrder: sorter.order === "ascend" ? 1 : -1,
            sortingKey: sorter.field || "_id",
        });
    };

    const activeColumns = allColumns.filter(col => col.key === "actions" || visibleColumns.includes(col.key));

    return (
        <div className="space-y-4">
            <div className="place-holder-table modern-table shadow-sm border border-slate-100 rounded overflow-hidden bg-white">
                <Table
                    rowKey="_id"
                    className="custom-ant-table"
                    scroll={{ x: 1000, y: 600 }}
                    sticky={true}
                    loading={{
                        spinning: configurationsList.isLoading,
                        indicator: <TableSkeleton rows={8} columns={3} />,
                    }}
                    columns={activeColumns}
                    dataSource={configurationsList?.data?.data || []}
                    pagination={false}
                    onChange={handleTableChange}
                />
                {(updateStatus.isLoading || deleteConfig.isLoading) && <Loading />}

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
            </div>
        </div>
    );
}

export default ConfigurationsTable;
