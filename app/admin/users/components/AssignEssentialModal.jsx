"use client";
import React, { useState, useEffect } from "react";
import { Modal, Input, List, Avatar, Button, Pagination } from "antd";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { toast } from "react-toastify";
import { SettingOutlined, SearchOutlined } from "@ant-design/icons";
import { HiOutlineMapPin } from "react-icons/hi2";
import { ASSIGN_ESSENTIAL } from "@/app/api/admin/users";
import { GET_ESSENTIALS } from "@/app/api/admin/essentials";
import { ADMIN_KEYS } from "@/constants/queryKeys";

const AssignEssentialModal = React.memo(({ modal, setModal }) => {
    const queryClient = useQueryClient();
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [debouncedSearch, setDebouncedSearch] = useState("");

    // Debounce search input
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search);
            setPage(1); // Reset page on new search
        }, 300);
        return () => clearTimeout(timer);
    }, [search]);

    const { data: essentialsResponse, isLoading: isListing } = useQuery(
        ["admin_essentials_list", debouncedSearch, page],
        () => GET_ESSENTIALS({ search: debouncedSearch, currentPage: page, itemsPerPage: 6 }),
        {
            enabled: modal.name === "AssignEssential" && modal.state,
            keepPreviousData: true,
        }
    );

    const assignMutation = useMutation({
        mutationKey: ["assignEssential"],
        mutationFn: ASSIGN_ESSENTIAL,
        onSuccess: (data, variables) => {
            toast.success(data?.message || "Essential assigned successfully");
            // Invalidate users list query to update local state (e.g. managedEssentials array)
            queryClient.invalidateQueries([ADMIN_KEYS.USERS.LIST]);

            // Locally update the active modal user record managedEssentials array
            if (modal.data) {
                const currentManaged = modal.data.managedEssentials || [];
                let updatedManaged;
                if (variables.action === "assign") {
                    updatedManaged = [...currentManaged, variables.essentialId];
                } else {
                    updatedManaged = currentManaged.filter(id => id !== variables.essentialId);
                }
                setModal(prev => ({
                    ...prev,
                    data: {
                        ...prev.data,
                        managedEssentials: updatedManaged
                    }
                }));
            }
        },
        onError: (error) => {
            toast.error(error.errorMessage || "Something went wrong");
        },
    });

    const handleCancel = () => {
        setSearch("");
        setDebouncedSearch("");
        setPage(1);
        setModal({ name: null, state: false, data: null });
    };

    const isAssigned = (essentialId) => {
        const managed = modal.data?.managedEssentials || [];
        return managed.includes(essentialId);
    };

    const handleAssignToggle = (essentialId) => {
        const action = isAssigned(essentialId) ? "unassign" : "assign";
        assignMutation.mutate({
            userId: modal?.data?._id,
            essentialId,
            action
        });
    };

    const essentials = essentialsResponse?.data || [];
    const totalItems = essentialsResponse?.pagination?.total || 0;

    return (
        <Modal
            title={
                <div className="flex items-center gap-2 px-0 py-1">
                    <div className="w-8 h-8 rounded bg-teal-50 dark:bg-teal-900/20 flex items-center justify-center text-teal-600 dark:text-teal-400 transition-colors duration-300">
                        <SettingOutlined size={14} />
                    </div>
                    <div>
                        <span className="text-lg font-bold text-teal-700 dark:text-teal-500 block mt-1 transition-colors duration-300">
                            Assign Managed Places
                        </span>
                    </div>
                </div>
            }
            centered
            width={540}
            open={modal.name === "AssignEssential" && modal.state}
            onCancel={handleCancel}
            footer={null}
            className="modern-modal"
        >
            <div className="p-1 space-y-4">
                <div className="p-2 bg-slate-50/50 dark:bg-slate-900/50 rounded-md border border-slate-100 dark:border-slate-800 transition-colors duration-300">
                    <p className="text-slate-500 dark:text-slate-400 text-[10px] leading-tight font-medium uppercase tracking-tight">
                        Assigning places for: <span className="font-bold text-slate-800 dark:text-slate-100">{modal?.data?.name || "this user"}</span>
                    </p>
                </div>

                <Input
                    prefix={<SearchOutlined className="text-slate-400" />}
                    placeholder="Search essential places..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    allowClear
                    className="h-9 rounded-md border-slate-200 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-colors dark:bg-slate-900 dark:border-slate-800 dark:text-white"
                />

                <List
                    loading={isListing}
                    dataSource={essentials}
                    rowKey="_id"
                    renderItem={(item) => {
                        const assigned = isAssigned(item._id);
                        const isPending = assignMutation.isLoading && assignMutation.variables?.essentialId === item._id;
                        return (
                            <List.Item
                                actions={[
                                    <Button
                                        key="action"
                                        type={assigned ? "default" : "primary"}
                                        danger={assigned}
                                        onClick={() => handleAssignToggle(item._id)}
                                        loading={isPending}
                                        className={`rounded h-7 px-3 text-xs font-semibold !flex items-center justify-center ${assigned
                                                ? "hover:!bg-red-50 hover:!text-red-600 hover:!border-red-200"
                                                : "!bg-[#006666] hover:!bg-[#005555] text-white border-none"
                                            }`}
                                    >
                                        {assigned ? "Remove" : "Assign"}
                                    </Button>
                                ]}
                                className="!px-1 hover:bg-slate-50 dark:hover:bg-slate-800/30 rounded-md transition-colors"
                            >
                                <List.Item.Meta
                                    avatar={
                                        <Avatar
                                            src={item.images?.[0] || item.image}
                                            icon={<HiOutlineMapPin className="text-slate-400" />}
                                            className="bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                                        />
                                    }
                                    title={
                                        <span className="font-bold text-xs text-slate-800 dark:text-slate-200 capitalize">
                                            {item.name}
                                        </span>
                                    }
                                    description={
                                        <span className="text-[10px] text-slate-400 dark:text-slate-500 capitalize block leading-none mt-0.5">
                                            {item.category} • {item.type}
                                        </span>
                                    }
                                />
                            </List.Item>
                        );
                    }}
                    locale={{ emptyText: "No places found" }}
                    className="max-h-[300px] overflow-y-auto px-1"
                />

                {totalItems > 6 && (
                    <div className="flex justify-end pt-2 border-t border-slate-100 dark:border-slate-800">
                        <Pagination
                            simple
                            current={page}
                            total={totalItems}
                            pageSize={6}
                            onChange={(p) => setPage(p)}
                            size="small"
                        />
                    </div>
                )}
            </div>
        </Modal>
    );
});

AssignEssentialModal.displayName = "AssignEssentialModal";

export default AssignEssentialModal;
