import {
  EditOutlined,
  DeleteOutlined,
  EllipsisOutlined,
  SettingOutlined
} from "@ant-design/icons";
import Loading from "@/animations/homePageLoader";
import { Switch, Menu, Dropdown, Button, Checkbox, Table } from "antd";
import { TableSkeleton } from "@/components/shared/Skeletons";
import { useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import { toast } from "react-toastify";
import { timestampToDate } from "@/utils/date";
import { DELETE_CATEGORY, UPDATE_CATEGORY_STATUS } from "@/app/api/admin/categories";
import ConfirmModal from "@/components/shared/ConfirmModal";
import { getTagColor } from "@/utils/tagColor";
import ColumnVisibilityDropdown from "@/components/InnerPage/ColumnVisibilityDropdown";

function CategoryTable({ modal, setModal, categoriesList, onChange, setFilters }) {
  const queryClient = useQueryClient();
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: "",
    description: "",
    onConfirm: null,
    variant: "primary",
    confirmText: "Confirm",
    cancelText: "Cancel"
  });

  // Column Visibility State
  const [visibleColumns, setVisibleColumns] = useState(["name_en", "name_ur", "type", "status", "createdAt", "actions"]);

  const closeConfirmModal = () => {
    setConfirmModal((prev) => ({ ...prev, isOpen: false }));
  };

  // Status mutation
  const manageStatusMutation = useMutation({
    mutationFn: UPDATE_CATEGORY_STATUS,
    onSuccess: (data) => {
      queryClient.invalidateQueries("categoriesList");
      toast.success(data?.message || "Status updated");
      closeConfirmModal();
    },
    onError: (error) => {
      toast.error(error?.response?.data?.error || "Failed to update status");
      closeConfirmModal();
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: DELETE_CATEGORY,
    onSuccess: (data) => {
      queryClient.invalidateQueries("categoriesList");
      toast.success(data?.message || "Category deleted");
      closeConfirmModal();
    },
    onError: (error) => {
      toast.error(error?.response?.data?.error || "Failed to delete category");
      closeConfirmModal();
    },
  });

  const handleStatus = (data) => {
    setConfirmModal({
      isOpen: true,
      title: 'Confirm Status Change',
      description: `Are you sure you want to ${data?.status ? 'deactivate' : 'activate'} this category?`,
      confirmText: 'Yes, Change',
      cancelText: 'No, Keep',
      variant: 'primary',
      onConfirm: () => manageStatusMutation.mutate({
        _id: data._id,
        status: !data.status
      })
    });
  };

  const handleDelete = (data) => {
    setConfirmModal({
      isOpen: true,
      title: 'Confirm Deletion',
      description: 'Are you sure you want to delete this category? This action cannot be undone.',
      confirmText: 'Yes, Delete',
      cancelText: 'Cancel',
      variant: 'danger',
      onConfirm: () => deleteMutation.mutate({
        _id: data._id,
      })
    });
  };

  const handleSorting = (pagination, filters, sorter) => {
    setFilters(prev => ({
      ...prev,
      sortingKey: sorter.field || "_id",
      sortOrder: sorter.order === "ascend" ? 1 : -1,
      currentPage: pagination.current,
    }));
  };

  const actionMenu = (record) => (
    <Menu className="!rounded-xl !p-2 !min-w-[140px] shadow-xl border border-slate-100">
      <Menu.Item
        key="edit"
        icon={<EditOutlined className="text-blue-500" />}
        onClick={() => setModal({
          name: "Update",
          data: record,
          state: true
        })}
        className="!rounded-lg hover:!bg-blue-50"
      >
        <span className="font-medium">Edit Category</span>
      </Menu.Item>
      <Menu.Divider className="!my-1" />
      <Menu.Item
        key="delete"
        icon={<DeleteOutlined className="text-red-500" />}
        onClick={() => handleDelete(record)}
        className="!rounded-lg hover:!bg-red-50"
      >
        <span className="font-medium text-red-600">Delete Category</span>
      </Menu.Item>
    </Menu>
  );

  const columnOptions = [
    { label: "Name (EN)", value: "name_en" },
    { label: "Name (UR)", value: "name_ur" },
    { label: "Type", value: "type" },
    { label: "Status", value: "status" },
    { label: "Created At", value: "createdAt" },
  ];


  const allColumns = [
    {
      title: "Name (English)",
      dataIndex: ["name", "en"],
      key: "name_en",
      sorter: true,
      width: 170,
      render: (en) => (
        <div className="capitalize font-bold text-slate-800 truncate text-xs">
          {en}
        </div>
      ),
    },
    {
      title: "Name (Urdu)",
      dataIndex: ["name", "ur"],
      key: "name_ur",
      width: 170,
      align: "left",
      sorter: true,
      render: (ur) => (
        <div className="text-right font-notoUrdu p-1 text-slate-600 font-medium truncate text-xs">
          {ur}
        </div>
      ),
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      width: 170,
      align: "center",
      sorter: true,
      render: (type) => (
        <span
          className="mr-0 text-[9px] px-2.5 py-0.5 rounded-full capitalize font-bold text-white shadow-sm"
          style={{ backgroundColor: getTagColor(type) }}
        >
          {type}
        </span>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      align: "center",
      width: 170,
      render: (status, record) => (
        <Switch
          checked={status}
          onChange={() => handleStatus(record)}
          className={status ? '!bg-[#006666]' : '!bg-slate-300'}
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
      render: (text) => <div className="text-slate-500 font-medium whitespace-nowrap text-xs">{timestampToDate(text)}</div>,
    },
    {
      title: "",
      key: "actions",
      width: 50,
      align: "right",
      render: (record) => (
        <Dropdown overlay={actionMenu(record)} trigger={["click"]} placement="bottomRight">
          <Button
            type="text"
            icon={<EllipsisOutlined className="text-lg rotate-90" />}
            className="!rounded-lg hover:!bg-slate-100 !flex items-center justify-center !h-8 !w-8 transition-all"
          />
        </Dropdown>
      ),
    }
  ];

  const activeColumns = allColumns.filter(col => col.key === "actions" || visibleColumns.includes(col.key));

  return (
    <div className="space-y-4">
      <div className="flex justify-end px-1">
        <ColumnVisibilityDropdown
          visibleColumns={visibleColumns}
          setVisibleColumns={setVisibleColumns}
          options={columnOptions}
        />
      </div>

      <div className="place-holder-table modern-table shadow-sm border border-slate-100 rounded-xl overflow-hidden bg-white">
        <Table
          rowKey="_id"
          className="custom-ant-table"
          scroll={{ x: 1200, y: 600 }}
          sticky={true}
          loading={{
            spinning: categoriesList?.status === "loading",
            indicator: <TableSkeleton rows={8} columns={5} />,
          }}
          columns={activeColumns}
          dataSource={categoriesList?.data?.data}
          pagination={{
            current: categoriesList?.data?.pagination?.currentPage,
            pageSize: categoriesList?.data?.pagination?.itemsPerPage,
            total: categoriesList?.data?.pagination?.totalItems,
            showSizeChanger: true,
            className: "px-4 pb-4",
            onChange: (page, pageSize) => onChange({ currentPage: Number(page), itemsPerPage: pageSize }),
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

export default CategoryTable;