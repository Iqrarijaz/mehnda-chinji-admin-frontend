"use client";
import React, { useState } from "react";
import { useQuery } from "react-query";
import AddButton from "@/components/InnerPage/AddButton";
import SearchInput from "@/components/InnerPage/SearchInput";
import PostsTable from "./components/Table";
import PostsContextProvider, { usePostsContext } from "@/context/admin/posts/PostsContext";
import ItemsPerPageDropdown from "@/components/InnerPage/ItemsPerPageDropdown";
import AddPostModal from "./components/AddModal";
import UpdatePostModal from "./components/UpdateModal";
import SelectBox from "@/components/SelectBox";

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
    const { filters, setFilters, onChange } = usePostsContext();

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

    return (
        <>
            <div className="flex flex-col md:flex-row justify-between mb-4">
                <h1 className="inner-page-title text-2xl md:text-3xl text-black p-0 mb-4 md:mb-0 font-semibold">
                    Posts
                </h1>
                <div className="flex flex-col md:flex-row gap-4">
                    <SelectBox
                        placeholder="Filter by Type"
                        allowClear
                        handleChange={handleTypeFilter}
                        className="w-full md:w-48"
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
                        className="w-full md:w-48"
                        width={null}
                        options={STATUS_OPTIONS.map(status => ({
                            value: status.value,
                            label: status.label
                        }))}
                    />
                    <SearchInput setFilters={setFilters} />
                </div>
            </div>

            <div className="flex justify-end mb-4">
                <ItemsPerPageDropdown onChange={onChange} />
                <AddButton
                    title="Add Post"
                    onClick={() => setModal({ name: "Add", data: null, state: true })}
                />
            </div>
            <div className="flex flex-col mb-4 ">
                <PostsTable modal={modal} setModal={setModal} />
            </div>

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
