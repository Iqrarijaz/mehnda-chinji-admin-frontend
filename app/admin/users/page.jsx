"use client";
import React, { useState } from "react";
import AddButton from "@/components/InnerPage/AddButton";
import SearchInput from "@/components/InnerPage/SearchInput";
import UsersTable from "./components/Table";
import UsersContextProvider, { useUsersContext } from "@/context/admin/users/UsersContext";
import ItemsPerPageDropdown from "@/components/InnerPage/ItemsPerPageDropdown";
import AddUserModal from "./components/AddModal";
import UpdateUserModal from "./components/UpdateModal";
import ResetPasswordModal from "./components/ResetPasswordModal";

function Users() {
    const [modal, setModal] = useState({
        name: null,
        data: null,
        state: false,
    });
    const { filters, setFilters, onChange } = useUsersContext();

    return (
        <div className="p-4 md:p-6 bg-white min-h-[85vh] rounded-xl shadow-sm border border-gray-100">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                    App Users
                </h1>
                <div className="flex w-full md:w-auto items-center gap-3">
                    <SearchInput setFilters={setFilters} />
                </div>
            </div>

            <div className="flex flex-wrap justify-end gap-3 mb-6">
                <div className="flex items-center gap-2">
                    <ItemsPerPageDropdown onChange={onChange} />
                </div>
                <AddButton
                    title="New User"
                    onClick={() => setModal({ name: "Add", data: null, state: true })}
                />
            </div>

            <div className="overflow-hidden">
                <UsersTable modal={modal} setModal={setModal} />
            </div>

            <AddUserModal modal={modal} setModal={setModal} />
            <UpdateUserModal modal={modal} setModal={setModal} />
            <ResetPasswordModal modal={modal} setModal={setModal} />
        </div>
    );
}

export default function UsersWrapper() {
    return (
        <UsersContextProvider>
            <Users />
        </UsersContextProvider>
    );
}
