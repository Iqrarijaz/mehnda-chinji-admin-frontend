import {
    EyeOutlined,
    MoreOutlined,
    SettingOutlined,
    MessageOutlined,
    CommentOutlined
} from "@ant-design/icons";
import Loading from "@/animations/homePageLoader";
import { timestampToDate } from "@/utils/date";
import { Pagination, Table, Tag, Tooltip, Menu, Dropdown, Button, Checkbox } from "antd";
import { TableSkeleton } from "@/components/shared/Skeletons";
import { useState } from "react";

const getTicketStatusColor = (status) => {
    switch (status) {
        case "open": return "orange";
        case "in-progress": return "blue";
        case "closed": return "green";
        default: return "default";
    }
};

function SupportTable({ modal, setModal, ticketsList, onChange }) {
    // Column Visibility State
    const [visibleColumns, setVisibleColumns] = useState(["ticketId", "userId", "subject", "status", "createdAt", "actions"]);

    const handleSorting = (pagination, filters, sorter) => {
        onChange({
            ...filters,
            sortingKey: sorter.field || "createdAt",
            sortOrder: sorter.order === "ascend" ? 1 : -1,
            page: pagination.current,
        });
    };

    const actionMenu = (record) => (
        <Menu className="!rounded-xl !p-2 !min-w-[160px] shadow-xl border border-slate-100">
            <Menu.Item
                key="manage"
                icon={<CommentOutlined className="text-emerald-500" />}
                onClick={() => setModal({
                    name: "Manage",
                    data: record,
                    state: true
                })}
                className="!rounded-lg hover:!bg-emerald-50"
            >
                <span className="font-medium">View & Manage</span>
            </Menu.Item>
        </Menu>
    );

    const columnOptions = [
        { label: "Ticket ID", value: "ticketId" },
        { label: "User", value: "userId" },
        { label: "Subject", value: "subject" },
        { label: "Status", value: "status" },
        { label: "Created At", value: "createdAt" },
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
            title: "Ticket ID",
            dataIndex: "ticketId",
            key: "ticketId",
            width: 140,
            sorter: true,
            render: (text) => (
                <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-[#006666] bg-[#006666]/5 px-2 py-0.5 rounded border border-[#006666]/10 text-xs uppercase tracking-wider">
                        #{text}
                    </span>
                </div>
            ),
        },
        {
            title: "User",
            dataIndex: "userId",
            key: "userId",
            width: 220,
            render: (user) => (
                <div className="flex flex-col">
                    <span className="font-bold text-slate-800 leading-tight capitalize">{user?.name || "Unknown User"}</span>
                    <span className="text-[11px] text-slate-400 font-medium">{user?.phoneNumber || "No Phone"}</span>
                </div>
            ),
        },
        {
            title: "Subject",
            dataIndex: "subject",
            key: "subject",
            width: 300,
            render: (subject) => (
                <Tooltip title={subject} placement="topLeft">
                    <div className="text-slate-600 font-medium truncate cursor-help">
                        {subject}
                    </div>
                </Tooltip>
            ),
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            align: "center",
            width: 140,
            sorter: true,
            render: (status) => {
                const colors = {
                    "open": "var(--warning)",
                    "in-progress": "var(--info)",
                    "closed": "var(--success)",
                };
                const bgColors = {
                    "open": "rgba(245, 158, 11, 0.1)",
                    "in-progress": "rgba(59, 130, 246, 0.1)",
                    "closed": "rgba(34, 197, 94, 0.1)",
                };
                const dotColors = {
                    "open": "#f59e0b",
                    "in-progress": "#3b82f6",
                    "closed": "#22c55e",
                };
                return (
                    <div
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border"
                        style={{
                            backgroundColor: bgColors[status] || "rgba(148, 163, 184, 0.1)",
                            color: dotColors[status] || "#64748b",
                            borderColor: `${dotColors[status]}20` || "#64748b20"
                        }}
                    >
                        <span className="flex h-1.5 w-1.5 rounded-full" style={{ backgroundColor: dotColors[status] || "#64748b" }} />
                        {status.replace("-", " ")}
                    </div>
                );
            },
        },
        {
            title: "Created At",
            dataIndex: "createdAt",
            key: "createdAt",
            width: 160,
            sorter: true,
            render: (text) => <div className="text-slate-500 font-medium whitespace-nowrap">{timestampToDate(text)}</div>,
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

            <div className="modern-table shadow-sm border border-slate-100 rounded-xl overflow-hidden bg-white">
                <Table
                    rowKey="_id"
                    className="custom-ant-table"
                    scroll={{ x: 1000, y: 600 }}
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
