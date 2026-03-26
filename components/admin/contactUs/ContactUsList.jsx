"use client";
import {
    EyeOutlined,
    EllipsisOutlined,
    DeleteOutlined,
    CheckCircleOutlined
} from "@ant-design/icons";
import { timestampToDate } from "@/utils/date";
import { Table, Dropdown, Menu, Button, Tag } from "antd";
import { TableSkeleton } from "@/components/shared/Skeletons";

const getStatusColor = (status) => {
    switch (status) {
        case "PENDING": return "orange";
        case "REVIEWED": return "blue";
        case "RESOLVED": return "green";
        default: return "default";
    }
};

const getStatusDotColor = (status) => {
    switch (status) {
        case "PENDING": return "#f59e0b";
        case "REVIEWED": return "#3b82f6";
        case "RESOLVED": return "#22c55e";
        default: return "#64748b";
    }
};

function ContactUsList({ modal, setModal, contactList, onChange, onDelete, onUpdateStatus, visibleColumns }) {

    const handleSorting = (pagination, filters, sorter) => {
        onChange({
            ...filters,
            sortingKey: sorter.field || "createdAt",
            sortOrder: sorter.order === "ascend" ? 1 : -1,
            page: pagination.current,
            limit: pagination.pageSize
        });
    };

    const actionMenu = (record) => ({
        items: [
            {
                key: "view",
                label: <span className="font-medium">View Details</span>,
                icon: <EyeOutlined className="text-blue-500" />,
                onClick: () => setModal({
                    name: "ViewDetails",
                    data: record,
                    state: true
                }),
                className: "!rounded hover:!bg-blue-50",
            },
            {
                key: "resolve",
                label: <span className="font-medium">Mark as Resolved</span>,
                icon: <CheckCircleOutlined className="text-green-500" />,
                onClick: () => onUpdateStatus(record._id, "RESOLVED"),
                className: "!rounded hover:!bg-green-50",
                disabled: record.status === "RESOLVED",
            },
            {
                type: "divider",
                className: "!my-1",
            },
            {
                key: "delete",
                label: <span className="font-medium">Delete Request</span>,
                icon: <DeleteOutlined className="text-rose-500" />,
                onClick: () => onDelete(record._id),
                className: "!rounded hover:!bg-rose-50",
                danger: true,
            },
        ],
        className: "!rounded !p-2 !min-w-[160px] shadow-xl border border-slate-100",
    });



    const allColumns = [
        {
            title: "Contact Details",
            key: "name",
            width: 250,
            sorter: true,
            render: (record) => (
                <div className="flex flex-col min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                        <span className="font-bold text-slate-800 text-xs truncate">{record.name}</span>
                        <span className="h-1 w-1 rounded-full bg-slate-300" />
                        <span className="font-mono font-black text-[#006666] text-[10px] tracking-widest">#{record.requestId}</span>
                    </div>
                    <div className="text-[10px] text-slate-400 font-medium truncate">{record.email}</div>
                </div>
            ),
        },
        {
            title: "Source",
            dataIndex: "source",
            key: "source",
            width: 100,
            render: (source) => (
                <Tag color={source === "app" ? "purple" : "cyan"} className="text-[9px] font-bold uppercase rounded-full border-none">
                    {source}
                </Tag>
            ),
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            align: "center",
            width: 110,
            sorter: true,
            render: (status) => (
                <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-${getStatusColor(status)}-50 text-${getStatusColor(status)}-600 border border-${getStatusColor(status)}-100/50`}>
                    <span className="h-1 w-1 rounded-full" style={{ backgroundColor: getStatusDotColor(status) }} />
                    <span className="text-[9px] font-bold uppercase tracking-wider">{status}</span>
                </div>
            ),
        },
        {
            title: "Created",
            dataIndex: "createdAt",
            key: "createdAt",
            width: 130,
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
                    scroll={{ x: 800, y: 600 }}
                    sticky={true}
                    loading={{
                        spinning: contactList?.isLoading,
                        indicator: <TableSkeleton rows={8} columns={5} />,
                    }}
                    columns={activeColumns}
                    dataSource={contactList?.data?.data?.contacts}
                    pagination={{
                        current: contactList?.data?.data?.pagination?.page,
                        pageSize: contactList?.data?.data?.pagination?.limit,
                        total: contactList?.data?.data?.pagination?.total,
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

export default ContactUsList;
