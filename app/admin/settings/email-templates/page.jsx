"use client";
import React, { useState } from "react";
import { useQuery } from "react-query";
import { toast } from "react-toastify";
import SearchInput from "@/components/InnerPage/SearchInput";
import EmailTemplatesTable from "./components/Table";
import { GET_EMAIL_TEMPLATES } from "@/app/api/admin/settings/emailTemplates";
import { useDebounce } from "@/hooks/useDebounce";

export default function EmailTemplatePage() {
  const [filters, setFilters] = useState({
    limit: 20,
    page: 1,
    search: "",
    onChangeSearch: false,
  });

  const debFilter = useDebounce(filters, filters.onChangeSearch ? 500 : 0);
  const emailTemplatesList = useQuery({
    queryKey: ["emailTemplatesList", JSON.stringify(debFilter)],
    queryFn: () => GET_EMAIL_TEMPLATES(debFilter),
    onError: () => toast.error("Something went wrong. Please try again later."),
  });

  const onChange = (data) => setFilters((old) => ({ ...old, ...data }));

  return (
    <>
      <div className="flex flex-col md:flex-row justify-between mb-6">
        <h1 className="inner-page-title text-3xl text-black p-0 mb-4 md:mb-0">
          Email Templates
        </h1>
        <div className="flex flex-col md:flex-row gap-4">
          <SearchInput setFilters={setFilters} />
        </div>
      </div>

      <EmailTemplatesTable
        emailTemplatesList={emailTemplatesList}
        filters={filters}
        onChange={onChange}
      />
    </>
  );
}
