"use client";
import React from "react";
import { Table, Tag, Button, Dropdown, Avatar, Image, Tooltip } from "antd";
import { EditOutlined, DeleteOutlined, CheckCircleOutlined, EllipsisOutlined } from "@ant-design/icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
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
                    <div className="flex flex-col min-w-0">
                        <span className="font-bold text-slate-800 dark:text-slate-100 text-[11px] truncate leading-tight capitalize transition-colors duration-300">
                            {record.title}
                        </span>
                        {record.isFeatured && (
                            <span className="text-[9px] font-bold uppercase tracking-wider text-teal-600 bg-teal-50 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-900/30 px-2.5 py-0.5 rounded-full w-fit mt-0.5">
                                FEATURED
                            </span>
                        )}
                    </div>
                </div>
            )
        },
        {
            title: "Category",
            key: "category",
            render: (_, record) => (
                <div className="flex flex-col">
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium transition-colors duration-300 group-hover:text-slate-300">
                        {record.category?.en} ({record.category?.ur})
                    </span>
                </div>
            )
        },
        {
            title: "Type",
            key: "type",
            render: (_, record) => (
                <div className="flex flex-col">
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium transition-colors duration-300 group-hover:text-slate-300">
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
                    <span className="font-bold text-slate-800 dark:text-slate-100 text-[11px] transition-colors duration-300">
                        Rs. {record.price.toLocaleString()}
                    </span>
                    {record.negotiable && (
                        <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 mt-0.5">
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
                <div className="flex flex-col min-w-0">
                    <span className="font-bold text-slate-800 dark:text-slate-100 text-[11px] truncate leading-tight capitalize transition-colors duration-300">
                        {record.sellerId?.name || "System"}
                    </span>
                </div>
            )
        },
        {
            title: "Seller Phone",
            key: "sellerPhone",
            render: (_, record) => (
                <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium transition-colors duration-300 group-hover:text-slate-300">
                    {record.sellerPhone}
                </span>
            )
        },
        {
            title: "Place",
            dataIndex: "place",
            key: "place",
            render: (text) => <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium truncate transition-colors duration-300 group-hover:text-slate-300">{text}</span>
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            render: (status, record) => {
                const getStatusStyles = (s) => {
                    switch (s) {
                        case "live":
                            return "bg-green-50 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800";
                        case "pending":
                            return "bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-800";
                        case "rejected":
                            return "bg-red-50 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800";
                        case "offline":
                            return "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-800";
                        case "sold":
                            return "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800";
                        default:
                            return "bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-900/30 dark:text-slate-400 dark:border-slate-800";
                    }
                };
                
                const getDotStyles = (s) => {
                    switch (s) {
                        case "live": return "bg-green-500 animate-pulse";
                        case "pending": return "bg-orange-500 animate-pulse";
                        case "rejected": return "bg-red-500";
                        case "offline": return "bg-purple-500";
                        case "sold": return "bg-blue-500";
                        default: return "bg-slate-500";
                    }
                };

                return (
                    <div className="flex flex-col gap-1 items-start">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider border shadow-sm transition-colors ${getStatusStyles(status)}`}>
                            <span className={`w-1.5 h-1.5 rounded-full shadow-sm ${getDotStyles(status)}`} />
                            {status}
                        </span>
                        {status === "rejected" && record.rejectedReason && (
                            <span className="text-[9px] text-red-500 max-w-[150px] truncate font-medium mt-0.5" title={record.rejectedReason}>
                                {record.rejectedReason}
                            </span>
                        )}
                    </div>
                );
            }
        },
        {
            title: "Metadata",
            dataIndex: "metadata",
            key: "metadata",
            width: 150,
            render: (val) => (
                <Tooltip title={<pre className="text-xs">{JSON.stringify(val, null, 2)}</pre>}>
                    <div className="max-w-[150px] overflow-hidden whitespace-nowrap text-ellipsis italic font-mono text-[10px] text-slate-400 dark:text-slate-500 font-medium transition-colors duration-300 group-hover:text-slate-300 cursor-help">
                        {val && Object.keys(val).length > 0 ? JSON.stringify(val) : "{}"}
                    </div>
                </Tooltip>
            )
        },
        {
            title: "Created At",
            dataIndex: "createdAt",
            key: "createdAt",
            render: (date) => <div className="text-[10px] text-slate-400 dark:text-slate-500 font-medium whitespace-nowrap transition-colors duration-300 group-hover:text-slate-300">{timestampToDate(date)}</div>
        },
        {
            title: "Actions",
            key: "actions",
            align: "center",
            width: 80,
            fixed: "right",
            render: (_, record) => (
                <Dropdown menu={actionMenu(record)} trigger={["click"]} placement="bottomRight">
                    <Button
                        type="text"
                        icon={<EllipsisOutlined className="text-lg text-slate-500" />}
                        className="hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full"
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
        <div className="place-holder-table modern-table overflow-hidden">
            <Table
                dataSource={docs}
                columns={activeColumns}
                rowKey="_id"
                onChange={handleSorting}
                className="custom-ant-table"
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
                    loading={handleDelete.isPending}
                    variant="danger"
                />
            )}
        </div>
    );
});

MarketplaceTable.displayName = "MarketplaceTable";

export default MarketplaceTable;
