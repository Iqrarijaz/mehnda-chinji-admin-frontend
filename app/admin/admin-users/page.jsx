"use client";
import React, { useState } from "react";
import { useQuery } from "react-query";
import { toast } from "react-toastify";
import AdminUsersTable from "./components/Table";
import AddAdminUserModal from "./components/AddModal";
import UpdateAdminUserModal from "./components/UpdateModal";
import SearchInput from "@/components/InnerPage/SearchInput";
import AddButton from "@/components/InnerPage/AddButton";
import { GET_ADMIN_USERS, GET_ADMIN_USER_STATUS_COUNTS } from "@/app/api/admin/admin-users";
import { useDebounce } from "@/hooks/useDebounce";
import StatCard from "@/components/shared/StatCard";
import InnerPageCard from "@/components/layout/InnerPageCard";
import { StatCardSkeleton } from "@/components/shared/Skeletons";

export default function AdminUsersPage() {
    const [modal, setModal] = useState({ name: null, data: null, state: false });
    const [filters, setFilters] = useState({
        limit: 20,
        page: 1,
        search: "",
        status: null,
        sortOrder: -1,
        sortingKey: "_id",
        onChangeSearch: false,
    });

    const debFilter = useDebounce(filters, filters.onChangeSearch ? 500 : 0);
    const adminUsersList = useQuery({
        queryKey: ["adminUsersList", JSON.stringify(debFilter)],
        queryFn: () => GET_ADMIN_USERS(debFilter),
        keepPreviousData: true,
        onError: () => toast.error("Failed to fetch admin users."),
    });

    const { data: countsData, isLoading: countsLoading } = useQuery({
        queryKey: ["adminUsersStatusCounts"],
        queryFn: GET_ADMIN_USER_STATUS_COUNTS,
    });

    const counts = countsData?.data || { active: 0, inactive: 0 };

    const statCards = [
        { label: "Active", key: "ACTIVE", count: counts.active, color: "#16a34a", bg: "#f0fdf4", border: "#bbf7d0" },
        { label: "Inactive", key: "INACTIVE", count: counts.inactive, color: "#dc2626", bg: "#fef2f2", border: "#fecaca" },
    ];

    const onChange = (data) => setFilters((prev) => ({ ...prev, ...data }));

    return (
        <InnerPageCard title="Admin Users">

            <div className="flex flex-col md:flex-row justify-between mb-3 gap-3 items-center">
                {/* Status Count Cards (Left) */}
                <div className="flex gap-2 items-center flex-wrap">
                    {countsLoading ? (
                        Array.from({ length: 2 }).map((_, i) => <StatCardSkeleton key={i} />)
                    ) : (
                        statCards.map((card) => (
                            <StatCard
                                key={card.key}
                                title={card.label}
                                count={card.count}
                                color={card.color}
                                bg={card.bg}
                                border={card.border}
                                active={filters.status === card.key}
                                onClick={() =>
                                    setFilters((prev) => ({
                                        ...prev,
                                        status: prev.status === card.key ? null : card.key,
                                        page: 1,
                                    }))
                                }
                            />
                        ))
                    )}
                </div>

                {/* Search and Add Button (Right) */}
                <div className="flex gap-3 items-center">
                    <div className="flex flex-col md:flex-row gap-2">
                        <SearchInput setFilters={setFilters} />
                    </div>
                    <AddButton
                        title="Add Admin User"
                        icon={false}
                        onClick={() => setModal({ name: "Add", data: null, state: true })}
                        className="!h-[36px] !rounded-lg !px-4 !text-[12px] shadow-sm transform hover:scale-[1.02] active:scale-[0.98]"
                    />
                </div>
            </div>

            <div className="flex flex-col mb-4">
                <AdminUsersTable setModal={setModal} adminUsersList={adminUsersList} filters={filters} onChange={onChange} />
            </div>

            <AddAdminUserModal modal={modal} setModal={setModal} />
            <UpdateAdminUserModal modal={modal} setModal={setModal} />
        </InnerPageCard>
    );
}
