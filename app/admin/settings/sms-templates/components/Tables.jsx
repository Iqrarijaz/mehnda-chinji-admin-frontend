"use client";
import { Pagination, Table } from "antd";
import React, { useState } from "react";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { FaEdit } from "react-icons/fa";
import Loading from "@/animations/homePageLoader";
import { Switch } from "antd";
import { useRouter } from "next/navigation";
import { timestampToDate } from "@/utils/date";
import { useMutation, useQueryClient } from "react-query";
import { toast } from "react-toastify";
import { CustomPopover } from "@/components/popHover";
import { popoverContent } from "@/components/popHover/popHoverContent";
import { PATH_ROUTER } from "@/routes";
import { MANAGE_CLIENT_STATUS } from "@/app/api/admin/clients";
import { useSMSTemplateContext } from "@/context/admin/settings/SmsTemplateContext";

function SMSTemplatesTable() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { smsTemplateListList, onChange, filters, setFilters } =
  useSMSTemplateContext();


  const manageStatusMutation = useMutation({
    mutationFn: async (data) => {
    //   return await MANAGE_CLIENT_STATUS(data);
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
    // const sortingKey = sorter.field;
    // const sortOrder = sorter.order === "ascend" ? 1 : -1;
    // setFilters((prevFilters) => ({
    //   ...prevFilters,
    //   sortingKey,
    //   sortOrder,
    // }));
  }
  // action menu
  const actionMenu = [
    
    {
      heading: "Edit",
      icon: <FaEdit size={16} />,
      handleFunction: (record) => {
        router.push(`${PATH_ROUTER?.EDIT_SMS_TEMPLATE}/${record._id}`);
      },
    },
  
  ];

  //  columns
  const columns = [
    {
      title: "Template Name",
      dataIndex: "templateName",
      key: "templateName",
      width: 200,
      render: (text) => (
        <div className="capitalize overflow-hidden flex-wrap">
          {text}
        </div>
      ),
    },
    {
      title: "Message Content",
      dataIndex: "messageContent",
      key: "messageContent",
      width: 250,
      render: (record) => (
        <div className="capitalize overflow-hidden flex-wrap">
          {record}
        </div>
      ),
    },
    {
        title: "Description",
        dataIndex: "description",
        key: "description",
        width: 200,
        render: (record) => (
          <div className=" overflow-hidden flex-wrap">
            {record}
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
      width: 90,
      align: "center",
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

  return (
    <>
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
          spinning:
            smsTemplateListList?.status === "loading" ||
            manageStatusMutation?.status === "loading",
          indicator: <Loading />,
        }}
        columns={columns}
        dataSource={smsTemplateListList?.data?.data}
        pagination={false}
        onChange={handleSorting}
      />
      <Pagination
        className="flex justify-end mt-4"
        pageSize={smsTemplateListList?.data?.pagination?.itemsPerPag}
        total={smsTemplateListList?.data?.pagination?.totalItems}
        curren={smsTemplateListList?.data?.pagination?.currentPage}
        onChange={(e) => {
          console.log("e", e);
          onChange({
            currentPage: Number(e),
          });
        }}
      />
    </>
  );
}

export default SMSTemplatesTable;
