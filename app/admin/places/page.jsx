"use client";
import React, { useState } from "react";
import { useQuery } from "react-query";
import AddButton from "@/components/InnerPage/AddButton";
import SearchInput from "@/components/InnerPage/SearchInput";
import PlacesTable from "./components/Table";
import PlacesContextProvider, { usePlacesContext } from "@/context/admin/places/PlacesContext";
import ItemsPerPageDropdown from "@/components/InnerPage/ItemsPerPageDropdown";
import AddPlaceModal from "./components/AddModal";
import UpdatePlaceModal from "./components/UpdateModal";
import { CATEGORIES } from "@/app/api/admin/categories";
import SelectBox from "@/components/SelectBox";



function Places() {
    const [modal, setModal] = useState({
        name: null,
        data: null,
        state: false,
    });
    const { filters, setFilters, onChange } = usePlacesContext();

    // Fetch categories for filter dropdown
    const { data: categoriesData, isLoading: categoriesLoading } = useQuery({
        queryKey: ["categoriesListForFilter", { type: "PLACES", itemsPerPage: 100 }],
        queryFn: () => CATEGORIES({ type: "PLACES", itemsPerPage: 100 }),
    });

    const categories = categoriesData?.data || [];

    const handleCategoryFilter = (value) => {
        setFilters(prev => ({
            ...prev,
            categoryId: value || null,
            currentPage: 1
        }));
    };

    return (
        <>
            <div className="flex flex-col md:flex-row justify-between mb-4">
                <h1 className="inner-page-title text-2xl md:text-3xl text-black p-0 mb-4 md:mb-0 font-semibold">
                    Places
                </h1>
                <div className="flex flex-col md:flex-row gap-4">
                    <SelectBox
                        placeholder="Filter by Category"
                        allowClear
                        handleChange={handleCategoryFilter}
                        className="w-full md:w-48"
                        width={null}
                        loading={categoriesLoading}
                        options={categories.map(cat => ({
                            value: cat._id,
                            label: cat.name?.en
                        }))}
                    />
                    <SearchInput setFilters={setFilters} />
                </div>
            </div>

            <div className="flex justify-end mb-4">
                <ItemsPerPageDropdown onChange={onChange} />
                <AddButton
                    title="Add Place"
                    onClick={() => setModal({ name: "Add", data: null, state: true })}
                />
            </div>
            <div className="flex flex-col mb-4 ">
                <PlacesTable modal={modal} setModal={setModal} />
            </div>

            <AddPlaceModal modal={modal} setModal={setModal} />
            <UpdatePlaceModal modal={modal} setModal={setModal} />
        </>
    );
}

export default function ParentWrapper() {
    return (
        <PlacesContextProvider>
            <Places />
        </PlacesContextProvider>
    );
}
