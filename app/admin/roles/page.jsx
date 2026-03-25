"use client";
import React, { useState } from "react";
import { useQuery } from "react-query";
import { toast } from "react-toastify";
import RolesTable from "./components/Table";
import AddRoleModal from "./components/AddModal";
import UpdateRoleModal from "./components/UpdateModal";
import SearchInput from "@/components/InnerPage/SearchInput";
import AddButton from "@/components/InnerPage/AddButton";
import { GET_ROLES } from "@/app/api/admin/roles";
import { useDebounce } from "@/hooks/useDebounce";
import InnerPageCard from "@/components/layout/InnerPageCard";

export default function RolesPage() {
    const [modal, setModal] = useState({ name: null, data: null, state: false });
    const [filters, setFilters] = useState({
        itemsPerPage: 10,
        currentPage: 1,
        search: "",
        sortOrder: -1,
        sortingKey: "_id",
        onChangeSearch: false,
    });

    const debFilter = useDebounce(filters, filters.onChangeSearch ? 500 : 0);
    const rolesList = useQuery({
        queryKey: ["rolesList", JSON.stringify(debFilter)],
        queryFn: () => GET_ROLES(debFilter),
        keepPreviousData: true,
        onError: () => toast.error("Failed to fetch roles."),
    });

    const onChange = (data) => setFilters((prev) => ({ ...prev, ...data }));

    return (
        <InnerPageCard title="Roles Management">

            <div className="flex justify-end mb-3 gap-3 items-center">
                <div className="flex flex-col md:flex-row gap-2">
                    <SearchInput setFilters={setFilters} />
                </div>
                <AddButton
                    title="Add Role"
                    icon={false}
                    onClick={() => setModal({ name: "Add", data: null, state: true })}
                    className="!h-[36px] !rounded-lg !px-4 !text-[12px] shadow-sm transform hover:scale-[1.02] active:scale-[0.98]"
                />
            </div>

            <div className="flex flex-col mb-4">
                <RolesTable setModal={setModal} rolesList={rolesList} filters={filters} onChange={onChange} />
            </div>

            <AddRoleModal modal={modal} setModal={setModal} />
            <UpdateRoleModal modal={modal} setModal={setModal} />
        </InnerPageCard>
    );
}
