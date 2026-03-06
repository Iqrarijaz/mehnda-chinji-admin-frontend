import {
    EditOutlined,
    DeleteOutlined,
    MoreOutlined,
    SettingOutlined
} from "@ant-design/icons";
import Loading from "@/animations/homePageLoader";
import { useMutation, useQueryClient } from "react-query";
import { toast } from "react-toastify";
import { UPDATE_BLOOD_DONOR, DELETE_BLOOD_DONOR } from "@/app/api/admin/blood-donors";
import ConfirmModal from "@/components/shared/ConfirmModal";
import { getTagColor } from "@/utils/tagColor";
import { Menu, Dropdown, Button, Checkbox, Switch, Tag } from "antd";
import { TableSkeleton } from "@/components/shared/Skeletons";
import { useState } from "react";

function BloodDonorsTable({ modal, setModal, bloodDonorsList, onChange }) {
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

    // Column Visibility State
    const [visibleColumns, setVisibleColumns] = useState(["name", "bloodGroup", "phone", "city", "available", "actions"]);

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
                icon={<EditOutlined className="text-blue-500" />}
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

    const columnOptions = [
        { label: "Name", value: "name" },
        { label: "Blood Group", value: "bloodGroup" },
        { label: "Phone", value: "phone" },
        { label: "City", value: "city" },
        { label: "Availability", value: "available" },
    ];

    const visibilityMenu = (
        <Menu className="!rounded-xl !p-3 shadow-xl border border-slate-100 min-w-[180px]">
            <div className="px-2 pb-2 mb-2 border-b border-slate-100 text-xs font-bold text-slate-400 uppercase tracking-wider">
                Toggle Columns
            </div>
            <Checkbox.Group
                value={visibleColumns}
                onChange={setVisibleColumns}
                className="flex flex-col gap-2"
            >
                {columnOptions.map(opt => (
                    <Menu.Item key={opt.value} className="!bg-transparent !cursor-default hover:!bg-slate-50 !rounded-lg !py-1">
                        <Checkbox value={opt.value} className="font-medium text-slate-700 w-full">
                            {opt.label}
                        </Checkbox>
                    </Menu.Item>
                ))}
            </Checkbox.Group>
        </Menu>
    );

    const allColumns = [
        {
            title: "Name",
            dataIndex: "name",
            key: "name",
            width: 140,
            sorter: true,
            render: (name) => <span className="capitalize font-bold text-slate-800">{name}</span>,
        },
        {
            title: "Blood Group",
            dataIndex: "bloodGroup",
            key: "bloodGroup",
            width: 100,
            align: "center",
            sorter: true,
            render: (type) => (
                <span
                    className="mr-0 text-[10px] px-3 py-1 rounded-full capitalize font-bold text-white shadow-sm"
                    style={{ backgroundColor: getTagColor(type) }}
                >
                    {type}
                </span>
            ),
        },
        {
            title: "Phone",
            dataIndex: "phone",
            key: "phone",
            width: 130,
            sorter: true,
            render: (text) => <span className="text-slate-600 font-medium">{text}</span>,
        },
        {
            title: "City",
            dataIndex: "city",
            key: "city",
            width: 100,
            sorter: true,
            render: (city) => <span className="capitalize text-slate-500 font-medium">{city || "-"}</span>,
        },
        {
            title: "Available",
            dataIndex: "available",
            key: "available",
            align: "center",
            width: 100,
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
            width: 60,
            align: "right",
            render: (record) => (
                <Dropdown overlay={actionMenu(record)} trigger={["click"]} placement="bottomRight">
                    <Button
                        type="text"
                        icon={<MoreOutlined className="text-lg" />}
                        className="!rounded-xl hover:!bg-slate-100 !flex items-center justify-center !h-10 !w-10"
                    />
                </Dropdown>
            ),
        }
    ];

    const activeColumns = allColumns.filter(col => col.key === "actions" || visibleColumns.includes(col.key));

    return (
        <div className="space-y-4">
            <div className="flex justify-end px-1">
                <Dropdown overlay={visibilityMenu} trigger={['click']}>
                    <Button
                        icon={<SettingOutlined />}
                        className="!rounded-xl !h-[42px] !px-4 !border-slate-200 !text-slate-600 font-semibold hover:!border-[#006666] hover:!text-[#006666] flex items-center gap-2"
                    >
                        Columns
                    </Button>
                </Dropdown>
            </div>

            <div className="place-holder-table modern-table shadow-sm border border-slate-100 rounded-xl overflow-hidden bg-white">
                <Table
                    rowKey="_id"
                    className="custom-ant-table"
                    scroll={{ x: 800, y: 600 }}
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
