import React from "react";
import { Table } from "antd";
import moment from "moment";
import { TableSkeleton } from "@/components/shared/Skeletons";

const FeedbackList = React.memo(({ data, isLoading, filters, setFilters, pagination, onUpdateStatus, onDelete }) => {
    
    const columns = React.useMemo(() => [
        { 
            title: "User",
            key: "user", 
            render: (_, record) => (
                <div className="flex items-center gap-3">
                    <img 
                        src={record.userId?.image?.url || "/assets/avatar.png"} 
                        className="w-10 h-10 rounded-full object-cover border border-slate-200 shadow-sm"
                        alt={record.userId?.name || "User"}
                    />
                    <div>
                        <p className="font-semibold text-slate-800 dark:text-slate-200">{record.userId?.name || "Unknown"}</p>
                        <p className="text-xs text-slate-500">{record.userId?.email || record.userId?.phone || "No Contact"}</p>
                    </div>
                </div>
            ) 
        },
        { 
            title: "Type",
            key: "type", 
            render: (_, record) => (
                <span className="capitalize px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-md text-xs font-medium">
                    {record.type}
                </span>
            )
        },
        { 
            title: "Feedback Text",
            key: "text", 
            render: (_, record) => (
                <div className="max-w-xs md:max-w-md lg:max-w-lg truncate dark:text-slate-300" title={record.text}>
                    {record.text}
                </div>
            )
        },
        { 
            title: "Source",
            key: "component_name", 
            render: (_, record) => <span className="text-xs text-slate-500 dark:text-slate-400">{record.component_name || "—"}</span>
        },
        { 
            title: "Status",
            key: "status", 
            render: (_, record) => {
                const status = record.status || "SUBMITTED";
                const isSubmitted = status === "SUBMITTED";
                const isReviewed = status === "REVIEWED";
                
                return (
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        isSubmitted ? "bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400" :
                        isReviewed ? "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400" :
                        "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400"
                    }`}>
                        {status.replace(/_/g, " ")}
                    </span>
                );
            } 
        },
        { 
            title: "Date",
            key: "createdAt", 
            render: (_, record) => (
                <span className="text-sm text-slate-600 dark:text-slate-400 whitespace-nowrap">
                    {moment(record.createdAt).format("MMM DD, YYYY HH:mm")}
                </span>
            ) 
        },
        {
            title: "Actions",
            key: "actions",
            render: (_, record) => (
                <div className="flex gap-2">
                    {record.status !== "REVIEWED" && record.status !== "APPRECIATED_BY_ADMIN" && (
                        <button 
                            onClick={() => onUpdateStatus(record._id, "REVIEWED")}
                            className="text-xs bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 px-2 py-1 rounded hover:bg-blue-100 dark:hover:bg-blue-900/30 font-medium transition-colors"
                        >
                            Mark Reviewed
                        </button>
                    )}
                    {record.status !== "APPRECIATED_BY_ADMIN" && (
                        <button 
                            onClick={() => onUpdateStatus(record._id, "APPRECIATED_BY_ADMIN")}
                            className="text-xs bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 px-2 py-1 rounded hover:bg-emerald-100 dark:hover:bg-emerald-900/30 font-medium transition-colors"
                        >
                            Appreciate
                        </button>
                    )}
                    <button 
                        onClick={() => onDelete(record._id)}
                        className="text-xs bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 px-2 py-1 rounded hover:bg-red-100 dark:hover:bg-red-900/30 font-medium transition-colors"
                    >
                        Delete
                    </button>
                </div>
            )
        }
    ], [onUpdateStatus, onDelete]);

    const handlePageChange = React.useCallback((page, pageSize) => {
        setFilters(prev => ({ ...prev, page, limit: pageSize }));
    }, [setFilters]);

    return (
        <div className="place-holder-table modern-table shadow-sm border border-slate-100 dark:border-slate-800 rounded overflow-hidden bg-white dark:bg-slate-900 transition-colors duration-300">
            <Table
                rowKey="_id"
                className="custom-ant-table"
                loading={{
                    spinning: isLoading,
                    indicator: <TableSkeleton rows={8} columns={7} />,
                }}
                columns={columns}
                dataSource={data}
                pagination={{
                    current: pagination?.currentPage || filters?.page || 1,
                    pageSize: pagination?.itemsPerPage || filters?.limit || 20,
                    total: pagination?.totalItems || 0,
                    showSizeChanger: true,
                    className: "px-4 pb-4",
                    onChange: handlePageChange,
                }}
            />
        </div>
    );
});

FeedbackList.displayName = "FeedbackList";

export default FeedbackList;
