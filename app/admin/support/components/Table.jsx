"use client";
import { Pagination, Table, Tag, Tooltip } from "antd";
import React from "react";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { FaEye, FaReply } from "react-icons/fa";
import Loading from "@/animations/homePageLoader";
import { timestampToDate } from "@/utils/date";
import { CustomPopover } from "@/components/popHover";
import { popoverContent } from "@/components/popHover/popHoverContent";

const getTicketStatusColor = (status) => {
    switch (status) {
        case "open": return "orange";
        case "in-progress": return "blue";
        case "closed": return "green";
        default: return "default";
    }
};

function SupportTable({ modal, setModal, ticketsList, onChange }) {

    const actionMenu = [
        {
            heading: "View & Manage",
            icon: <FaReply size={16} />,
            handleFunction: (record) => setModal({
                name: "Manage",
                data: record,
                state: true
            }),
        },
    ];

    const columns = [
        {
            title: "Ticket ID",
            dataIndex: "ticketId",
            key: "ticketId",
            width: 120,
            render: (text) => <span className="font-mono font-bold text-primary">{text}</span>,
        },
        {
            title: "User",
            dataIndex: "userId",
            key: "userId",
            width: 180,
            render: (user) => (
                <div className="flex flex-col">
                    <span className="font-semibold">{user?.name}</span>
                    <span className="text-xs text-gray-500">{user?.phoneNumber}</span>
                </div>
            ),
        },
        {
            title: "Subject",
            dataIndex: "subject",
            key: "subject",
            width: 250,
            render: (subject) => (
                <div className="overflow-hidden whitespace-nowrap text-ellipsis max-w-[200px]" title={subject}>
                    {subject}
                </div>
            ),
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            align: "center",
            width: 120,
            render: (status) => {
                const colors = {
                    "open": "#f97316", // orange-500
                    "in-progress": "#3b82f6", // blue-500
                    "closed": "#22c55e", // green-500
                };
                return (
                    <span
                        className="mr-0 text-[10px] px-2 py-1 rounded capitalize font-semibold text-white inline-block"
                        style={{ backgroundColor: colors[status] || "#94a3b8" }}
                    >
                        {status.replace("-", " ")}
                    </span>
                );
            },
        },
        {
            title: "Created At",
            dataIndex: "createdAt",
            key: "createdAt",
            width: 150,
            render: (text) => <div className="whitespace-nowrap">{timestampToDate(text)}</div>,
        },
        {
            title: "Actions",
            key: "actions",
            width: 80,
            align: "center",
            render: (record) => (
                <div className="flex items-center justify-center">
                    <CustomPopover
                        triggerContent={
                            <HiOutlineDotsHorizontal
                                size={28}
                                className="hover:text-secondary cursor-pointer"
                            />
                        }
                        popoverContent={() => popoverContent(actionMenu, record)}
                    />
                </div>
            ),
        }
    ];

    return (
        <>
            <Table
                rowKey="_id"
                className="antd-table-custom rounded"
                size="small"
                tableLayout="fixed"
                bordered
                scroll={{ x: 800 }}
                loading={{
                    spinning: ticketsList?.isLoading,
                    indicator: <Loading />,
                }}
                columns={columns}
                dataSource={ticketsList?.data?.data?.tickets}
                pagination={false}
            />

            <Pagination
                className="flex justify-end mt-4"
                pageSize={ticketsList?.data?.data?.pagination?.limit}
                total={ticketsList?.data?.data?.pagination?.total}
                current={ticketsList?.data?.data?.pagination?.page}
                onChange={(page) => onChange({ page: Number(page) })}
            />
        </>
    );
}

export default SupportTable;
