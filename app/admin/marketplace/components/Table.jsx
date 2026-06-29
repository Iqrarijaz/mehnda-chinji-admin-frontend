"use client";
import React from "react";
import { Table, Tag, Button, Dropdown, Avatar, Image } from "antd";
import { EditOutlined, DeleteOutlined, CheckCircleOutlined, EllipsisOutlined } from "@ant-design/icons";
import { useMutation, useQueryClient } from "react-query";
import { toast } from "react-toastify";
import ConfirmModal from "@/components/shared/ConfirmModal";
import { TableSkeleton } from "@/components/shared/Skeletons";
import EmptyState from "@/components/shared/EmptyState";
import { HiOutlineShoppingBag } from "react-icons/hi2";
import { DELETE_MARKETPLACE } from "@/app/api/admin/marketplace";
import { timestampToDate } from "@/utils/date";
import { ADMIN_KEYS } from "@/constants/queryKeys";

const MarketplaceTable = React.memo(({ marketplaceList, setModal, onChange, visibleColumns = [] }) => {
    const queryClient = useQueryClient();
    const [confirmModal, setConfirmModal] = React.useState({
        state: false,
        onConfirm: null,
        title: "",
        content: ""
    });

    const handleSorting = React.useCallback((pagination, filters, sorter) => {
        onChange({
            sortingKey: sorter.field || "_id",
            sortOrder: sorter.order === "ascend" ? 1 : -1,
            page: pagination.current,
            limit: pagination.pageSize,
        });
    }, [onChange]);

    const handleDelete = useMutation({
        mutationKey: ["deleteMarketplace"],
        mutationFn: (id) => DELETE_MARKETPLACE({ listingId: id, hardDelete: "true" }),
        onSuccess: (data) => {
            toast.success(data?.message || "Listing deleted successfully");
            queryClient.invalidateQueries([ADMIN_KEYS.MARKETPLACE.LIST]);
            setConfirmModal({ state: false, onConfirm: null, title: "", content: "" });
        },
        onError: (error) => {
            toast.error(error.errorMessage || "Something went wrong");
        },
    });

    const actionMenu = React.useMemo(() => (record) => ({
        items: [
            {
                key: "status",
                label: <span className="font-medium text-slate-700 dark:text-slate-300">Change Status</span>,
                icon: <CheckCircleOutlined className="text-teal-600 dark:text-teal-400" />,
                onClick: () => setModal({ name: "Status", data: record, state: true }),
                className: "!rounded hover:!bg-teal-50 dark:hover:!bg-teal-900/20 transition-colors",
            },
            {
                key: "edit",
                label: <span className="font-medium text-slate-700 dark:text-slate-300">Edit Details</span>,
                icon: <EditOutlined className="text-[#006666] dark:text-teal-500" />,
                onClick: () => setModal({ name: "Update", data: record, state: true }),
                className: "!rounded hover:!bg-blue-50 dark:hover:!bg-blue-900/20 transition-colors",
            },
            {
                type: "divider",
                className: "!my-1",
            },
            {
                key: "delete",
                label: <span className="font-medium text-red-600 dark:text-red-500">Delete Listing</span>,
                icon: <DeleteOutlined className="text-red-500 dark:text-red-400" />,
                onClick: () => setConfirmModal({
                    state: true,
                    title: "Delete Listing",
                    content: `Are you sure you want to delete listing "${record.title}"?`,
                    onConfirm: () => handleDelete.mutate(record._id)
                }),
                className: "!rounded hover:!bg-red-50 dark:hover:!bg-red-900/20 transition-colors",
            },
        ],
        className: "!rounded !p-2 !min-w-[160px] shadow-xl border border-slate-100 dark:border-slate-800 dark:bg-slate-900 transition-colors",
    }), [setModal, handleDelete]);

    const columns = React.useMemo(() => [
        {
            title: "Item / Image",
            key: "item",
            render: (_, record) => (
                <div className="flex items-center gap-3">
                    {record.images && record.images.length > 0 ? (
                        <Image
                            src={record.images[0]}
                            alt={record.title}
                            width={40}
                            height={40}
                            className="rounded-md object-cover border border-slate-100"
                        />
                    ) : (
                        <Avatar shape="square" size={40} icon="🛍️" />
                    )}
                    <div className="flex flex-col">
                        <span className="font-semibold text-slate-800 dark:text-slate-200 capitalize">
                            {record.title}
                        </span>
                        {record.isFeatured && (
                            <span className="text-[10px] text-teal-600 bg-teal-50 dark:bg-teal-950/30 px-1.5 py-0.5 rounded font-bold w-fit">
                                FEATURED
                            </span>
                        )}
                    </div>
                </div>
            )
        },
        {
            title: "Category / Type",
            key: "category",
            render: (_, record) => (
                <div className="flex flex-col">
                    <span className="text-slate-700 dark:text-slate-300 font-medium">
                        {record.category?.en} ({record.category?.ur})
                    </span>
                    <span className="text-xs text-slate-500">
                        {record.type?.en} ({record.type?.ur})
                    </span>
                </div>
            )
        },
        {
            title: "Price",
            key: "price",
            render: (_, record) => (
                <div className="flex flex-col">
                    <span className="font-bold text-slate-800 dark:text-slate-200">
                        Rs. {record.price.toLocaleString()}
                    </span>
                    {record.negotiable && (
                        <span className="text-[10px] text-slate-400 font-semibold">
                            Negotiable
                        </span>
                    )}
                </div>
            )
        },
        {
            title: "Seller",
            key: "seller",
            render: (_, record) => (
                <div className="flex flex-col">
                    <span className="font-medium text-slate-700 dark:text-slate-300">
                        {record.sellerId?.name || "System"}
                    </span>
                    <span className="text-xs text-slate-500">
                        {record.sellerPhone}
                    </span>
                </div>
            )
        },
        {
            title: "Place",
            dataIndex: "place",
            key: "place",
            render: (text) => <span className="font-medium text-slate-700 dark:text-slate-300">{text}</span>
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            render: (status, record) => {
                let color = "orange";
                if (status === "live") color = "green";
                if (status === "rejected") color = "red";
                if (status === "sold") color = "default";
                return (
                    <div className="flex flex-col gap-1 items-start">
                        <Tag color={color}>{status?.toUpperCase()}</Tag>
                        {status === "rejected" && record.rejectedReason && (
                            <span className="text-[10px] text-red-500 max-w-[150px] truncate" title={record.rejectedReason}>
                                {record.rejectedReason}
                            </span>
                        )}
                    </div>
                );
            }
        },
        {
            title: "Created At",
            dataIndex: "createdAt",
            key: "createdAt",
            render: (date) => timestampToDate(date)
        },
        {
            title: "",
            key: "actions",
            align: "right",
            width: 70,
            render: (_, record) => (
                <Dropdown menu={actionMenu(record)} trigger={["click"]} placement="bottomRight">
                    <Button
                        type="text"
                        icon={<EllipsisOutlined className="text-base text-slate-400" />}
                        className="!rounded hover:!bg-slate-300 !flex items-center justify-center !h-4 !w-8"
                    />
                </Dropdown>
            )
        }
    ], [actionMenu]);

    const activeColumns = React.useMemo(() =>
        columns.filter(col => col.key === "actions" || visibleColumns.includes(col.key)),
        [columns, visibleColumns]);

    const { docs = [], totalDocs = 0, limit = 10, page = 1 } = marketplaceList?.data?.data || {};

    if (!marketplaceList?.isLoading && docs.length === 0) {
        return (
            <>
                <EmptyState
                    icon={<HiOutlineShoppingBag className="w-12 h-12 text-teal-100" />}
                    title="No listings found"
                    description="We couldn't find any marketplace items matching your criteria. Try adjusting your filters or search."
                    actionTitle="Add New Listing"
                    onAction={() => setModal({ name: "Add", data: null, state: true })}
                    className="my-8"
                />
            </>
        );
    }

    return (
        <>
            <Table
                dataSource={docs}
                columns={activeColumns}
                rowKey="_id"
                onChange={handleSorting}
                className="custom-table"
                loading={{
                    spinning: marketplaceList?.isLoading,
                    indicator: <TableSkeleton rows={8} columns={5} />
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
                    onClose={() => setConfirmModal({ state: false, onConfirm: null, title: "", content: "" })}
                    title={confirmModal.title}
                    description={confirmModal.content}
                    onConfirm={confirmModal.onConfirm}
                    loading={handleDelete.isLoading}
                    variant="danger"
                />
            )}
        </>
    );
});

MarketplaceTable.displayName = "MarketplaceTable";

export default MarketplaceTable;
