import {
    EditOutlined,
    DeleteOutlined,
    EyeOutlined,
    EllipsisOutlined,
    SettingOutlined,
    LikeOutlined,
    MessageOutlined
} from "@ant-design/icons";
import Loading from "@/animations/homePageLoader";
import { useMutation, useQueryClient } from "react-query";
import { toast } from "react-toastify";
import { timestampToDateWithTime } from "@/utils/date";
import { DELETE_POST, UPDATE_POST_STATUS } from "@/app/api/admin/posts";
import ViewModal from "./ViewModal";
import { getTagColor } from "@/utils/tagColor";
import ConfirmModal from "@/components/shared/ConfirmModal";
import { Modal, Pagination, Table, Tag, Switch, Menu, Dropdown, Button, Checkbox, Tooltip } from "antd";
import { useCallback, useState } from "react";
import { TableSkeleton } from "@/components/shared/Skeletons";
import ColumnVisibilityDropdown from "@/components/InnerPage/ColumnVisibilityDropdown";

function PostsTable({ modal, setModal, postsList, onChange, setFilters, setLikesModal, setCommentsModal }) {
    const queryClient = useQueryClient();
    const [viewModal, setViewModal] = useState({ open: false, data: null });
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
    const [visibleColumns, setVisibleColumns] = useState(["type", "content", "likesCount", "commentsCount", "status", "createdAt", "actions"]);

    const closeConfirmModal = () => {
        setConfirmModal((prev) => ({ ...prev, isOpen: false }));
    };

    // Status mutation
    const manageStatusMutation = useMutation({
        mutationFn: UPDATE_POST_STATUS,
        onSuccess: (data) => {
            queryClient.invalidateQueries("postsList");
            queryClient.invalidateQueries("postsListInfinite");
            toast.success(data?.message || "Status updated");
            closeConfirmModal();
        },
        onError: (error) => {
            toast.error(error?.response?.data?.message || "Failed to update status");
            closeConfirmModal();
        },
    });

    // Delete mutation
    const deleteMutation = useMutation({
        mutationFn: DELETE_POST,
        onSuccess: (data) => {
            queryClient.invalidateQueries("postsList");
            queryClient.invalidateQueries("postsListInfinite");
            toast.success(data?.message || "Post deleted");
            closeConfirmModal();
        },
        onError: (error) => {
            toast.error(error?.response?.data?.message || "Failed to delete post");
            closeConfirmModal();
        },
    });

    const handleStatus = useCallback((data) => {
        const isActive = data?.status === "ACTIVE";
        setConfirmModal({
            isOpen: true,
            title: 'Confirm Status Change',
            description: `Are you sure you want to ${isActive ? 'deactivate' : 'activate'} this post?`,
            confirmText: 'Yes, Change',
            cancelText: 'No, Keep',
            variant: 'primary',
            onConfirm: () => manageStatusMutation.mutate({
                _id: data._id
            })
        });
    }, [manageStatusMutation]);

    const handleDelete = useCallback((data) => {
        setConfirmModal({
            isOpen: true,
            title: 'Confirm Deletion',
            description: 'Are you sure you want to delete this post? This action cannot be undone.',
            confirmText: 'Yes, Delete',
            cancelText: 'Cancel',
            variant: 'danger',
            onConfirm: () => deleteMutation.mutate({
                _id: data._id,
            })
        });
    }, [deleteMutation]);

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
                key="view"
                icon={<EyeOutlined className="text-emerald-500" />}
                onClick={() => setViewModal({ open: true, data: record })}
                className="!rounded-lg hover:!bg-emerald-50"
            >
                <span className="font-medium">View Post</span>
            </Menu.Item>
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
                <span className="font-medium">Edit Post</span>
            </Menu.Item>
            <Menu.Divider className="!my-1" />
            <Menu.Item
                key="delete"
                icon={<DeleteOutlined className="text-red-500" />}
                onClick={() => handleDelete(record)}
                className="!rounded-lg hover:!bg-red-50"
            >
                <span className="font-medium text-red-600">Delete Post</span>
            </Menu.Item>
        </Menu>
    );

    const columnOptions = [
        { label: "Type", value: "type" },
        { label: "Content", value: "content" },
        { label: "Likes", value: "likesCount" },
        { label: "Comments", value: "commentsCount" },
        { label: "Status", value: "status" },
        { label: "Created At", value: "createdAt" },
    ];


    const allColumns = [
        {
            title: "Type",
            dataIndex: "type",
            key: "type",
            width: 100,
            align: "center",
            sorter: true,
            render: (type) => (
                <span
                    className="px-2.5 py-0.5 rounded-full capitalize font-bold text-white shadow-sm text-[9px]"
                    style={{ backgroundColor: getTagColor(type) }}
                >
                    {type || "GENERAL"}
                </span>
            ),
        },
        {
            title: "Content",
            dataIndex: "content",
            key: "content",
            width: 250,
            render: (content) => (
                <Tooltip title={content} placement="topLeft">
                    <div className="text-slate-700 font-medium truncate cursor-help text-xs">
                        {content?.substring(0, 80)}{content?.length > 80 ? '...' : ''}
                    </div>
                </Tooltip>
            ),
        },
        {
            title: "Likes",
            dataIndex: "likesCount",
            key: "likesCount",
            width: 80,
            align: "center",
            sorter: true,
            render: (count, record) => (
                <Button
                    type="text"
                    icon={<LikeOutlined className="text-blue-500 !text-xs" />}
                    onClick={() => setLikesModal({ open: true, postId: record._id })}
                    className="!rounded-lg hover:!bg-blue-50 !h-7 font-bold text-slate-600 !text-xs !flex items-center gap-1"
                >
                    {count || 0}
                </Button>
            ),
        },
        {
            title: "Comments",
            dataIndex: "commentsCount",
            key: "commentsCount",
            width: 90,
            align: "center",
            sorter: true,
            render: (count, record) => (
                <Button
                    type="text"
                    icon={<MessageOutlined className="text-emerald-500 !text-xs" />}
                    onClick={() => setCommentsModal({ open: true, postId: record._id })}
                    className="!rounded-lg hover:!bg-emerald-50 !h-7 font-bold text-slate-600 !text-xs !flex items-center gap-1"
                >
                    {count || 0}
                </Button>
            ),
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            align: "center",
            width: 80,
            sorter: true,
            render: (status, record) => (
                <Switch
                    checked={status === "ACTIVE"}
                    onChange={() => handleStatus(record)}
                    className={status === "ACTIVE" ? '!bg-[#006666]' : '!bg-slate-300'}
                    size="small"
                />
            ),
        },
        {
            title: "Created At",
            dataIndex: "createdAt",
            key: "createdAt",
            width: 140,
            sorter: true,
            render: (text) => <div className="text-slate-500 font-medium whitespace-nowrap text-xs">{timestampToDateWithTime(text)}</div>,
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
                        spinning: postsList?.status === "loading",
                        indicator: <TableSkeleton rows={5} columns={3} />,
                    }}
                    columns={activeColumns}
                    dataSource={postsList?.data?.data}
                    pagination={{
                        current: postsList?.data?.pagination?.currentPage,
                        pageSize: postsList?.data?.pagination?.itemsPerPage,
                        total: postsList?.data?.pagination?.totalItems,
                        showSizeChanger: true,
                        className: "px-4 pb-4",
                        onChange: (page, pageSize) => onChange({ currentPage: Number(page), itemsPerPage: pageSize }),
                    }}
                    onChange={handleSorting}
                />

                <ViewModal viewModal={viewModal} setViewModal={setViewModal} />

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

export default PostsTable;
