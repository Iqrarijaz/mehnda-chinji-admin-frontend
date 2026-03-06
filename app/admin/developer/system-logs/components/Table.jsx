import {
  MoreOutlined,
  SettingOutlined,
  DeleteOutlined,
  EyeOutlined
} from "@ant-design/icons";
import Loading from "@/animations/homePageLoader";
import { timestampToDateWithTime } from "@/utils/date";
import JsonViewerModal from "./JsonViewerModal";
import DeleteSystemLogsModal from "./DeleteModal";
import { Menu, Dropdown, Button, Checkbox, Table, Pagination } from "antd";
import { TableSkeleton } from "@/components/shared/Skeletons";
import { useState } from "react";

function SystemLogsTable({ systemLogsList, onChange }) {
  // State to manage modal visibility and data
  const [isModalOpen, setIsModalOpen] = useState({
    name: null,
    state: false,
    record: null,
  });

  // Column Visibility State
  const [visibleColumns, setVisibleColumns] = useState(["moduleName", "methodName", "createdBy", "reqBody", "error", "createdAt", "actions"]);

  // Function to handle sorting logic
  function handleSorting(pagination, filters, sorter) {
    onChange({
      sortingKey: sorter.field || "_id",
      sortOrder: sorter.order === "ascend" ? 1 : -1,
      currentPage: pagination.current,
    });
  }

  // Action menu configuration
  const actionMenu = (record) => (
    <Menu className="!rounded-xl !p-2 !min-w-[140px] shadow-xl border border-slate-100">
      <Menu.Item
        key="delete"
        icon={<DeleteOutlined className="text-red-500" />}
        onClick={() => setIsModalOpen({ name: "Delete", state: true, record })}
        className="!rounded-lg hover:!bg-red-50"
      >
        <span className="font-medium text-red-600">Delete Log</span>
      </Menu.Item>
    </Menu>
  );

  const columnOptions = [
    { label: "Module Name", value: "moduleName" },
    { label: "Method Name", value: "methodName" },
    { label: "Requested By", value: "createdBy" },
    { label: "Request Data", value: "reqBody" },
    { label: "Error Details", value: "error" },
    { label: "Created At", value: "createdAt" },
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

  // Table columns configuration
  const allColumns = [
    {
      title: "Module Name",
      dataIndex: "moduleName",
      key: "moduleName",
      width: 150,
      sorter: true,
      render: (record) => (
        <div className="capitalize font-bold text-slate-800 truncate">{record}</div>
      ),
    },
    {
      title: "Method Name",
      dataIndex: "methodName",
      key: "methodName",
      width: 200,
      sorter: true,
      render: (text) => (
        <div className="font-mono text-xs text-slate-600 bg-slate-50 px-2 py-1 rounded border border-slate-100 truncate">{text}</div>
      ),
    },
    {
      title: "Requested By",
      dataIndex: "createdBy",
      key: "createdBy",
      width: 250,
      sorter: true,
      render: (record) => (
        <div className="text-slate-600 font-medium truncate">{record?.email || "—"}</div>
      ),
    },
    {
      title: "Request Body",
      dataIndex: "reqBody",
      key: "reqBody",
      align: "center",
      width: 150,
      render: (record) => (
        <>
          {record ? (
            <Button
              type="link"
              icon={<EyeOutlined />}
              onClick={() => setIsModalOpen({ name: "Request Body", state: true, record })}
              className="!text-[#006666] !p-0 hover:!text-secondary flex items-center gap-1 mx-auto"
            >
              View Data
            </Button>
          ) : (
            <span className="text-slate-300">----</span>
          )}
        </>
      ),
    },
    {
      title: "Error Response",
      dataIndex: "error",
      key: "error",
      width: 150,
      align: "center",
      render: (record) => (
        <>
          {record ? (
            <Button
              type="link"
              icon={<EyeOutlined />}
              onClick={() => setIsModalOpen({ name: "Error Details", state: true, record })}
              className="!text-red-500 !p-0 hover:!text-red-600 flex items-center gap-1 mx-auto"
            >
              View Error
            </Button>
          ) : (
            <span className="text-slate-300">----</span>
          )}
        </>
      ),
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 200,
      sorter: true,
      render: (text) => (
        <div className="text-slate-500 font-medium whitespace-nowrap">
          {timestampToDateWithTime(text)}
        </div>
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
    },
  ];

  const activeColumns = allColumns.filter(col => col.key === "actions" || visibleColumns.includes(col.key));

  // Return JSX with Ant Design Table, Pagination, and Modals
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
            spinning: systemLogsList?.status === "loading",
            indicator: <TableSkeleton rows={8} columns={7} />,
          }}
          columns={activeColumns}
          dataSource={systemLogsList?.data?.data}
          pagination={{
            current: systemLogsList?.data?.pagination?.currentPage,
            pageSize: systemLogsList?.data?.pagination?.itemsPerPage,
            total: systemLogsList?.data?.pagination?.totalItems,
            showSizeChanger: true,
            className: "px-4 pb-4",
            onChange: (page, pageSize) => onChange({ currentPage: Number(page), itemsPerPage: pageSize }),
          }}
          onChange={handleSorting}
        />
        {(systemLogsList?.status === "loading") && <Loading />}

        <JsonViewerModal
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
        />
        <DeleteSystemLogsModal
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
        />
      </div>
    </div>
  );
}

export default SystemLogsTable;
