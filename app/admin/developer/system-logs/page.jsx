"use client";
import React, { useState } from "react";
import { useQuery } from "react-query";
import { toast } from "react-toastify";
import SearchInput from "@/components/InnerPage/SearchInput";
import SystemLogsTable from "./components/Table";
import { LIST_SYSTEM_LOGS } from "@/app/api/admin/developers/systemLogs";
import { Select } from "antd";
import { useDebounce } from "@/hooks/useDebounce";

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
  const systemLogsList = useQuery({
    queryKey: ["systemLogsList", JSON.stringify(debFilter)],
    queryFn: () => LIST_SYSTEM_LOGS(debFilter),
    onError: () => toast.error("Something went wrong. Please try again later."),
  });

  const onChange = (data) => setFilters((old) => ({ ...old, ...data }));

  return (
    <>
      <div className="flex justify-end mb-3 gap-3 items-center">
        <div className="min-w-[160px]">
          <Select
            placeholder="Select Portal"
            allowClear
            defaultValue={"ADMIN"}
            style={{ width: "160px", height: "36px" }}
            className="custom-selectbox"
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
        </div>
        <div className="flex flex-col md:flex-row gap-2">
          <SearchInput setFilters={setFilters} searchKey="keyWord" pageKey="currentPage" />
        </div>
      </div>


      <SystemLogsTable systemLogsList={systemLogsList} onChange={onChange} />
    </>
  );
}
