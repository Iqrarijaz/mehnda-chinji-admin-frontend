import {
    EditOutlined,
    DeleteOutlined,
    EllipsisOutlined,
    SettingOutlined,
    UserOutlined,
    EyeOutlined
} from "@ant-design/icons";
import Loading from "@/animations/homePageLoader";
import { useMutation, useQueryClient } from "react-query";
import { toast } from "react-toastify";
import { timestampToDate } from "@/utils/date";
import { UPDATE_BLOOD_DONOR, DELETE_BLOOD_DONOR } from "@/app/api/admin/blood-donors";
import ConfirmModal from "@/components/shared/ConfirmModal";
import { getTagColor } from "@/utils/tagColor";
import { Menu, Dropdown, Button, Switch, Table, Tag, Avatar, Popover } from "antd";
import { TableSkeleton } from "@/components/shared/Skeletons";
import { ADMIN_KEYS } from "@/constants/queryKeys";
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
            queryClient.invalidateQueries([ADMIN_KEYS.BLOOD_DONORS.LIST]);
            queryClient.invalidateQueries([ADMIN_KEYS.BLOOD_DONORS.COUNTS]);
            toast.success("Availability updated successfully");
        },
        onError: (error) => {
            toast.error(error.errorMessage || "Failed to update availability");
        },
    });

    const deleteMutation = useMutation({
        mutationFn: DELETE_BLOOD_DONOR,
        onSuccess: () => {
            queryClient.invalidateQueries([ADMIN_KEYS.BLOOD_DONORS.LIST]);
            queryClient.invalidateQueries([ADMIN_KEYS.BLOOD_DONORS.COUNTS]);
            toast.success("Donor deleted successfully");
            closeConfirmModal();
        },
        onError: (error) => {
            toast.error(error.errorMessage || "Failed to delete donor");
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

    const actionMenu = (record) => ({
        items: [
            {
                key: "edit",
                label: <span className="font-medium text-slate-700 dark:text-slate-300">Edit Donor</span>,
                icon: <EditOutlined className="text-[#006666] dark:text-teal-500" />,
                onClick: () => setModal({
                    name: "Update",
                    data: record,
                    state: true
                }),
                className: "!rounded hover:!bg-blue-50 dark:hover:!bg-blue-900/20 transition-colors",
            },
            {
                type: "divider",
                className: "!my-1",
            },
            {
                key: "delete",
                label: <span className="font-medium text-red-600 dark:text-red-500">Delete Donor</span>,
                icon: <DeleteOutlined className="text-red-500 dark:text-red-400" />,
                onClick: () => handleDelete(record),
                className: "!rounded hover:!bg-red-50 dark:hover:!bg-red-900/20 transition-colors",
            },
        ],
        className: "!rounded !p-2 !min-w-[160px] shadow-xl border border-slate-100 dark:border-slate-800 dark:bg-slate-900 transition-colors",
    });




    const allColumns = [
        {
            title: "Donor Information",
            key: "name",
            width: 220,
            sorter: true,
            render: (record) => (
                <div className="flex items-center gap-3 min-w-0">
                    <Avatar
                        src={record.userId?.profileImage}
                        icon={<UserOutlined />}
                        className="flex-shrink-0 border border-slate-100 shadow-sm"
                        size={32}
                    />
                    <div className="flex flex-col min-w-0">
                        <span className="font-bold text-slate-800 dark:text-slate-100 text-[11px] truncate leading-tight block capitalize transition-colors duration-300">
                            {record.name || record.userId?.name || "N/A"}
                        </span>
                    </div>
                </div>
            ),
        },
        {
            title: "Group",
            dataIndex: "bloodGroup",
            key: "bloodGroup",
            width: 120,
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
            width: 150,
            sorter: true,
            render: (text, record) => (
                <span className="text-slate-600 dark:text-slate-400 font-semibold text-[11px] whitespace-nowrap transition-colors duration-300">
                    {text || record.userId?.phone || "—"}
                </span>
            ),
        },
        {
            title: "Last Donation",
            dataIndex: "lastDonationDate",
            key: "lastDonationDate",
            width: 150,
            sorter: true,
            render: (date) => (
                <span className="text-slate-500 dark:text-slate-500 font-medium text-[11px] transition-colors duration-300">
                    {date ? timestampToDate(date) : "Never"}
                </span>
            ),
        },
        {
            title: "City",
            key: "city",
            width: 150,
            sorter: true,
            render: (record) => (
                <span className="text-slate-500 dark:text-slate-500 font-medium text-[11px] capitalize transition-colors duration-300">
                    {record.city || record.userId?.city || "—"}
                </span>
            ),
        },
        {
            title: "Address",
            dataIndex: "address",
            key: "address",
            width: 200,
            render: (address) => (
                <span className="text-slate-500 dark:text-slate-500 font-medium text-[11px] truncate max-w-[180px] block capitalize transition-colors duration-300">
                    {address || "—"}
                </span>
            ),
        },
        {
            title: "Joined At",
            dataIndex: "createdAt",
            key: "createdAt",
            width: 150,
            sorter: true,
            render: (date) => (
                <span className="text-slate-500 dark:text-slate-500 font-medium text-[11px] whitespace-nowrap transition-colors duration-300">
                    {timestampToDate(date)}
                </span>
            ),
        },
        {
            title: "Availability",
            dataIndex: "available",
            key: "available",
            align: "center",
            width: 120,
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
            width: 70,
            align: "right",
            render: (record) => (
                <Dropdown menu={actionMenu(record)} trigger={["click"]} placement="bottomRight">
                    <Button
                        type="text"
                        icon={<EllipsisOutlined className="text-base text-slate-400" />}
                        className="!rounded hover:!bg-slate-300 !flex items-center justify-center !h-4 !w-8"
                    />
                </Dropdown>
            ),
        }
    ];

    const activeColumns = allColumns.filter(col => col.key === "actions" || visibleColumns.includes(col.key));

    return (
        <div className="space-y-4">
            <div className="place-holder-table modern-table shadow-sm border border-slate-100 dark:border-slate-800 rounded overflow-hidden bg-white dark:bg-slate-900 transition-colors duration-300">
                <Table
                    rowKey="_id"
                    className="custom-ant-table"
                    scroll={{ x: 1400, y: 600 }}
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
