import {
    EyeOutlined,
    EllipsisOutlined,
} from "@ant-design/icons";
import { timestampToDate } from "@/utils/date";
import ViewDetailsModal from "./ViewDetailsModal";
import { Table, Tag, Dropdown, Button } from "antd";
import { TableSkeleton } from "@/components/shared/Skeletons";
import { useState } from "react";

function LogsTable({ logsList, onChange, visibleColumns }) {
    const [viewModal, setViewModal] = useState({ open: false, data: null });

    const actionMenu = (record) => ({
        items: [
            {
                key: "view",
                label: <span className="font-medium text-slate-700 dark:text-slate-300">View JSON Data</span>,
                icon: <EyeOutlined className="text-emerald-500" />,
                onClick: () => setViewModal({ open: true, data: record }),
                className: "!rounded hover:!bg-emerald-50 dark:hover:!bg-emerald-900/20 transition-colors",
            },
        ],
        className: "!rounded !p-2 !min-w-[160px] shadow-xl border border-slate-100 dark:border-slate-800 dark:bg-slate-900 transition-colors",
    });

    const allColumns = [
        {
            title: "Time",
            dataIndex: "createdAt",
            key: "createdAt",
            width: 170,
            render: (text) => <div className="text-slate-500 dark:text-slate-500 text-xs font-medium whitespace-nowrap transition-colors duration-300">{timestampToDate(text)}</div>,
        },
        {
            title: "Type",
            dataIndex: "type",
            key: "type",
            width: 120,
            align: "center",
            render: (type) => (
                <Tag color={type === 'ERROR' ? 'red' : 'green'} className="!rounded-full !px-2 font-bold !border-0 uppercase text-[9px] dark:opacity-80">
                    {type}
                </Tag>
            ),
        },
        {
            title: "Function",
            dataIndex: "functionName",
            key: "functionName",
            width: 250,
            render: (text) => <span className="font-semibold text-slate-700 dark:text-slate-200 text-xs truncate leading-tight block transition-colors duration-300">{text}</span>,
        },
        {
            title: "User ID",
            dataIndex: "userId",
            key: "userId",
            width: 150,
            render: (userId) => (
                <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium truncate block leading-tight transition-colors duration-300">
                    {userId || "System"}
                </span>
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
            <div className="modern-table shadow-sm border border-slate-100 dark:border-slate-800 rounded overflow-hidden bg-white dark:bg-slate-900 transition-colors duration-300">
                <Table
                    rowKey="_id"
                    className="custom-ant-table"
                    scroll={{ x: 1000, y: 600 }}
                    sticky={true}
                    loading={{
                        spinning: logsList?.status === "loading",
                        indicator: <TableSkeleton rows={15} columns={5} />,
                    }}
                    columns={activeColumns}
                    dataSource={logsList?.data?.data}
                    pagination={{
                        current: logsList?.data?.pagination?.page,
                        pageSize: logsList?.data?.pagination?.limit,
                        total: logsList?.data?.pagination?.total,
                        showSizeChanger: true,
                        className: "px-4 pb-4",
                        onChange: (page, pageSize) => onChange({ currentPage: page, itemsPerPage: pageSize }),
                    }}
                />
                
                <ViewDetailsModal 
                    open={viewModal.open} 
                    onClose={() => setViewModal({ open: false, data: null })} 
                    data={viewModal.data} 
                />
            </div>
        </div>
    );
}

export default LogsTable;
