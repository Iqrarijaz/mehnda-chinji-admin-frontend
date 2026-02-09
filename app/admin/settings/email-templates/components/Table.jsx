"use client";
import { Pagination, Table, Switch, Tag } from "antd";
import React, { useState } from "react";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { FaEdit, FaTrash } from "react-icons/fa";
import Loading from "@/animations/homePageLoader";
import { useRouter } from "next/navigation";
import { timestampToDate } from "@/utils/date";
import { useMutation, useQueryClient } from "react-query";
import { toast } from "react-toastify";
import { CustomPopover } from "@/components/popHover";
import { popoverContent } from "@/components/popHover/popHoverContent";
import { PATH_ROUTER } from "@/routes";
import { useEmailTemplateContext } from "@/context/admin/settings/EmailTemplateContext";
import { UPDATE_EMAIL_TEMPLATE_STATUS, DELETE_EMAIL_TEMPLATE } from "@/app/api/admin/settings/emailTemplates";
import ConfirmModal from "@/components/shared/ConfirmModal";

function EmailTemplatesTable() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { emailTemplatesList, onChange, filters } = useEmailTemplateContext();

  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: '',
    description: '',
    confirmText: '',
    cancelText: '',
    variant: 'primary',
    onConfirm: null
  });

  const closeConfirmModal = () => {
    setConfirmModal(prev => ({ ...prev, isOpen: false }));
  };

  // Status toggle mutation
  const manageStatusMutation = useMutation({
    mutationFn: async (data) => {
      return await UPDATE_EMAIL_TEMPLATE_STATUS(data);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(["emailTemplatesList"]);
      toast.success(data?.message || "Status updated successfully");
      closeConfirmModal();
    },
    onError: (error) => {
      console.error("Error:", error);
      toast.error(error?.response?.data?.message || "Failed to update status");
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (data) => {
      return await DELETE_EMAIL_TEMPLATE(data);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(["emailTemplatesList"]);
      toast.success(data?.message || "Template deleted successfully");
      closeConfirmModal();
    },
    onError: (error) => {
      console.error("Error:", error);
      toast.error(error?.response?.data?.message || "Failed to delete template");
    },
  });

  const handleStatus = (record) => {
    const newStatus = record.status === "active" ? "inactive" : "active";
    setConfirmModal({
      isOpen: true,
      title: 'Confirm Status Change',
      description: `Are you sure you want to ${record.status === "active" ? 'deactivate' : 'activate'} "${record.templateName}"?`,
      confirmText: 'Yes, Change',
      cancelText: 'No, Keep',
      variant: 'primary',
      onConfirm: () => manageStatusMutation.mutate({ _id: record._id })
    });
  };

  const handleDelete = (record) => {
    setConfirmModal({
      isOpen: true,
      title: 'Confirm Deletion',
      description: `Are you sure you want to delete "${record.templateName}"? This action cannot be undone.`,
      confirmText: 'Yes, Delete',
      cancelText: 'Cancel',
      variant: 'danger',
      onConfirm: () => deleteMutation.mutate({ _id: record._id })
    });
  };

  const actionMenu = [
    {
      heading: "Edit",
      icon: <FaEdit size={16} />,
      handleFunction: (record) => {
        router.push(`${PATH_ROUTER?.EDIT_EMAIL_TEMPLATE}/${record._id}`);
      },
    },
    {
      heading: "Delete",
      icon: <FaTrash size={16} />,
      handleFunction: (record) => handleDelete(record),
    },
  ];

  const columns = [
    {
      title: "Template Name",
      dataIndex: "templateName",
      key: "templateName",
      width: 180,
      render: (text) => (
        <div className="capitalize font-medium text-gray-800">
          {text}
        </div>
      ),
    },
    {
      title: "Subject",
      dataIndex: "template",
      key: "subject",
      width: 200,
      render: (template) => (
        <div className="text-gray-600 truncate">
          {template?.subject || "-"}
        </div>
      ),
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      width: 200,
      render: (text) => (
        <div className="text-gray-600 truncate">
          {text || "-"}
        </div>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 100,
      align: "center",
      render: (status, record) => (
        <Switch
          checked={status === "active"}
          onChange={() => handleStatus(record)}
          className={status === "active" ? '' : 'ant-switch-red'}
        />
      ),
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 120,
      render: (text) => (
        <div className="text-gray-500 text-sm">
          {timestampToDate(text)}
        </div>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      fixed: "right",
      width: 80,
      align: "center",
      render: (record) => (
        <CustomPopover
          triggerContent={
            <HiOutlineDotsHorizontal
              size={28}
              className="hover:text-blue-500 cursor-pointer"
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
        rowKey="_id"
        className="antd-table-custom rounded"
        size="small"
        tableLayout="fixed"
        bordered
        scroll={{ x: 800 }}
        loading={{
          spinning: emailTemplatesList?.isLoading || manageStatusMutation?.isLoading || deleteMutation?.isLoading,
          indicator: <Loading />,
        }}
        columns={columns}
        dataSource={emailTemplatesList?.data?.data || []}
        pagination={false}
      />

      <Pagination
        className="flex justify-end mt-4"
        pageSize={filters.limit}
        total={emailTemplatesList?.data?.pagination?.totalItems || 0}
        current={filters.page}
        onChange={(page, pageSize) => onChange({ page, limit: pageSize })}
      />

      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={closeConfirmModal}
        onConfirm={confirmModal.onConfirm}
        title={confirmModal.title}
        description={confirmModal.description}
        confirmText={confirmModal.confirmText}
        cancelText={confirmModal.cancelText}
        variant={confirmModal.variant}
        loading={manageStatusMutation.isLoading || deleteMutation.isLoading}
      />
    </>
  );
}

export default EmailTemplatesTable;
