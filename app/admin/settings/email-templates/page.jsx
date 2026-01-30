"use client";
import Link from "next/link";
import React, { useState } from "react";
import AddButton from "@/components/InnerPage/AddButton";
import SearchInput from "@/components/InnerPage/SearchInput";
import { PATH_ROUTER } from "@/routes";
import EmailTemplateContextProvider, {
  useEmailTemplateContext,
} from "@/context/admin/settings/EmailTemplateContext";
import BuildingTable from "../../categories/components/Table";
import EmailTemplatesTable from "./components/Table";
function EmailTemplate() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { filters, setFilters } = useEmailTemplateContext();

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

      <EmailTemplatesTable />
    </>
  );
}

export default function ParentWrapper() {
  return (
    <EmailTemplateContextProvider>
      <EmailTemplate />
    </EmailTemplateContextProvider>
  );
}
