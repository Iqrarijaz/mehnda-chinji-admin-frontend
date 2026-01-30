"use client";
import React, { useState } from "react";
import AdminUsersContextProvider, { useAdminUsersContext } from "@/context/admin/admin-users/AdminUsersContext";
import AdminUsersTable from "./components/Table";
import AddEditAdminUserModal from "./components/AddEditAdminUserModal";
import SearchInput from "@/components/InnerPage/SearchInput";
import AddButton from "@/components/InnerPage/AddButton";
import ItemsPerPageDropdown from "@/components/InnerPage/ItemsPerPageDropdown";

function AdminUsersPageContent() {
    const [modal, setModal] = useState({
        name: null,
        data: null,
        state: false,
    });

    const { setFilters, onChange } = useAdminUsersContext();

    return (
        <>
            <div className="flex flex-col md:flex-row justify-between mb-4">
                <h1 className="inner-page-title text-2xl md:text-3xl text-black p-0 mb-4 md:mb-0 font-semibold">
                    Admin Users Management
                </h1>
                <div className="flex flex-col md:flex-row gap-4">
                    <SearchInput setFilters={setFilters} />
                </div>
            </div>

            <div className="flex justify-end mb-4 gap-4">
                <ItemsPerPageDropdown onChange={onChange} />
                <AddButton
                    title="Add Admin User"
                    onClick={() => setModal({ name: "Add", data: null, state: true })}
                />
            </div>

            <div className="flex flex-col mb-4">
                <AdminUsersTable setModal={setModal} />
            </div>

            <AddEditAdminUserModal modal={modal} setModal={setModal} />
        </>
    );
}

export default function AdminUsersPage() {
    return (
        <AdminUsersContextProvider>
            <AdminUsersPageContent />
        </AdminUsersContextProvider>
    );
}
