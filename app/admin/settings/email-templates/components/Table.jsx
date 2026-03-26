import {
  EditOutlined,
  DeleteOutlined,
  MoreOutlined,
  SettingOutlined,
  MailOutlined
} from "@ant-design/icons";
import Loading from "@/animations/homePageLoader";
import { useRouter } from "next/navigation";
import { timestampToDate } from "@/utils/date";
import { useMutation, useQueryClient } from "react-query";
import { toast } from "react-toastify";
import { PATH_ROUTER } from "@/routes";
import { UPDATE_EMAIL_TEMPLATE_STATUS, DELETE_EMAIL_TEMPLATE } from "@/app/api/admin/settings/emailTemplates";
import ConfirmModal from "@/components/shared/ConfirmModal";
import { Pagination, Table, Switch, Tag, Menu, Dropdown, Button, Checkbox, Tooltip } from "antd";
import { TableSkeleton } from "@/components/shared/Skeletons";
import { useState } from "react";

function EmailTemplatesTable({ emailTemplatesList, onChange, filters }) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: '',
    description: '',
    confirmText: '',
    cancelText: '',
    variant: 'primary',
    onConfirm: null
  });

  // Column Visibility State
  const [visibleColumns, setVisibleColumns] = useState(["templateName", "subject", "description", "status", "createdAt", "actions"]);

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
      toast.error(error?.response?.data?.message || "Failed to delete template");
    },
  });

  const handleStatus = (record) => {
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

  const handleSorting = (pagination, filters, sorter) => {
    onChange({
      ...filters,
      sortingKey: sorter.field || "templateName",
      sortOrder: sorter.order === "ascend" ? 1 : -1,
      page: pagination.current,
    });
  };

  const actionMenu = (record) => ({
    items: [
      {
        key: "edit",
        label: <span className="font-medium">Edit Template</span>,
        icon: <EditOutlined className="text-[#006666]" />,
        onClick: () => {
          router.push(`${PATH_ROUTER?.EDIT_EMAIL_TEMPLATE}/${record._id}`);
        },
        className: "!rounded hover:!bg-blue-50",
      },
      {
        type: "divider",
        className: "!my-1",
      },
      {
        key: "delete",
        label: <span className="font-medium text-red-600">Delete Template</span>,
        icon: <DeleteOutlined className="text-red-500" />,
        onClick: () => handleDelete(record),
        className: "!rounded hover:!bg-red-50",
      },
    ],
    className: "!rounded !p-2 !min-w-[140px] shadow-xl border border-slate-100",
  });

  const columnOptions = [
    { label: "Template Name", value: "templateName" },
    { label: "Subject", value: "subject" },
    { label: "Description", value: "description" },
    { label: "Status", value: "status" },
    { label: "Created At", value: "createdAt" },
  ];

  const visibilityMenu = {
    items: columnOptions.map(opt => ({
      key: opt.value,
      label: (
        <Checkbox value={opt.value} className="font-medium text-slate-700 w-full" onClick={(e) => e.stopPropagation()}>
          {opt.label}
        </Checkbox>
      ),
      className: "!bg-transparent !cursor-default hover:!bg-slate-50 !rounded !py-1",
    })),
    // Wrap with Checkbox.Group logic using _menuWrapper if needed, but Antd 5 items are cleaner.
    // However, since it's a Checkbox.Group, we might need to use dropdownRender.
    // Let's try to keep the Checkbox.Group as a label item or use dropdownRender.
  };

  const visibilityDropdown = (
    <div className="bg-white !rounded !p-3 shadow-xl border border-slate-100 min-w-[180px]">
      <div className="px-2 pb-2 mb-2 border-b border-slate-100 text-xs font-bold text-slate-400 uppercase tracking-wider">
        Toggle Columns
      </div>
      <Checkbox.Group
        value={visibleColumns}
        onChange={setVisibleColumns}
        className="flex flex-col gap-2"
      >
        {columnOptions.map(opt => (
          <div key={opt.value} className="hover:bg-slate-50 rounded py-1 px-2 transition-colors">
            <Checkbox value={opt.value} className="font-medium text-slate-700 w-full">
              {opt.label}
            </Checkbox>
          </div>
        ))}
      </Checkbox.Group>
    </div>
  );

  const allColumns = [
    {
      title: "Template Name",
      dataIndex: "templateName",
      key: "templateName",
      width: 200,
      sorter: true,
      render: (text) => (
        <div className="capitalize font-bold text-slate-800 tracking-tight flex items-center gap-2">
          <MailOutlined className="text-slate-400 text-xs" />
          {text}
        </div>
      ),
    },
    {
      title: "Subject",
      dataIndex: "template",
      key: "subject",
      width: 250,
      render: (template) => (
        <Tooltip title={template?.subject} placement="topLeft">
          <div className="text-slate-600 font-medium truncate cursor-help">
            {template?.subject || "—"}
          </div>
        </Tooltip>
      ),
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      width: 250,
      render: (text) => (
        <Tooltip title={text} placement="topLeft">
          <div className="text-slate-500 font-medium truncate cursor-help">
            {text || "—"}
          </div>
        </Tooltip>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 170,
      align: "center",
      sorter: true,
      render: (status, record) => (
        <Switch
          checked={status === "active"}
          onChange={() => handleStatus(record)}
          className={status === "active" ? '!bg-[#006666]' : '!bg-slate-300'}
          size="small"
        />
      ),
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 170,
      sorter: true,
      render: (text) => <div className="text-slate-500 font-medium whitespace-nowrap">{timestampToDate(text)}</div>,
    },
    {
      title: "",
      key: "actions",
      width: 60,
      align: "right",
      render: (record) => (
        <Dropdown menu={actionMenu(record)} trigger={["click"]} placement="bottomRight">
          <Button
            type="text"
            icon={<MoreOutlined className="text-lg" />}
            className="!rounded hover:!bg-slate-100 !flex items-center justify-center !h-8 !w-8 transition-all"
          />
        </Dropdown>
      ),
    },
  ];

  const activeColumns = allColumns.filter(col => col.key === "actions" || visibleColumns.includes(col.key));

  return (
    <div className="space-y-4">
      <div className="flex justify-end px-1">
        <Dropdown dropdownRender={() => visibilityDropdown} trigger={['click']}>
          <Button
            icon={<SettingOutlined />}
            className="!rounded !h-[42px] !px-4 !border-slate-200 !text-slate-600 font-semibold hover:!border-[#006666] hover:!text-[#006666] flex items-center gap-2"
          >
            Columns
          </Button>
        </Dropdown>
      </div>

      <div className="modern-table shadow-sm border border-slate-100 rounded overflow-hidden bg-white">
        <Table
          rowKey="_id"
          className="custom-ant-table"
          scroll={{ x: 1200, y: 600 }}
          sticky={true}
          loading={{
            spinning: emailTemplatesList?.isLoading || manageStatusMutation?.isLoading || deleteMutation?.isLoading,
            indicator: <TableSkeleton rows={8} columns={5} />,
          }}
          columns={activeColumns}
          dataSource={emailTemplatesList?.data?.data || []}
          pagination={{
            current: filters.page,
            pageSize: filters.limit,
            total: emailTemplatesList?.data?.pagination?.totalItems || 0,
            showSizeChanger: true,
            className: "px-4 pb-4",
            onChange: (page, pageSize) => onChange({ page, limit: pageSize }),
          }}
          onChange={handleSorting}
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
      </div>
    </div>
  );
}

export default EmailTemplatesTable;
