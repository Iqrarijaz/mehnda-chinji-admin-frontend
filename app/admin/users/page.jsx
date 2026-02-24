"use client";
import React, { useState } from "react";
import { useQuery } from "react-query";
import { toast } from "react-toastify";
import AddButton from "@/components/InnerPage/AddButton";
import SearchInput from "@/components/InnerPage/SearchInput";
import UsersTable from "./components/Table";
import ItemsPerPageDropdown from "@/components/InnerPage/ItemsPerPageDropdown";
import AddUserModal from "./components/AddModal";
import UpdateUserModal from "./components/UpdateModal";
import ResetPasswordModal from "./components/ResetPasswordModal";
import { GET_USERS, GET_USER_STATUS_COUNTS } from "@/app/api/admin/users";
import { useDebounce } from "@/hooks/useDebounce";
import StatCard from "@/components/shared/StatCard";
import InnerPageCard from "@/components/layout/InnerPageCard";

export default function UsersPage() {
    const [modal, setModal] = useState({ name: null, data: null, state: false });
    const [filters, setFilters] = useState({
        limit: 20,
        page: 1,
        search: "",
        status: null,
        gender: null,
        sortOrder: -1,
        sortingKey: "_id",
        onChangeSearch: false,
    });

    const debFilter = useDebounce(filters, filters.onChangeSearch ? 500 : 0);
    const usersList = useQuery({
        queryKey: ["usersList", JSON.stringify(debFilter)],
        queryFn: () => GET_USERS(debFilter),
        keepPreviousData: true,
        onError: () => toast.error("Failed to fetch users."),
    });

    const { data: countsData } = useQuery({
        queryKey: ["usersStatusCounts"],
        queryFn: GET_USER_STATUS_COUNTS,
    });

    const counts = countsData?.data || { active: 0, inactive: 0, male: 0, female: 0 };

    const statCards = [
        { label: "Active", key: "ACTIVE", count: counts.active, color: "#16a34a", bg: "#f0fdf4", border: "#bbf7d0", field: "status" },
        { label: "Inactive", key: "INACTIVE", count: counts.inactive, color: "#dc2626", bg: "#fef2f2", border: "#fecaca", field: "status" },
        { label: "Male", key: "MALE", count: counts.male, color: "#2563eb", bg: "#eff6ff", border: "#bfdbfe", field: "gender" },
        { label: "Female", key: "FEMALE", count: counts.female, color: "#db2777", bg: "#fdf2f8", border: "#f9a8d4", field: "gender" },
    ];

    const onChange = (data) => setFilters((prev) => ({ ...prev, ...data }));

    return (
        <InnerPageCard title="App Users">

            {/* Status Count Cards */}
            <div className="flex gap-3 mb-5" style={{ flexWrap: "wrap" }}>
                {statCards.map((card) => (
                    <StatCard
                        key={card.key}
                        title={card.label}
                        count={card.count}
                        color={card.color}
                        bg={card.bg}
                        border={card.border}
                        active={filters[card.field] === card.key}
                        onClick={() =>
                            setFilters((prev) => ({
                                ...prev,
                                [card.field]: prev[card.field] === card.key ? null : card.key,
                                page: 1,
                            }))
                        }
                    />
                ))}
            </div>

            <div className="flex justify-end mb-4 gap-4 items-center">
                <div className="flex flex-col md:flex-row gap-4">
                    <SearchInput setFilters={setFilters} />
                </div>
                <ItemsPerPageDropdown onChange={onChange} />
                <AddButton title="New User" onClick={() => setModal({ name: "Add", data: null, state: true })} />
            </div>


            <div className="overflow-hidden">
                <UsersTable modal={modal} setModal={setModal} usersList={usersList} onChange={onChange} setFilters={setFilters} />
            </div>

            <AddUserModal modal={modal} setModal={setModal} />
            <UpdateUserModal modal={modal} setModal={setModal} />
            <ResetPasswordModal modal={modal} setModal={setModal} />
        </InnerPageCard>
    );
}
