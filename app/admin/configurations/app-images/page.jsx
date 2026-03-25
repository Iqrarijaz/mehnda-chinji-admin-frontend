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
import InnerPageCard from "@/components/layout/InnerPageCard";

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

    const debFilter = useDebounce(filters, filters.onChangeSearch ? 1000 : 0);
    const appImagesList = useQuery({
        queryKey: ["appImagesList", JSON.stringify(debFilter)],
        queryFn: () => GET_APP_IMAGES(debFilter),
        onError: () => toast.error("Something went wrong while fetching app images."),
    });

    const totalSets = appImagesList.data?.pagination?.total || 0;

    const onChange = (data) => setFilters((old) => ({ ...old, ...data }));

    return (
        <InnerPageCard title="App Images">


            <div className="flex justify-end mb-3 gap-3 items-center">
                <div className="flex flex-col md:flex-row gap-2">
                    <SearchInput setFilters={setFilters} />
                </div>
                <AddButton
                    title="Add Image Set"
                    icon={false}
                    onClick={() => setModal({ name: "Add", data: null, state: true })}
                    className="!h-[36px] !rounded-lg !px-4 !text-[12px] shadow-sm transform hover:scale-[1.02] active:scale-[0.98]"
                />
            </div>

            <div className="flex flex-col mb-4">
                <AppImagesTable
                    modal={modal}
                    setModal={setModal}
                    appImagesList={appImagesList}
                    filters={filters}
                    onChange={onChange}
                    setFilters={setFilters}
                />
            </div>

            <AddAppImagesModal modal={modal} setModal={setModal} />
            <EditAppImagesModal modal={modal} setModal={setModal} />
            <ViewAppImagesModal modal={modal} setModal={setModal} />
        </InnerPageCard>
    );
}
