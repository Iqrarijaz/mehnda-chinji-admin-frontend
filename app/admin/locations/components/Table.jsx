"use client";
import { Modal, Pagination, Table, Tag } from "antd";
import React, { useState } from "react";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { FaEdit, FaTrash } from "react-icons/fa";
import Loading from "@/animations/homePageLoader";
import { Switch } from "antd";
import { useMutation, useQueryClient } from "react-query";
import { toast } from "react-toastify";
import { CustomPopover } from "@/components/popHover";
import { timestampToDate } from "@/utils/date";
import { popoverContent } from "@/components/popHover/popHoverContent";
import { useLocationsContext } from "@/context/admin/locations/LocationsContext";
import { DELETE_LOCATION, UPDATE_LOCATION_STATUS } from "@/app/api/admin/locations";

function PageTable({ modal, setModal }) {
  const queryClient = useQueryClient();
  const { locationsList, onChange, setFilters } = useLocationsContext();
  const [deleteModalData, setDeleteModalData] = useState(null);

  // Status mutation
  const manageStatusMutation = useMutation({
    mutationFn: UPDATE_LOCATION_STATUS,
    onSuccess: (data) => {
      queryClient.invalidateQueries("locationsList");
      toast.success(data?.message);
    },
    onError: (error) => {
      toast.error(error?.response?.data?.error || "Failed to update status");
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: DELETE_LOCATION,
    onSuccess: (data) => {
      queryClient.invalidateQueries("locationsList");
      toast.success(data?.message);
      setDeleteModalData(null);
    },
    onError: (error) => {
      toast.error(error?.response?.data?.error || "Failed to delete location");
    },
  });

  const handleStatus = (data) => {
    Modal.confirm({
      title: 'Confirm Status Change',
      content: `Are you sure you want to ${data?.status ? 'deactivate' : 'activate'} this location?`,
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
      content: 'Are you sure you want to delete this location?',
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
        <div className="overflow-hidden whitespace-nowrap text-right font-notoUrdu mx-4">
          {name?.ur}
        </div>
      ),
    },

    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      width: 120,
      sorter: (a, b) => a.type.localeCompare(b.type),
      render: (type) => {
        const typeMap = {
          DISTRICT: { color: "red", label: "DISTRICT" },
          TEHSIL: { color: "blue", label: "TEHSIL" },
          VILLAGE: { color: "green", label: "VILLAGE" },
        };

        const tag = typeMap[type] || {
          color: "default",
          label: type || "UNKNOWN",
        };

        return (
          <Tag
            color={tag.color}
            className="capitalize whitespace-nowrap mx-4 text-sm"
          >
            {tag.label}
          </Tag>

        );
      },
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
        className="antd-table-custom rounded"
        size="small"
        tableLayout="fixed"
        bordered
        scroll={{ x: 1200 }}
        loading={{
          spinning: locationsList?.status === "loading",
          indicator: <Loading />,
        }}
        columns={columns}
        dataSource={locationsList?.data?.data}
        pagination={false}
        onChange={handleSorting}
      />

      <Pagination
        className="flex justify-end mt-4"
        pageSize={locationsList?.data?.pagination?.itemsPerPage}
        total={locationsList?.data?.pagination?.totalItems}
        current={locationsList?.data?.pagination?.currentPage}
        onChange={(page) => onChange({ currentPage: Number(page) })}
      />

    </>
  );
}

export default PageTable;