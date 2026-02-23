"use client";
import React, { useState } from "react";
import SearchInput from "@/components/InnerPage/SearchInput";
import SupportTable from "./components/Table";
import SupportContextProvider, { useSupportContext } from "@/context/admin/support/SupportContext";
import ItemsPerPageDropdown from "@/components/InnerPage/ItemsPerPageDropdown";
import ManageTicketModal from "./components/ManageModal";

function Support() {
    const [modal, setModal] = useState({
        name: null,
        data: null,
        state: false,
    });
    const { filters, setFilters, onChange } = useSupportContext();

    return (
        <div className="p-4 md:p-6 bg-white min-h-[85vh] rounded-xl shadow-sm border border-gray-100">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                    Support Tickets
                </h1>
                <div className="flex w-full md:w-auto items-center gap-3">
                    <SearchInput setFilters={setFilters} placeholder="Search by Ticket ID..." />
                </div>
            </div>

            <div className="flex flex-wrap justify-end gap-3 mb-6">
                <div className="flex items-center gap-2">
                    <ItemsPerPageDropdown onChange={onChange} />
                </div>
                <div className="flex items-center gap-2">
                    <select
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                        onChange={(e) => onChange({ status: e.target.value })}
                        value={filters.status}
                    >
                        <option value="">All Status</option>
                        <option value="open">Open</option>
                        <option value="in-progress">In Progress</option>
                        <option value="closed">Closed</option>
                    </select>
                </div>
            </div>

            <div className="overflow-hidden">
                <SupportTable modal={modal} setModal={setModal} />
            </div>

            <ManageTicketModal modal={modal} setModal={setModal} />
        </div>
    );
}

export default function SupportWrapper() {
    return (
        <SupportContextProvider>
            <Support />
        </SupportContextProvider>
    );
}
