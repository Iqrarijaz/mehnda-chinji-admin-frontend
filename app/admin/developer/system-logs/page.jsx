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
      <div className="flex flex-col md:flex-row justify-between mb-6">
        <h1 className="inner-page-title text-3xl text-black p-0 mb-4 md:mb-0">
          System Logs
        </h1>
        <div className="flex flex-col md:flex-row gap-4">
          <SearchInput setFilters={setFilters} />
        </div>
      </div>

      <div className="flex lg:justify-end mb-6 gap-10 justify-between">
        <div className="min-w-[160px]">
          <Select
            className="focus:outline-none"
            defaultValue={"ADMIN"}
            style={{ width: "100%", height: "40px !important" }}
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
              { value: null, label: "All" },
            ]}
          />
        </div>
      </div>

      <SystemLogsTable systemLogsList={systemLogsList} onChange={onChange} />
    </>
  );
}
