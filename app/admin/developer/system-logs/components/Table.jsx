"use client";
import { Pagination, Table } from "antd";
import React, { useState } from "react";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { FaEdit } from "react-icons/fa";
import Loading from "@/animations/homePageLoader";
import { timestampToDateWithTime } from "@/utils/date";
import { CustomPopover } from "@/components/popHover";
import { popoverContent } from "@/components/popHover/popHoverContent";
import { useSystemLogsContext } from "@/context/admin/developers/SystemLogsContext";
import JsonViewerModal from "./JsonViewerModal";
import DeleteSystemLogsModal from "./DeleteModal";

function SystemLogsTable() {
  // State to manage modal visibility and data
  const [isModalOpen, setIsModalOpen] = useState({
    name: null,
    state: false,
    record: null,
  });

  // Accessing system logs data and state management functions from context
  const { systemLogsList, onChange } = useSystemLogsContext();

  // Function to handle sorting logic
  function handleSorting(pagination, sorter) {
    console.log("sorter", sorter, pagination);
  }

  // Action menu configuration
  const actionMenu = [
    {
      heading: "Delete",
      icon: <FaEdit size={16} />,
      // Function to open delete modal with selected record
      handleFunction: (record) => {
        setIsModalOpen({ name: "Delete", state: true, record });
      },
    },
  ];

  // Table columns configuration
  const columns = [
    {
      title: "Module Name",
      dataIndex: "moduleName",
      key: "moduleName",
      width: 150,
      // Render module name with overflow handling
      render: (record) => (
        <div className="capitalize overflow-hidden flex-wrap">{record}</div>
      ),
    },
    {
      title: "Method Name",
      dataIndex: "methodName",
      key: "methodName",
      width: 200,
      // Render method name with overflow handling
      render: (text) => (
        <div className="capitalize overflow-hidden flex-wrap">{text}</div>
      ),
    },
    {
      title: "Requested By",
      dataIndex: "createdBy",
      key: "createdBy",
      width: 250,
      // Render requested by email with overflow handling
      render: (record) => (
        <div className="overflow-hidden flex-nowrap">{record?.email}</div>
      ),
    },
    {
      title: "Request Body",
      dataIndex: "reqBody",
      key: "reqBody",
      align: "center",
      width: 200,
      // Render view link for request body if present, otherwise render placeholder
      render: (record) => (
        <>
          {record ? (
            <div
              onClick={() =>
                setIsModalOpen({ name: "Request Body", state: true, record })
              }
              className="cursor-pointer text-lightBlue underline"
            >
              View Request Data
            </div>
          ) : (
            <span>----</span>
          )}
        </>
      ),
    },
    {
      title: "Error Response",
      dataIndex: "error",
      key: "error",
      width: 200,
      // Render view link for error response if present, otherwise render placeholder
      render: (record) => (
        <>
          {record ? (
            <div
              onClick={() =>
                setIsModalOpen({ name: "Error Details", state: true, record })
              }
              className="cursor-pointer text-lightBlue underline"
            >
              View Error Details
            </div>
          ) : (
            <span>----</span>
          )}
        </>
      ),
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 220,
      // Render timestamp with date and time format
      render: (text) => (
        <div className="overflow-hidden whitespace-nowrap">
          {timestampToDateWithTime(text)}
        </div>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      width: 90,
      align: "center",
      // Render custom popover menu for actions
      render: (record) => (
        <CustomPopover
          triggerContent={
            <HiOutlineDotsHorizontal
              size={34}
              className="hover:text-lightBlue"
            />
          }
          popoverContent={() => popoverContent(actionMenu, record)}
        />
      ),
    },
  ];

  // Return JSX with Ant Design Table, Pagination, and Modals
  return (
    <>
      {/* Ant Design Table Component */}
      <Table
        responsive
        rowClassName={(record, index) =>
          index % 2 === 0 ? "table-row-light" : "table-row-dark"
        }
        className="antd-table-custom rounded-xl"
        size="small"
        tableLayout="fixed"
        bordered
        scroll={{ x: 700 }}
        loading={{
          spinning: systemLogsList?.status === "loading",
          indicator: <Loading />,
        }}
        columns={columns}
        dataSource={systemLogsList?.data?.data}
        pagination={false}
        onChange={handleSorting}
      />
      {/* Pagination Component */}
      <Pagination
        className="flex justify-end mt-4"
        pageSize={systemLogsList?.data?.pagination?.itemsPerPag}
        total={systemLogsList?.data?.pagination?.totalItems}
        current={systemLogsList?.data?.pagination?.currentPage}
        onChange={(e) => {
          onChange({
            currentPage: Number(e),
          });
        }}
      />
      {/* Modals */}
      <JsonViewerModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
      />
      <DeleteSystemLogsModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
      />
    </>
  );
}

export default SystemLogsTable;
