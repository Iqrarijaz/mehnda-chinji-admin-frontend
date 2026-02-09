"use client";
import React, { useState } from "react";
import AddButton from "@/components/InnerPage/AddButton";
import SearchInput from "@/components/InnerPage/SearchInput";
import PostsTable from "./components/Table";
import PostCardList from "./components/PostCardList";
import PostsContextProvider, { usePostsContext } from "@/context/admin/posts/PostsContext";
import ItemsPerPageDropdown from "@/components/InnerPage/ItemsPerPageDropdown";
import AddPostModal from "./components/AddModal";
import UpdatePostModal from "./components/UpdateModal";
import SelectBox from "@/components/SelectBox";
import FilterModal from "./components/FilterModal";
import { FaFilter, FaThLarge, FaTable } from "react-icons/fa";

// Post types for filter
const POST_TYPES = [
    { value: "GENERAL", label: "General" },
    { value: "DEATH", label: "Death" },
    { value: "EVENT", label: "Event" },
    { value: "ANNOUNCEMENT", label: "Announcement" }
];

// Status options for filter
const STATUS_OPTIONS = [
    { value: "ACTIVE", label: "Active" },
    { value: "INACTIVE", label: "Inactive" }
];

function Posts() {
    const [modal, setModal] = useState({
        name: null,
        data: null,
        state: false,
    });
    const [filterModalOpen, setFilterModalOpen] = useState(false);
    const { filters, setFilters, onChange, viewMode, setViewMode } = usePostsContext();

    const handleTypeFilter = (value) => {
        setFilters(prev => ({
            ...prev,
            type: value || null,
            currentPage: 1
        }));
    };

    const handleStatusFilter = (value) => {
        setFilters(prev => ({
            ...prev,
            status: value || null,
            currentPage: 1
        }));
    };

    // Check if any filters are active
    const hasActiveFilters = filters?.type || filters?.status || filters?.search;

    return (
        <>
            <div className="flex flex-col md:flex-row justify-between mb-4">
                <div className="flex items-center gap-3 mb-4 md:mb-0">
                    <h1 className="inner-page-title text-2xl md:text-3xl text-black p-0 font-semibold">
                        Posts
                    </h1>

                    {/* View Mode Toggle - Desktop */}
                    <div className="hidden md:flex items-center bg-gray-100 rounded-lg p-1">
                        <button
                            onClick={() => setViewMode('cards')}
                            className={`flex items-center gap-1 px-3 py-1.5 rounded text-sm transition-colors ${viewMode === 'cards'
                                    ? 'bg-[#0F172A] text-white'
                                    : 'text-gray-600 hover:text-gray-900'
                                }`}
                        >
                            <FaThLarge size={12} />
                            Cards
                        </button>
                        <button
                            onClick={() => setViewMode('table')}
                            className={`flex items-center gap-1 px-3 py-1.5 rounded text-sm transition-colors ${viewMode === 'table'
                                    ? 'bg-[#0F172A] text-white'
                                    : 'text-gray-600 hover:text-gray-900'
                                }`}
                        >
                            <FaTable size={12} />
                            Table
                        </button>
                    </div>
                </div>

                {/* Desktop Filters - Hidden on mobile */}
                <div className="hidden md:flex flex-row gap-4">
                    <SelectBox
                        placeholder="Filter by Type"
                        allowClear
                        handleChange={handleTypeFilter}
                        value={filters?.type}
                        className="w-48"
                        width={null}
                        options={POST_TYPES.map(type => ({
                            value: type.value,
                            label: type.label
                        }))}
                    />
                    <SelectBox
                        placeholder="Filter by Status"
                        allowClear
                        handleChange={handleStatusFilter}
                        value={filters?.status}
                        className="w-48"
                        width={null}
                        options={STATUS_OPTIONS.map(status => ({
                            value: status.value,
                            label: status.label
                        }))}
                    />
                    <SearchInput setFilters={setFilters} />
                </div>
            </div>

            <div className="flex justify-between md:justify-end mb-4 gap-2">
                {/* Mobile Filter & View Toggle */}
                <div className="flex md:hidden gap-2">
                    <button
                        onClick={() => setFilterModalOpen(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-[#0F172A] text-white rounded-lg hover:bg-[#1e293b] transition-colors relative"
                    >
                        <FaFilter size={14} />
                        {hasActiveFilters && (
                            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
                        )}
                    </button>

                    {/* Mobile View Toggle */}
                    <button
                        onClick={() => setViewMode(viewMode === 'cards' ? 'table' : 'cards')}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                        {viewMode === 'cards' ? <FaTable size={14} /> : <FaThLarge size={14} />}
                    </button>
                </div>

                <div className="flex gap-2">
                    {viewMode === 'table' && (
                        <ItemsPerPageDropdown onChange={onChange} />
                    )}
                    <AddButton
                        title="Add"
                        icon={false}
                        onClick={() => setModal({ name: "Add", data: null, state: true })}
                    />
                </div>
            </div>

            {/* Content - Cards or Table */}
            <div className="flex flex-col mb-4">
                {viewMode === 'cards' ? (
                    <PostCardList modal={modal} setModal={setModal} />
                ) : (
                    <PostsTable modal={modal} setModal={setModal} />
                )}
            </div>

            {/* Mobile Filter Modal */}
            <FilterModal
                isOpen={filterModalOpen}
                onClose={() => setFilterModalOpen(false)}
                filters={filters}
                setFilters={setFilters}
            />

            <AddPostModal modal={modal} setModal={setModal} />
            <UpdatePostModal modal={modal} setModal={setModal} />
        </>
    );
}

export default function ParentWrapper() {
    return (
        <PostsContextProvider>
            <Posts />
        </PostsContextProvider>
    );
}
