import React from "react";
import { EllipsisOutlined, EyeOutlined } from "@ant-design/icons";
import { Dropdown, Button, Table, Tag } from "antd";
import { timestampToDate } from "@/utils/date";
import { hasPermission } from "@/utils/permissions";
import { PERMISSIONS } from "@/config/permissions";

const OrderTable = React.memo(({ modal, setModal, ordersList, onChange, businessId }) => {

    const actionMenu = (record) => {
        const items = [];

        if (hasPermission(PERMISSIONS.STORE.ORDERS.READ)) {
            items.push({
                key: "view",
                label: <span className="font-medium text-slate-700">View Details</span>,
                icon: <EyeOutlined className="text-teal-600" />,
                onClick: () => setModal({ name: "View", data: record, state: true }),
            });
        }

        return {
            items,
            className: "shadow-lg border border-slate-100 dark:border-slate-800 rounded p-1",
        };
    };

    const columns = [
        {
            title: "Order #",
            dataIndex: "orderNumber",
            key: "orderNumber",
            width: 140,
            render: (num) => (
                <span className="font-mono font-bold text-slate-800 dark:text-slate-100 text-[11px] transition-colors duration-300">
                    {num || "—"}
                </span>
            ),
        },
        {
            title: "Customer",
            key: "customer",
            width: 220,
            render: (record) => (
                <div className="flex flex-col min-w-0">
                    <span className="font-bold text-slate-800 dark:text-slate-100 text-[11px] truncate capitalize leading-tight transition-colors duration-300">
                        {record.customerId?.name || "Anonymous Customer"}
                    </span>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium block mt-0.5 leading-tight transition-colors duration-300 group-hover:text-slate-300">
                        {record.deliveryAddress?.phone || record.customerId?.phone || "No Phone"}
                    </span>
                </div>
            ),
        },
        {
            title: "Order Date",
            dataIndex: "createdAt",
            key: "createdAt",
            width: 160,
            render: (text) => (
                <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium whitespace-nowrap transition-colors duration-300 group-hover:text-slate-300">
                    {timestampToDate(text)}
                </span>
            ),
        },
        {
            title: "Total Amount",
            dataIndex: "total",
            key: "total",
            width: 130,
            render: (val) => (
                <span className="font-bold text-slate-800 dark:text-slate-100 text-[11px] transition-colors duration-300">
                    Rs. {val}
                </span>
            ),
        },
        {
            title: "Payment",
            dataIndex: "paymentMethod",
            key: "paymentMethod",
            width: 130,
            render: (method) => (
                <span className="text-[9px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    {method || "COD"}
                </span>
            ),
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            width: 150,
            render: (status) => {
                const colors = {
                    PENDING: "orange",
                    CONFIRMED: "blue",
                    PREPARING: "cyan",
                    OUT_FOR_DELIVERY: "purple",
                    DELIVERED: "green",
                    CANCELLED: "red",
                    REJECTED: "error",
                };
                return (
                    <Tag color={colors[status] || "default"} className="m-0 font-bold px-2.5 py-0.5 rounded-full text-[9px] uppercase tracking-wider border-none">
                        {status.replace(/_/g, " ")}
                    </Tag>
                );
            },
        },
        {
            title: "",
            key: "actions",
            width: 80,
            align: "right",
            fixed: "right",
            render: (record) => (
                <Dropdown menu={actionMenu(record)} trigger={["click"]} placement="bottomRight">
                    <Button
                        type="text"
                        icon={<EllipsisOutlined className="text-base text-slate-400" />}
                        className="!rounded hover:!bg-slate-100 flex items-center justify-center h-8 w-8"
                    />
                </Dropdown>
            ),
        },
    ];

    const data = ordersList?.data?.data || [];
    const pagination = ordersList?.data?.pagination || {};

    return (
        <div className="modern-table shadow-sm border border-slate-100 dark:border-slate-800 rounded overflow-hidden bg-white dark:bg-slate-900">
            <Table
                rowKey="_id"
                className="custom-ant-table"
                columns={columns}
                dataSource={data}
                loading={ordersList?.status === "loading"}
                pagination={{
                    current: pagination.currentPage,
                    pageSize: pagination.itemsPerPage,
                    total: pagination.totalItems,
                    showSizeChanger: true,
                    className: "px-4 pb-4",
                    onChange: (page, pageSize) => onChange({ currentPage: page, itemsPerPage: pageSize }),
                }}
            />
        </div>
    );
});

OrderTable.displayName = "OrderTable";

export default OrderTable;
