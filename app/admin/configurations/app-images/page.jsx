"use client";
import React, { useState } from "react";
import { useQuery } from "react-query";
import { toast } from "react-toastify";
import AddButton from "@/components/InnerPage/AddButton";
import SearchInput from "@/components/InnerPage/SearchInput";
import { useDebounce } from "@/hooks/useDebounce";
import { GET_APP_IMAGES } from "@/app/api/admin/app-images";
import AppImagesTable from "./components/Table";
import AddAppImagesModal from "./components/AddModal";
import EditAppImagesModal from "./components/EditModal";
import ViewAppImagesModal from "./components/ViewModal";
import StatCard from "@/components/shared/StatCard";
import ColumnVisibilityDropdown from "@/components/InnerPage/ColumnVisibilityDropdown";
import { AppstoreOutlined } from "@ant-design/icons";

export default function AppImagesPage() {
    const [modal, setModal] = useState({ name: null, data: null, state: false });
    const [filters, setFilters] = useState({
        itemsPerPage: 10,
        currentPage: 1,
        search: null,
        sortOrder: -1,
        sortingKey: "_id",
        onChangeSearch: false,
    });

    // Column Visibility State
    const [visibleColumns, setVisibleColumns] = useState(["name", "key", "images", "createdAt", "actions"]);

    const columnOptions = [
        { label: "Name", value: "name" },
        { label: "Key", value: "key" },
        { label: "Images Count", value: "images" },
        { label: "Created At", value: "createdAt" },
    ];

    const debFilter = useDebounce(filters, filters.onChangeSearch ? 1000 : 0);
    const appImagesList = useQuery({
        queryKey: ["appImagesList", JSON.stringify(debFilter)],
        queryFn: () => GET_APP_IMAGES(debFilter),
        onError: () => toast.error("Something went wrong while fetching app images."),
    });

    const totalSets = appImagesList.data?.pagination?.total || 0;

    const onChange = (data) => setFilters((old) => ({ ...old, ...data }));

    return (
        <>


            <div className="flex flex-col md:flex-row justify-between mb-3 gap-3 items-start md:items-center">
                {/* Status Count Cards (Left) */}
                <div className="flex gap-2 items-center flex-wrap">
                    <StatCard
                        title="Total Image Sets"
                        shortTitle="Sets"
                        count={totalSets}
                        color="#006666"
                        bg="#f0fdfa"
                        border="#ccfbf1"
                        icon={<AppstoreOutlined />}
                    />
                </div>

                {/* Filter, Search and Add Button (Right) */}
                <div className="flex gap-2 items-center w-full md:w-auto justify-end">
                    {/* Desktop Filters (Hidden on Mobile) */}
                    <div className="hidden md:flex items-center gap-3 mr-1">
                        <SearchInput setFilters={setFilters} />
                    </div>

                    <div className="flex items-center gap-2">
                        <ColumnVisibilityDropdown
                            options={columnOptions}
                            visibleColumns={visibleColumns}
                            setVisibleColumns={setVisibleColumns}
                        />

                        <AddButton
                            title="Add Image"
                            icon={false}
                            onClick={() => setModal({ name: "Add", data: null, state: true })}
                            className="!h-[32px] !rounded !px-4 !text-[10px] font-medium shadow-sm transform hover:scale-[1.02] active:scale-[0.98]"
                        />
                    </div>
                </div>
            </div>

            <div className="flex flex-col mb-4">
                <AppImagesTable
                    modal={modal}
                    setModal={setModal}
                    appImagesList={appImagesList}
                    filters={filters}
                    onChange={onChange}
                    setFilters={setFilters}
                    visibleColumns={visibleColumns}
                />
            </div>

            <AddAppImagesModal modal={modal} setModal={setModal} />
            <EditAppImagesModal modal={modal} setModal={setModal} />
            <ViewAppImagesModal modal={modal} setModal={setModal} />
        </>
    );
}
