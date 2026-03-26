import {
    EyeOutlined,
    EllipsisOutlined,
    SettingOutlined,
    MessageOutlined,
    CommentOutlined
} from "@ant-design/icons";
import Loading from "@/animations/homePageLoader";
import { timestampToDate } from "@/utils/date";
import { Pagination, Table, Tag, Tooltip, Menu, Dropdown, Button } from "antd";
import { TableSkeleton } from "@/components/shared/Skeletons";
import { useState } from "react";
import ColumnVisibilityDropdown from "@/components/InnerPage/ColumnVisibilityDropdown";

const getTicketStatusColor = (status) => {
    const s = status?.toUpperCase();
    switch (s) {
        case "OPEN": return "orange";
        case "IN_PROGRESS": return "blue";
        case "CLOSED": return "green";
        default: return "default";
    }
};

function SupportTable({ modal, setModal, ticketsList, onChange, visibleColumns }) {


    const handleSorting = (pagination, filters, sorter) => {
        onChange({
            ...filters,
            sortingKey: sorter.field || "createdAt",
            sortOrder: sorter.order === "ascend" ? 1 : -1,
            page: pagination.current,
        });
    };

    const actionMenu = (record) => ({
        items: [
            {
                key: "manage",
                label: <span className="font-medium">View & Manage</span>,
                icon: <CommentOutlined className="text-emerald-500" />,
                onClick: () => setModal({
                    name: "Manage",
                    data: record,
                    state: true
                }),
                className: "!rounded hover:!bg-emerald-50",
            },
        ],
        className: "!rounded !p-2 !min-w-[160px] shadow-xl border border-slate-100",
    });




    const allColumns = [
        {
            title: "Ticket ID",
            dataIndex: "ticketId",
            key: "ticketId",
            width: 120,
            sorter: true,
            render: (text) => (
                <span className="font-mono font-black text-[#006666] text-[10px] tracking-widest uppercase">#{text}</span>
            ),
        },
        {
            title: "Subject",
            dataIndex: "subject",
            key: "subject",
            width: 200,
            sorter: true,
            render: (text) => (
                <span className="font-bold text-slate-800 text-xs truncate block max-w-[150px]">{text}</span>
            ),
        },
        {
            title: "User",
            key: "userId",
            width: 180,
            render: (record) => (
                <div className="flex flex-col min-w-0">
                    <span className="text-[10px] text-slate-800 font-bold uppercase truncate">{record.userId?.name || "Unknown User"}</span>
                    <span className="text-[10px] text-slate-400 font-medium">{record.userId?.phoneNumber || "No Phone"}</span>
                </div>
            ),
        },
        {
            title: "Description",
            dataIndex: "description",
            key: "description",
            width: 250,
            render: (text) => (
                <Tooltip title={text}>
                    <div className="text-slate-500 text-[11px] leading-relaxed truncate max-w-[200px]">
                        {text || "No description provided"}
                    </div>
                </Tooltip>
            ),
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            align: "center",
            width: 130,
            sorter: true,
            render: (status = "") => {
                const s = status.toUpperCase();
                const colors = { OPEN: "orange", IN_PROGRESS: "blue", CLOSED: "green" };
                const dotColors = { OPEN: "#f59e0b", IN_PROGRESS: "#3b82f6", CLOSED: "#22c55e" };
                const labels = { OPEN: "OPEN", IN_PROGRESS: "IN PROGRESS", CLOSED: "CLOSED" };
                const color = colors[s] || "slate";
                return (
                    <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-${color}-50 text-${color}-600 border border-${color}-100/50`}>
                        <span className="h-1 w-1 rounded-full" style={{ backgroundColor: dotColors[s] || "#64748b" }} />
                        <span className="text-[9px] font-bold uppercase tracking-wider">{labels[s] || s}</span>
                    </div>
                );
            },
        },
        {
            title: "Created",
            dataIndex: "createdAt",
            key: "createdAt",
            width: 170,
            sorter: true,
            render: (text) => <div className="text-slate-500 text-xs font-medium whitespace-nowrap">{timestampToDate(text)}</div>,
        },
        {
            title: "",
            key: "actions",
            width: 50,
            align: "right",
            render: (record) => (
                <Dropdown menu={actionMenu(record)} trigger={["click"]} placement="bottomRight">
                    <Button
                        type="text"
                        icon={<EllipsisOutlined className="text-lg rotate-90" />}
                        className="!rounded hover:!bg-slate-100 !flex items-center justify-center !h-8 !w-8 transition-all"
                    />
                </Dropdown>
            ),
        }
    ];

    const activeColumns = allColumns.filter(col => col.key === "actions" || visibleColumns.includes(col.key));

    return (
        <div className="space-y-4">
            <div className="modern-table shadow-sm border border-slate-100 rounded overflow-hidden bg-white">
                <Table
                    rowKey="_id"
                    className="custom-ant-table"
                    scroll={{ x: 1100, y: 600 }}
                    sticky={true}
                    loading={{
                        spinning: ticketsList?.isLoading,
                        indicator: <TableSkeleton rows={8} columns={5} />,
                    }}
                    columns={activeColumns}
                    dataSource={ticketsList?.data?.data?.tickets}
                    pagination={{
                        current: ticketsList?.data?.data?.pagination?.page,
                        pageSize: ticketsList?.data?.data?.pagination?.limit,
                        total: ticketsList?.data?.data?.pagination?.total,
                        showSizeChanger: true,
                        className: "px-4 pb-4",
                        onChange: (page, pageSize) => onChange({ page: Number(page), limit: pageSize }),
                    }}
                    onChange={handleSorting}
                />
            </div>
        </div>
    );
}

export default SupportTable;
