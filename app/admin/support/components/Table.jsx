import React from "react";
import {
    EllipsisOutlined,
    SettingOutlined,
} from "@ant-design/icons";
import { timestampToDate } from "@/utils/date";
import { TableSkeleton } from "@/components/shared/Skeletons";
import { Table, Tooltip, Dropdown, Button } from "antd";

const SupportTable = React.memo(({ modal, setModal, ticketsList, onChange, filters, visibleColumns = [] }) => {
    const handleSorting = React.useCallback((pagination, filters, sorter) => {
        onChange({
            sortingKey: sorter.field || "createdAt",
            sortOrder: sorter.order === "ascend" ? 1 : -1,
            page: pagination.current,
        });
    }, [onChange]);

    const actionMenu = React.useMemo(() => (record) => ({
        items: [
            {
                key: "manage",
                label: <span className="font-medium text-slate-700 dark:text-slate-300">Manage Ticket</span>,
                icon: <SettingOutlined className="text-[#006666] dark:text-teal-500" />,
                onClick: () => setModal({
                    name: "Manage",
                    data: record,
                    state: true
                }),
                className: "!rounded hover:!bg-emerald-50 dark:hover:!bg-emerald-900/20 transition-colors",
            },
        ],
        className: "!rounded !p-2 !min-w-[160px] shadow-xl border border-slate-100 dark:border-slate-800 dark:bg-slate-900 transition-colors",
    }), [setModal]);

    const allColumns = React.useMemo(() => [
        {
            title: "Ticket ID",
            dataIndex: "ticketId",
            key: "ticketId",
            width: 120,
            sorter: true,
            render: (text) => (
                <span className="font-mono font-black text-[#006666] dark:text-teal-500 text-[10px] tracking-widest uppercase transition-colors duration-300">#{text}</span>
            ),
        },
        {
            title: "Subject",
            dataIndex: "subject",
            key: "subject",
            width: 200,
            sorter: true,
            render: (text) => (
                <span className="font-bold text-slate-800 dark:text-slate-100 text-[11px] truncate block max-w-[150px] transition-colors duration-300">{text}</span>
            ),
        },
        {
            title: "User",
            key: "userId",
            width: 180,
            render: (record) => (
                <div className="flex flex-col min-w-0">
                    <span className="text-[11px] text-slate-800 dark:text-slate-100 font-bold uppercase truncate transition-colors duration-300">{record.userId?.name || "Unknown User"}</span>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium transition-colors duration-300 group-hover:text-slate-300">{record.userId?.phoneNumber || "No Phone"}</span>
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
                    <div className="text-[10px] text-slate-400 dark:text-slate-500 font-medium leading-relaxed truncate max-w-[200px] transition-colors duration-300 group-hover:text-slate-300">
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
                    <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-${color}-50 dark:bg-${color}-900/20 text-${color}-600 dark:text-${color}-400 border border-${color}-100/50 dark:border-${color}-900/30 transition-colors duration-300`}>
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
            render: (text) => <div className="text-[10px] text-slate-400 dark:text-slate-500 font-medium whitespace-nowrap transition-colors duration-300 group-hover:text-slate-300">{timestampToDate(text)}</div>,
        },
        {
            title: "",
            key: "actions",
            width: 70,
            align: "right",
            fixed: "right",
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
    ], [actionMenu]);

    const activeColumns = React.useMemo(() =>
        allColumns.filter(col => col.key === "actions" || visibleColumns.includes(col.key)),
        [allColumns, visibleColumns]);

    return (
        <div className="space-y-4">
            <div className="modern-table shadow-sm border border-slate-100 dark:border-slate-800 rounded overflow-hidden bg-white dark:bg-slate-900 transition-colors duration-300">
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
});

SupportTable.displayName = "SupportTable";
export default SupportTable;
