import {
  EditOutlined,
  DeleteOutlined,
  EllipsisOutlined,
  SettingOutlined
} from "@ant-design/icons";
import Loading from "@/animations/homePageLoader";
import { useMutation, useQueryClient } from "react-query";
import { toast } from "react-toastify";
import { timestampToDate } from "@/utils/date";
import { DELETE_LOCATION, UPDATE_LOCATION_STATUS } from "@/app/api/admin/locations";
import { Modal, Pagination, Table, Tag, Switch, Menu, Dropdown, Button } from "antd";
import { TableSkeleton } from "@/components/shared/Skeletons";
import { ADMIN_KEYS } from "@/constants/queryKeys";
import { useState } from "react";

function PageTable({ modal, setModal, locationsList, onChange, setFilters, visibleColumns }) {
  const queryClient = useQueryClient();
  const [deleteModalData, setDeleteModalData] = useState(null);



  // Status mutation
  const manageStatusMutation = useMutation({
    mutationFn: UPDATE_LOCATION_STATUS,
    onSuccess: (data) => {
      queryClient.invalidateQueries([ADMIN_KEYS.LOCATIONS.LIST]);
      toast.success(data?.message || "Status updated");
    },
    onError: (error) => {
      toast.error(error.errorMessage || "Failed to update status");
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: DELETE_LOCATION,
    onSuccess: (data) => {
      queryClient.invalidateQueries([ADMIN_KEYS.LOCATIONS.LIST]);
      toast.success(data?.message || "Location deleted");
      setDeleteModalData(null);
    },
    onError: (error) => {
      toast.error(error.errorMessage || "Failed to delete location");
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

  const actionMenu = (record) => ({
    items: [
      {
        key: "edit",
        label: <span className="font-medium text-slate-700 dark:text-slate-300">Edit Location</span>,
        icon: <EditOutlined className="text-[#006666] dark:text-teal-500" />,
        onClick: () => setModal({
          name: "Update",
          data: record,
          state: true
        }),
        className: "!rounded hover:!bg-blue-50 dark:hover:!bg-blue-900/20 transition-colors",
      },
      {
        type: "divider",
        className: "!my-1",
      },
      {
        key: "delete",
        label: <span className="font-medium text-red-600 dark:text-red-500">Delete Location</span>,
        icon: <DeleteOutlined className="text-red-500 dark:text-red-400" />,
        onClick: () => handleDelete(record),
        className: "!rounded hover:!bg-red-50 dark:hover:!bg-red-900/20 transition-colors",
      },
    ],
    className: "!rounded !p-2 !min-w-[160px] shadow-xl border border-slate-100 dark:border-slate-800 dark:bg-slate-900 transition-colors",
  });




  const allColumns = [
    {
      title: "Location Name",
      key: "name_en",
      sorter: true,
      width: 250,
      render: (record) => (
        <div className="flex flex-col min-w-0">
          <span className="font-bold text-slate-800 dark:text-slate-200 text-xs truncate leading-tight block transition-colors duration-300">
            {record.name?.en}
          </span>
          <span className="text-[11px] text-slate-400 dark:text-slate-500 font-medium font-notoUrdu block mt-0.5 leading-tight transition-colors duration-300">
            {record.name?.ur}
          </span>
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
      render: (type) => {
        const typeMap = {
          DISTRICT: { color: "blue", label: "DISTRICT" },
          TEHSIL: { color: "cyan", label: "TEHSIL" },
          VILLAGE: { color: "green", label: "VILLAGE" },
        };
        const tag = typeMap[type] || { color: "default", label: type || "UNKNOWN" };
        return (
          <Tag
            color={tag.color}
            className="capitalize rounded-full font-bold px-2 py-0 border-none shadow-sm text-[9px] uppercase"
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
      title: "",
      key: "actions",
      width: 70,
      align: "right",
      render: (record) => (
        <Dropdown menu={actionMenu(record)} trigger={["click"]} placement="bottomRight">
          <Button
            type="text"
            icon={<EllipsisOutlined className="text-base text-slate-400" />}
            className="!rounded hover:!bg-slate-300 !flex items-center justify-center !h-4 !w-8"
          />
        </Dropdown>
      ),
    }
  ];

  const activeColumns = allColumns.filter(col => col.key === "actions" || visibleColumns.includes(col.key));

  return (
    <div className="space-y-4">
      <div className="modern-table shadow-sm border border-slate-100 dark:border-slate-800 rounded overflow-hidden bg-white dark:bg-slate-900 transition-colors duration-300">
        <Table
          rowKey="_id"
          className="custom-ant-table"
          scroll={{ x: 1100, y: 600 }}
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