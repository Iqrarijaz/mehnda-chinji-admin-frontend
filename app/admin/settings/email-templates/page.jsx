"use client";
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import SearchInput from "@/components/InnerPage/SearchInput";
import EmailTemplatesTable from "./components/Table";
import { useDebounce } from "@/hooks/useDebounce";
import InnerPageCard from "@/components/layout/InnerPageCard";
import { HiRefresh } from "react-icons/hi";
import { useEmailTemplates } from "./hooks/useEmailTemplates";

export default function EmailTemplatePage() {
  const [filters, setFilters] = useState({
    limit: 20,
    page: 1,
    search: "",
    onChangeSearch: false,
  });

  const debFilter = useDebounce(filters, filters.onChangeSearch ? 500 : 0);
  
  const {
      listQuery: emailTemplatesList,
      isRefreshing,
      handleRefresh
  } = useEmailTemplates(debFilter);

  const onChange = (data) => setFilters((old) => ({ ...old, ...data }));

  return (
    <InnerPageCard>
      <div className="flex flex-col md:flex-row justify-end mb-3 gap-3 items-center">
        {/* Action Bar (Right) */}
        <div className="flex flex-wrap md:flex-nowrap gap-1 items-center w-full md:w-auto justify-end">
          <div className="hidden md:flex items-center gap-1">
            <SearchInput setFilters={setFilters} className="!max-w-[180px] !h-[32px] mt-1 !border-2 !rounded-[2px]" />
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

      <EmailTemplatesTable
        emailTemplatesList={emailTemplatesList}
        filters={filters}
        onChange={onChange}
      />
    </InnerPageCard>
  );
}
