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
        <Menu className="!rounded !p-2 !min-w-[160px] shadow-xl border border-slate-100">
            <Menu.Item
                key="manage"
                icon={<CommentOutlined className="text-emerald-500" />}
                onClick={() => setModal({
                    name: "Manage",
                    data: record,
                    state: true
                })}
                className="!rounded hover:!bg-emerald-50"
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


    const allColumns = [
        {
            title: "Ticket Details",
            key: "ticketId",
            width: 300,
            sorter: true,
            render: (record) => (
                <div className="flex flex-col min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                        <span className="font-mono font-black text-[#006666] text-[10px] tracking-widest">#{record.ticketId}</span>
                        <span className="h-1 w-1 rounded-full bg-slate-300" />
                        <span className="font-bold text-slate-800 text-xs truncate">{record.subject}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] text-slate-400 font-bold uppercase truncate">{record.userId?.name || "Unknown User"}</span>
                        <span className="text-[10px] text-slate-300">•</span>
                        <span className="text-[10px] text-slate-400 font-medium">{record.userId?.phoneNumber || "No Phone"}</span>
                    </div>
                </div>
            ),
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            align: "center",
            width: 170,
            sorter: true,
            render: (status) => {
                const colors = { open: "orange", "in-progress": "blue", closed: "green" };
                const dotColors = { open: "#f59e0b", "in-progress": "#3b82f6", closed: "#22c55e" };
                return (
                    <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-${colors[status] || 'slate'}-50 text-${colors[status] || 'slate'}-600 border border-${colors[status] || 'slate'}-100/50`}>
                        <span className="h-1 w-1 rounded-full" style={{ backgroundColor: dotColors[status] || "#64748b" }} />
                        <span className="text-[9px] font-bold uppercase tracking-wider">{status.replace("-", " ")}</span>
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
                <Dropdown overlay={actionMenu(record)} trigger={["click"]} placement="bottomRight">
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
            <div className="flex justify-end px-1">
                <ColumnVisibilityDropdown
                    visibleColumns={visibleColumns}
                    setVisibleColumns={setVisibleColumns}
                    options={columnOptions}
                />
            </div>

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
