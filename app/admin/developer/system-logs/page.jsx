"use client";
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import SearchInput from "@/components/InnerPage/SearchInput";
import SystemLogsTable from "./components/Table";
import { Select } from "antd";
import { useDebounce } from "@/hooks/useDebounce";
import InnerPageCard from "@/components/layout/InnerPageCard";
import { HiRefresh } from "react-icons/hi";
import { useDevSystemLogs } from "./hooks/useDevSystemLogs";

export default function SystemLogsPage() {
  const [filters, setFilters] = useState({
    itemsPerPage: 10,
    currentPage: 1,
    keyWord: null,
    sortOrder: -1,
    sortingKey: "_id",
    onChangeSearch: false,
    advance: { portal: "ADMIN" },
  });

  const debFilter = useDebounce(filters, filters.onChangeSearch ? 1000 : 0);
  
  const {
      listQuery: systemLogsList,
      isRefreshing,
      handleRefresh
  } = useDevSystemLogs(debFilter);

  const onChange = (data) => setFilters((old) => ({ ...old, ...data }));

  return (
    <InnerPageCard>
      <div className="flex flex-col md:flex-row justify-end mb-3 gap-3 items-center">
        <div className="flex flex-wrap md:flex-nowrap gap-1 items-center w-full md:w-auto justify-end">
          <div className="hidden md:flex items-center gap-1">
            <Select
              placeholder="Select Portal"
              allowClear
              defaultValue={"ADMIN"}
              className="custom-selectbox !w-[160px] !h-[32px] mt-1"
              onChange={(value) => {
                setFilters((old) => ({
                  ...old,
                  advance: value === null ? null : { portal: value },
                }));
              }}
              options={[
                { value: "ADMIN", label: "Admin" },
                { value: "USER", label: "User" },
                { value: "WEBSITE", label: "Website" },
              ]}
            />
            <SearchInput
                setFilters={setFilters}
                searchKey="keyWord"
                pageKey="currentPage"
                className="!max-w-[180px] !h-[32px] mt-1 !border-2 !rounded-[2px]"
            />
          </div>

          <div className="flex items-center gap-1">
            {/* Refresh Button */}
            <button
                onClick={handleRefresh}
                disabled={isRefreshing}
                title="Refresh Data"
                className="flex items-center justify-center !h-[32px] !w-[32px] !border-2 !rounded-[2px] !border-[#006666] dark:!border-teal-900/50 !bg-white dark:!bg-slate-800 !text-[#006666] dark:!text-teal-400 hover:!bg-[#006666] dark:hover:!bg-teal-600 hover:!text-white shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <HiRefresh size={16} className={isRefreshing ? "animate-spin" : ""} />
            </button>
          </div>
        </div>
      </div>


      <SystemLogsTable systemLogsList={systemLogsList} onChange={onChange} />
    </InnerPageCard>
  );
}
