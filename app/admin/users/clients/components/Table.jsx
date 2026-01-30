"use client";
import { Pagination, Table } from "antd";
import React, { useState } from "react";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { FaEdit } from "react-icons/fa";
import Loading from "@/animations/homePageLoader";
import { Switch } from "antd";
import { useRouter } from "next/navigation";
import { useClientContext } from "@/context/admin/users/ClientContext";
import { timestampToDate } from "@/utils/date";
import { useMutation, useQueryClient } from "react-query";
import { toast } from "react-toastify";
import { CustomPopover } from "@/components/popHover";
import { popoverContent } from "@/components/popHover/popHoverContent";
import DeleteClientModal from "./DeleteModal";
import { PATH_ROUTER } from "@/routes";
import { MANAGE_CLIENT_STATUS } from "@/app/api/admin/clients";

function ClientTable() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { clientsList, onChange } = useClientContext();

  const [isModalOpen, setIsModalOpen] = useState({
    name: null,
    state: false,
    record: null,
  });
  const manageStatusMutation = useMutation({
    mutationFn: async (data) => {
      return await MANAGE_CLIENT_STATUS(data);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(["clientsList"]);
      toast.success(data?.message);
    },
    onError: (error) => {
      console.error("Error:", error);
      toast.error(error?.response?.data?.error);
    },
  });

  function handleStatus(data) {
    try {
      manageStatusMutation.mutate({ _id: data?._id });
    } catch (error) {
      console.log(error);
    }
  }

  function handleSorting(pagination, sorter) {
    console.log("sorter", sorter, pagination);
  }
  // action menu
  const actionMenu = [
    {
      heading: "View",
      icon: <HiOutlineDotsHorizontal size={16} />,
      handleFunction: (record) => {
        router.push(`/admin/users/clients/view/${record._id}`);
      },
    },
    {
      heading: "Edit",
      icon: <FaEdit size={16} />,
      handleFunction: (record) => {
        router.push(`/admin/users/clients/edit/${record._id}`);
      },
    },
    {
      heading: "Delete",
      icon: <FaEdit size={16} />,
      handleFunction: (record) => {
        setIsModalOpen({ name: "delete", state: true, record });
      },
    },
  ];

  //  columns
  const columns = [
    {
      title: "Company Name",
      dataIndex: "companyName",
      key: "companyName",
      width: 200,
      render: (text) => (
        <div className="capitalize overflow-hidden whitespace-nowrap">
          {text}
        </div>
      ),
    },
    {
      title: "Contact Name",
      dataIndex: "fullName",
      key: "fullName",
      sorter: true,
      width: 200,
      render: (text) => (
        <div className="capitalize overflow-hidden whitespace-nowrap">
          {text}
        </div>
      ),
    },
    {
      title: "Contact Email",
      dataIndex: "email",
      key: "email",
      sorter: true,
      width: 280,
      render: (text) => (
        <div className="overflow-hidden whitespace-nowrap">{text}</div>
      ),
    },
    {
      title: "Buildings",
      dataIndex: "buildings",
      key: "buildings",
      width: 260,
      align: "center",
      render: (record) => (
        <div className="overflow-hidden whitespace-nowrap flex flex-col">
          {record?.length > 0
            ? record.map((item) => (
              <div
                key={item?._id}
                className="capitalize p-1 cursor-pointer text-lightBlue underline"
                onClick={() => {
                  router.push(`${PATH_ROUTER.VIEW_BUILDING}/${item?._id}`);
                }}
              >
                {item?.name}
              </div>
            ))
            : " ---- "}
        </div>
      ),
    },
    {
      title: "Contact Phone",
      dataIndex: "phone",
      key: "phone",
      width: 160,
      render: (text) => {
        const formattedPhone = text.replace(
          /(\d{3})(\d{3})(\d{4})/,
          "$1-$2-$3"
        );
        return (
          <div className="overflow-hidden whitespace-nowrap">
            {formattedPhone}
          </div>
        );
      },
    },
    {
      title: "Public Email",
      dataIndex: "publicEmail",
      key: "publicEmail",
      width: 260,
      render: (text) => (
        <div className="overflow-hidden whitespace-nowrap">
          {text?.length > 0 ? text : " ---- "}
        </div>
      ),
    },
    {
      title: "Public Phone",
      dataIndex: "publicPhone",
      key: "publicPhone",
      width: 160,
      render: (text) => {
        const formattedPhone = text?.replace(
          /(\d{3})(\d{3})(\d{4})/,
          "$1-$2-$3"
        );
        return (
          <div className="overflow-hidden whitespace-nowrap">
            {formattedPhone ?? " ---- "}
          </div>
        );
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      align: "center",
      key: "status",
      width: 100,
      render: (text, record) => (
        <div className="flex justify-center">
          {text === "ACTIVE" ? (
            <Switch checked={true} onClick={() => handleStatus(record)} />
          ) : (
            <Switch
              onClick={() => handleStatus(record)}
              checked={false}
              style={{ backgroundColor: "red" }}
            />
          )}
        </div>
      ),
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 120,
      render: (text) => (
        <div className="overflow-hidden whitespace-nowrap">
          {timestampToDate(text)}
        </div>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      fixed: "right",
      width: 100,
      align: "center",
      render: (record) => (
        <CustomPopover
          triggerContent={
            <HiOutlineDotsHorizontal
              size={34}
              className="hover:text-lightBlue"
            />
          }
          popoverContent={() => popoverContent(actionMenu, record)} // pass record to popoverContent
        />
      ),
    },
  ];

  return (
    <>
      <Table
        responsive
        rowClassName={(record, index) =>
          index % 2 === 0 ? "table-row-light" : "table-row-dark"
        }
        className="antd-table-custom rounded"
        size="small"
        tableLayout="fixed"
        bordered
        scroll={{ x: 1700 }}
        loading={{
          spinning:
            clientsList?.status === "loading" ||
            manageStatusMutation?.status === "loading",
          indicator: <Loading />,
        }}
        columns={columns}
        dataSource={clientsList?.data?.data}
        pagination={false}
        onChange={handleSorting}
      />
      <Pagination
        className="flex justify-end mt-4"
        pageSize={clientsList?.data?.pagination?.itemsPerPag}
        total={clientsList?.data?.pagination?.totalItems}
        curren={clientsList?.data?.pagination?.currentPage}
        onChange={(e) => {
          console.log("e", e);
          onChange({
            currentPage: Number(e),
          });
        }}
      />
      <DeleteClientModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
      />
    </>
  );
}

export default ClientTable;
