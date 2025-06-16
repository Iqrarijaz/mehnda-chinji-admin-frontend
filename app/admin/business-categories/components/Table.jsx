"use client";
import { Modal, Pagination, Table } from "antd";
import React, { useState } from "react";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { FaEdit, FaTrash } from "react-icons/fa";
import Loading from "@/animations/homePageLoader";
import { Switch } from "antd";
import { useMutation, useQueryClient } from "react-query";
import { toast } from "react-toastify";
import { CustomPopover } from "@/components/popHover";
import { useBusinessCategoriesContext } from "@/context/admin/business-categories/BusinessCategoriesContext";
import { timestampToDate } from "@/utils/date";
import { DELETE_BUSINESS_CATEGORY, UPDATE_BUSINESS_CATEGORY_STATUS } from "@/app/api/admin/business-categories";
import { popoverContent } from "@/components/popHover/popHoverContent";

function BusinessCategoryTable({ modal, setModal }) {
  const queryClient = useQueryClient();
  const { businessCategoriesList, onChange, setFilters } = useBusinessCategoriesContext();
  const [deleteModalData, setDeleteModalData] = useState(null);

  // Status mutation
  const manageStatusMutation = useMutation({
    mutationFn: UPDATE_BUSINESS_CATEGORY_STATUS,
    onSuccess: (data) => {
      queryClient.invalidateQueries("businessCategoriesList");
      toast.success(data?.message);
    },
    onError: (error) => {
      toast.error(error?.response?.data?.error || "Failed to update status");
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: DELETE_BUSINESS_CATEGORY,
    onSuccess: (data) => {
      queryClient.invalidateQueries("businessCategoriesList");
      toast.success(data?.message);
      setDeleteModalData(null);
    },
    onError: (error) => {
      toast.error(error?.response?.data?.error || "Failed to delete category");
    },
  });

  const handleStatus = (data) => {
    Modal.confirm({
      title: 'Confirm Status Change',
      content: `Are you sure you want to ${data?.status ? 'deactivate' : 'activate'} this category?`,
      okText: 'Yes',
      cancelText: 'No',
      centered: true,
      onOk: () => manageStatusMutation.mutate({
        _id: data._id,
        status: !data.status
      })
    });
  };

  const handleDelete = (data) => {
    Modal.confirm({
      title: 'Confirm Deletion',
      content: 'Are you sure you want to delete this category?',
      okText: 'Yes',
      cancelText: 'No',
      centered: true,
      onOk: () => deleteMutation.mutate({
        _id: data._id,
      })
    })
  };


  const handleSorting = (pagination, filters, sorter) => {
    setFilters(prev => ({
      ...prev,
      sortingKey: sorter.field,
      sortOrder: sorter.order === "ascend" ? 1 : -1
    }));
  };

  const actionMenu = [
    {
      heading: "Edit",
      icon: <FaEdit size={16} />,
      handleFunction: (record) => setModal({
        name: "Update",
        data: record,
        state: true
      }),
    },
    {
      heading: "Delete",
      icon: <FaTrash size={16} />,
      handleFunction: (record) => handleDelete(record),
    },
  ];

  const columns = [
    {
      title: "Name (English)",
      dataIndex: "name",
      key: "name_en",
      sorter: (a, b) => a.name.en.localeCompare(b.name.en),
      width: 200,
      render: (name) => (
        <div className="capitalize overflow-hidden whitespace-nowrap">
          {name?.en}
        </div>
      ),
    },
    {
      title: "Name (Urdu)",
      dataIndex: "name",
      key: "name_ur",
      width: 200,
      align: "left",
      sorter: (a, b) => a.name.ur.localeCompare(b.name.ur),
      render: (name) => (
        <div className="overflow-hidden whitespace-nowrap text-right font-notoUrdu">
          {name?.ur}
        </div>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      align: "center",
      width: 120,
      render: (status, record) => (
        <Switch
          checked={status}
          onChange={() => handleStatus(record)}
          className={status ? '' : 'ant-switch-red'}
        />
      ),
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 180,
      render: (text) => <div className="whitespace-nowrap">{timestampToDate(text)}</div>,
    },
    {
      title: "Actions",
      key: "actions",
      width: 100,
      align: "center",
      render: (record) => (
        <CustomPopover
          triggerContent={
            <HiOutlineDotsHorizontal
              size={28}
              className="hover:text-secondary cursor-pointer"
            />
          }
          popoverContent={() => popoverContent(actionMenu, record)}
        />
      ),
    }
  ];

  return (
    <>
      <Table
        rowKey="_id"
        className="antd-table-custom rounded-xl"
        size="small"
        tableLayout="fixed"
        bordered
        scroll={{ x: 1200 }}
        loading={{
          spinning: businessCategoriesList?.status === "loading",
          indicator: <Loading />,
        }}
        columns={columns}
        dataSource={businessCategoriesList?.data?.data}
        pagination={false}
        onChange={handleSorting}
      />

      <Pagination
        className="flex justify-end mt-4"
        pageSize={businessCategoriesList?.data?.pagination?.itemsPerPage}
        total={businessCategoriesList?.data?.pagination?.totalItems}
        current={businessCategoriesList?.data?.pagination?.currentPage}
        onChange={(page) => onChange({ currentPage: Number(page) })}
      />

    </>
  );
}

export default BusinessCategoryTable;