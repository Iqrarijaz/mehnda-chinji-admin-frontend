import {
    EditOutlined,
    DeleteOutlined,
    EllipsisOutlined,
    SettingOutlined
} from "@ant-design/icons";
import Loading from "@/animations/homePageLoader";
import { useMutation, useQueryClient } from "react-query";
import { toast } from "react-toastify";
import { UPDATE_BLOOD_DONOR, DELETE_BLOOD_DONOR } from "@/app/api/admin/blood-donors";
import ConfirmModal from "@/components/shared/ConfirmModal";
import { getTagColor } from "@/utils/tagColor";
import { Menu, Dropdown, Button, Switch, Table, Tag } from "antd";
import { TableSkeleton } from "@/components/shared/Skeletons";
import { useState } from "react";

function BloodDonorsTable({ modal, setModal, bloodDonorsList, onChange, visibleColumns }) {
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

    const handleSorting = (pagination, filters, sorter) => {
        onChange({
            sortingKey: sorter.field || "_id",
            sortOrder: sorter.order === "ascend" ? 1 : -1,
            page: pagination.current,
        });
    };

    const statusMutation = useMutation({
        mutationFn: UPDATE_BLOOD_DONOR,
        onSuccess: () => {
            queryClient.invalidateQueries("bloodDonorsList");
            queryClient.invalidateQueries("bloodDonorsStatusCounts");
            toast.success("Availability updated successfully");
        },
        onError: (err) => {
            toast.error(err.response?.data?.message || "Failed to update availability");
        },
    });

    const deleteMutation = useMutation({
        mutationFn: DELETE_BLOOD_DONOR,
        onSuccess: () => {
            queryClient.invalidateQueries("bloodDonorsList");
            queryClient.invalidateQueries("bloodDonorsStatusCounts");
            toast.success("Donor deleted successfully");
            closeConfirmModal();
        },
        onError: (err) => {
            toast.error(err.response?.data?.message || "Failed to delete donor");
            closeConfirmModal();
        },
    });

    const handleDelete = (record) => {
        setConfirmModal({
            isOpen: true,
            title: 'Confirm Deletion',
            description: `Are you sure you want to delete donor "${record.name}"?`,
            confirmText: 'Yes, Delete',
            cancelText: 'Cancel',
            variant: 'danger',
            onConfirm: () => deleteMutation.mutate({ _id: record._id })
        });
    };

    const actionMenu = (record) => (
        <Menu className="!rounded-xl !p-2 !min-w-[140px] shadow-xl border border-slate-100">
            <Menu.Item
                key="edit"
                icon={<EditOutlined className="text-[#006666]" />}
                onClick={() => setModal({
                    name: "Update",
                    data: record,
                    state: true
                })}
                className="!rounded-lg hover:!bg-blue-50"
            >
                <span className="font-medium">Edit Donor</span>
            </Menu.Item>
            <Menu.Divider className="!my-1" />
            <Menu.Item
                key="delete"
                icon={<DeleteOutlined className="text-red-500" />}
                onClick={() => handleDelete(record)}
                className="!rounded-lg hover:!bg-red-50"
            >
                <span className="font-medium text-red-600">Delete Donor</span>
            </Menu.Item>
        </Menu>
    );




    const allColumns = [
        {
            title: "Donor Information",
            key: "name",
            width: 170,
            sorter: true,
            render: (record) => (
                <div className="flex flex-col min-w-0">
                    <span className="font-bold text-slate-800 text-xs truncate leading-tight block">{record.name}</span>
                    <span className="text-[10px] text-slate-400 font-medium truncate block leading-tight mt-0.5">{record.city || "No City"}</span>
                </div>
            ),
        },
        {
            title: "Group",
            dataIndex: "bloodGroup",
            key: "bloodGroup",
            width: 170,
            align: "center",
            sorter: true,
            render: (type) => (
                <div 
                    className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border border-current"
                    style={{ backgroundColor: `${getTagColor(type)}15`, color: getTagColor(type) }}
                >
                    {type}
                </div>
            ),
        },
        {
            title: "Contact",
            dataIndex: "phone",
            key: "phone",
            width: 170,
            sorter: true,
            render: (text) => <span className="text-slate-600 font-semibold text-xs whitespace-nowrap">{text}</span>,
        },
        {
            title: "Status",
            dataIndex: "available",
            key: "available",
            align: "center",
            width: 170,
            render: (available, record) => (
                <Switch
                    checked={available}
                    onChange={(checked) => statusMutation.mutate({ _id: record._id, available: checked })}
                    className={available ? '!bg-[#006666]' : '!bg-slate-300'}
                    size="small"
                />
            ),
        },
        {
            title: "",
            key: "actions",
            width: 50,
            align: "right",
            render: (record) => (
                <Dropdown overlay={actionMenu(record)} trigger={["click"]} placement="bottomRight">
                    <Button
                        type="text"
                        icon={<EllipsisOutlined className="text-lg rotate-90" />}
                        className="!rounded-lg hover:!bg-slate-100 !flex items-center justify-center !h-8 !w-8 transition-all"
                    />
                </Dropdown>
            ),
        }
    ];

    const activeColumns = allColumns.filter(col => col.key === "actions" || visibleColumns.includes(col.key));

    return (
        <div className="space-y-4">
            <div className="place-holder-table modern-table shadow-sm border border-slate-100 rounded-xl overflow-hidden bg-white">
                <Table
                    rowKey="_id"
                    className="custom-ant-table"
                    scroll={{ x: 1000, y: 600 }}
                    sticky={true}
                    loading={{
                        spinning: bloodDonorsList?.isLoading,
                        indicator: <TableSkeleton rows={8} columns={6} />,
                    }}
                    columns={activeColumns}
                    dataSource={bloodDonorsList?.data?.data?.docs}
                    pagination={{
                        current: bloodDonorsList?.data?.data?.page,
                        pageSize: bloodDonorsList?.data?.data?.limit,
                        total: bloodDonorsList?.data?.data?.totalDocs,
                        showSizeChanger: true,
                        className: "px-4 pb-4",
                        onChange: (page, pageSize) => onChange({ page: Number(page), limit: pageSize }),
                    }}
                    onChange={handleSorting}
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
                    loading={deleteMutation.isLoading}
                />
            </div>
        </div>
    );
}

export default BloodDonorsTable;
