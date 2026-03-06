import {
  EditOutlined,
  DeleteOutlined,
  MoreOutlined,
  SettingOutlined
} from "@ant-design/icons";
import Loading from "@/animations/homePageLoader";
import { useMutation, useQueryClient } from "react-query";
import { toast } from "react-toastify";
import { timestampToDate } from "@/utils/date";
import { DELETE_LOCATION, UPDATE_LOCATION_STATUS } from "@/app/api/admin/locations";
import { Modal, Pagination, Table, Tag, Switch, Menu, Dropdown, Button, Checkbox } from "antd";
import { TableSkeleton } from "@/components/shared/Skeletons";
import { useState } from "react";

function PageTable({ modal, setModal, locationsList, onChange, setFilters }) {
  const queryClient = useQueryClient();
  const [deleteModalData, setDeleteModalData] = useState(null);

  // Column Visibility State
  const [visibleColumns, setVisibleColumns] = useState(["name_en", "name_ur", "type", "status", "actions"]);

  // Status mutation
  const manageStatusMutation = useMutation({
    mutationFn: UPDATE_LOCATION_STATUS,
    onSuccess: (data) => {
      queryClient.invalidateQueries("locationsList");
      toast.success(data?.message || "Status updated");
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
      toast.success(data?.message || "Location deleted");
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
      okText: 'Yes, Confirm',
      cancelText: 'Cancel',
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
      content: 'Are you sure you want to delete this location? This action cannot be undone.',
      okText: 'Yes, Delete',
      cancelText: 'Cancel',
      variant: 'danger',
      centered: true,
      onOk: () => deleteMutation.mutate({
        _id: data._id,
      })
    })
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
        <span className="font-medium">Edit Location</span>
      </Menu.Item>
      <Menu.Divider className="!my-1" />
      <Menu.Item
        key="delete"
        icon={<DeleteOutlined className="text-red-500" />}
        onClick={() => handleDelete(record)}
        className="!rounded-lg hover:!bg-red-50"
      >
        <span className="font-medium text-red-600">Delete Location</span>
      </Menu.Item>
    </Menu>
  );

  const columnOptions = [
    { label: "Name (EN)", value: "name_en" },
    { label: "Name (UR)", value: "name_ur" },
    { label: "Type", value: "type" },
    { label: "Status", value: "status" },
  ];

  const visibilityMenu = (
    <Menu className="!rounded-xl !p-3 shadow-xl border border-slate-100 min-w-[180px]">
      <div className="px-2 pb-2 mb-2 border-b border-slate-100 text-xs font-bold text-slate-400 uppercase tracking-wider">
        Toggle Columns
      </div>
      <Checkbox.Group
        value={visibleColumns}
        onChange={setVisibleColumns}
        className="flex flex-col gap-2"
      >
        {columnOptions.map(opt => (
          <Menu.Item key={opt.value} className="!bg-transparent !cursor-default hover:!bg-slate-50 !rounded-lg !py-1">
            <Checkbox value={opt.value} className="font-medium text-slate-700 w-full">
              {opt.label}
            </Checkbox>
          </Menu.Item>
        ))}
      </Checkbox.Group>
    </Menu>
  );

  const allColumns = [
    {
      title: "Name (English)",
      dataIndex: ["name", "en"],
      key: "name_en",
      sorter: true,
      width: 150,
      render: (en) => (
        <div className="capitalize font-bold text-slate-800 truncate">
          {en}
        </div>
      ),
    },
    {
      title: "Name (Urdu)",
      dataIndex: ["name", "ur"],
      key: "name_ur",
      width: 150,
      align: "left",
      sorter: true,
      render: (ur) => (
        <div className="text-right font-notoUrdu p-2 text-slate-600 font-medium truncate mx-4">
          {ur}
        </div>
      ),
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      width: 120,
      sorter: true,
      render: (type) => {
        const typeMap = {
          DISTRICT: { color: "blue", label: "DISTRICT" },
          TEHSIL: { color: "cyan", label: "TEHSIL" },
          VILLAGE: { color: "green", label: "VILLAGE" },
        };

        const tag = typeMap[type] || {
          color: "default",
          label: type || "UNKNOWN",
        };

        return (
          <Tag
            color={tag.color}
            className="capitalize rounded-full font-bold px-3 py-0.5 border-none shadow-sm text-[11px]"
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
      width: 100,
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
      title: "",
      key: "actions",
      width: 60,
      align: "right",
      render: (record) => (
        <Dropdown overlay={actionMenu(record)} trigger={["click"]} placement="bottomRight">
          <Button
            type="text"
            icon={<MoreOutlined className="text-lg" />}
            className="!rounded-xl hover:!bg-slate-100 !flex items-center justify-center !h-10 !w-10"
          />
        </Dropdown>
      ),
    }
  ];

  const activeColumns = allColumns.filter(col => col.key === "actions" || visibleColumns.includes(col.key));

  return (
    <div className="space-y-4">
      <div className="flex justify-end px-1">
        <Dropdown overlay={visibilityMenu} trigger={['click']}>
          <Button
            icon={<SettingOutlined />}
            className="!rounded-xl !h-[42px] !px-4 !border-slate-200 !text-slate-600 font-semibold hover:!border-[#006666] hover:!text-[#006666] flex items-center gap-2"
          >
            Columns
          </Button>
        </Dropdown>
      </div>

      <div className="place-holder-table modern-table shadow-sm border border-slate-100 rounded-xl overflow-hidden bg-white">
        <Table
          rowKey="_id"
          className="custom-ant-table"
          scroll={{ x: 1000, y: 600 }}
          sticky={true}
          loading={{
            spinning: locationsList?.status === "loading",
            indicator: <TableSkeleton rows={8} columns={5} />,
          }}
          columns={activeColumns}
          dataSource={locationsList?.data?.data}
          pagination={{
            current: locationsList?.data?.pagination?.currentPage,
            pageSize: locationsList?.data?.pagination?.itemsPerPage,
            total: locationsList?.data?.pagination?.totalItems,
            showSizeChanger: true,
            className: "px-4 pb-4",
            onChange: (page, pageSize) => onChange({ currentPage: Number(page), itemsPerPage: pageSize }),
          }}
          onChange={handleSorting}
        />
      </div>
    </div>
  );
}

export default PageTable;