"use client";
import { Pagination, Table } from "antd";
import React, { useState } from "react";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { FaEdit } from "react-icons/fa";
import Loading from "@/animations/homePageLoader";
import { Switch } from "antd";
import { useRouter } from "next/navigation";
import { useTenantContext } from "@/context/admin/users/TenantContext";
import { timestampToDate } from "@/utils/date";
import { useMutation, useQueryClient } from "react-query";
import { toast } from "react-toastify";
import { CustomPopover } from "@/components/popHover";
import { popoverContent } from "@/components/popHover/popHoverContent";
import DeleteTenantModal from "./DeleteTenantModal";
import { MANAGE_TENANT_STATUS } from "@/app/api/admin/tenants";

function TenantTable() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { tenantList, onChange } = useTenantContext();

  const [isModalOpen, setIsModalOpen] = useState({
    name: null,
    state: false,
    record: null,
  });
  const [sorting, setSorting] = useState({
    field: "_id",
    order: "asc",
  });
  const manageStatusMutation = useMutation({
    mutationFn: async (data) => {
      return await MANAGE_TENANT_STATUS(data);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(["tenantList"]);
      toast.success(data?.message);
    },
    onError: (error) => {
      console.error("Error:", error?.message);
      toast.error(error?.response?.data?.error || error?.message);
    },
  });

  function handleStatus(data) {
    try {
      manageStatusMutation.mutate({ _id: data?._id });
    } catch (error) {
      console.log(error);
    }
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
        router.push(`/admin/users/tenants/edit/${record._id}`);
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
      title: "Tenant Name",
      dataIndex: "fullName",
      key: "fullName",
      sorter: true,
      render: (text) => (
        <div className="capitalize overflow-hidden whitespace-nowrap">
          {text}
        </div>
      ),
    },
    {
      title: "Tenant Email",
      dataIndex: "email",
      key: "email",
      sorter: true,
      render: (text) => (
        <div className="overflow-hidden whitespace-nowrap">{text}</div>
      ),
    },

    {
      title: "Tenant Phone",
      dataIndex: "phone",
      key: "phone",
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
      title: "State",
      dataIndex: "state",
      key: "state",
      render: (text) => (
        <div className="overflow-hidden whitespace-nowrap">
          {text?.length > 0 ? text : " ---- "}
        </div>
      ),
    },

    {
      title: "Country",
      dataIndex: "country",
      key: "country",
      render: (text) => (
        <div className="overflow-hidden whitespace-nowrap">{text}</div>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      align: "center",
      key: "status",
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
      render: (record) => (
        <div className="flex justify-center">
          <CustomPopover
            triggerContent={
              <div className="p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer">
                <HiOutlineDotsHorizontal
                  size={20}
                  className="text-gray-500 hover:text-teal-600"
                />
              </div>
            }
            popoverContent={() => popoverContent(actionMenu, record)}
          />
        </div>
      ),
    },
  ];

  return (
    <>
      <Table
        responsive
        className="antd-table-custom w-full"
        size="middle"
        tableLayout="fixed"
        loading={{
          spinning:
            tenantList?.status === "loading" ||
            manageStatusMutation?.status === "loading",
          indicator: <Loading />,
        }}
        columns={columns}
        dataSource={tenantList?.data?.data}
        pagination={false}
      />
      <Pagination
        className="flex justify-end mt-4"
        pageSize={tenantList?.data?.pagination?.itemsPerPag}
        total={tenantList?.data?.pagination?.totalItems}
        curren={tenantList?.data?.pagination?.currentPage}
        onChange={(e) => {
          console.log("e", e);
          onChange({
            currentPage: Number(e),
          });
        }}
      />
      <DeleteTenantModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
      />
    </>
  );
}

export default TenantTable;
