"use client";
import React, { useState } from "react";
import AddButton from "@/components/InnerPage/AddButton";
import SearchInput from "@/components/InnerPage/SearchInput";
import ColumnVisibilityDropdown from "@/components/InnerPage/ColumnVisibilityDropdown";
import AnnouncementsTable from "./components/Table";
import AddAnnouncementModal from "./components/AddModal";
import UpdateAnnouncementModal from "./components/UpdateModal";
import { GET_ANNOUNCEMENTS } from "@/app/api/admin/announcements";
import InnerPageCard from "@/components/layout/InnerPageCard";
import { HiRefresh } from "react-icons/hi";
import { ADMIN_KEYS } from "@/constants/queryKeys";
import { useAdminData } from "@/hooks/useAdminData";
import { useDebounce } from "@/hooks/useDebounce";

export default function AnnouncementsPage() {
    const [modal, setModal] = useState({ name: null, data: null, state: false });
    const [filters, setFilters] = useState({
        limit: 10,
        page: 1,
        type: "",
        search: "",
        onChangeSearch: false
    });

    const [visibleColumns, setVisibleColumns] = useState(["title", "type", "author", "essential", "createdAt", "actions"]);

    const columnOptions = [
        { label: "Title", value: "title" },
        { label: "Type", value: "type" },
        { label: "Author", value: "author" },
        { label: "Essential Place", value: "essential" },
        { label: "Created At", value: "createdAt" }
    ];

    const debFilter = useDebounce(filters, filters.onChangeSearch ? 500 : 0);

    const {
        listQuery: announcementsList,
        isRefreshing,
        handleRefresh
    } = useAdminData({
        listQueryKey: [ADMIN_KEYS.ANNOUNCEMENTS.LIST, JSON.stringify(debFilter)],
        listQueryFn: () => GET_ANNOUNCEMENTS(debFilter),
        onListError: "Failed to fetch announcements.",
    });

    const onChange = React.useCallback((data) => {
        setFilters((prev) => ({ ...prev, ...data }));
    }, []);

    return (
        <InnerPageCard title="Announcements">
            <div className="flex flex-wrap md:flex-nowrap gap-2 items-center w-full justify-end mb-4">
                <SearchInput setFilters={setFilters} className="!max-w-[180px]" />
                <ColumnVisibilityDropdown
                    options={columnOptions}
                    visibleColumns={visibleColumns}
                    setVisibleColumns={setVisibleColumns}
                />
                <button
                    onClick={handleRefresh}
                    disabled={isRefreshing}
                    title="Refresh Data"
                    className="flex items-center justify-center !h-[32px] !w-[32px] !border-2 !rounded-[2px] !border-[#006666] dark:!border-teal-900/50 !bg-white dark:!bg-slate-800 !text-[#006666] dark:!text-teal-400 hover:!bg-[#006666] dark:hover:!bg-teal-600 hover:!text-white shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <HiRefresh size={16} className={isRefreshing ? "animate-spin" : ""} />
                </button>
                <AddButton
                    title="Add"
                    icon={false}
                    onClick={() => setModal({ name: "Add", data: null, state: true })}
                    className="!h-[32px] !rounded !px-4 !text-[10px] font-medium shadow-sm transform hover:scale-[1.02] active:scale-[0.98]"
                />
            </div>

            <div className="bg-white dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden transition-all duration-300">
                <AnnouncementsTable
                    announcementsList={announcementsList?.data?.data}
                    setModal={setModal}
                    onChange={onChange}
                    visibleColumns={visibleColumns}
                />
            </div>

            <AddAnnouncementModal modal={modal} setModal={setModal} />
            <UpdateAnnouncementModal modal={modal} setModal={setModal} />
        </InnerPageCard>
    );
}
