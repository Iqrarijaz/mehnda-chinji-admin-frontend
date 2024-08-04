"use client";
import Link from "next/link";
import React, { useState } from "react";
import AddButton from "@/components/InnerPage/AddButton";
import SearchInput from "@/components/InnerPage/SearchInput";
import { PATH_ROUTER } from "@/routes";

import SMSTemplateContextProvider, {
  useSMSTemplateContext,
} from "@/context/admin/settings/SmsTemplateContext";
import SMSTemplatesTable from "./components/Tables";
function SMSTemplate() {
  const { filters, setFilters } = useSMSTemplateContext();

  return (
    <>
      <div className="flex flex-col md:flex-row justify-between mb-6">
        <h1 className="inner-page-title text-3xl text-black p-0 mb-4 md:mb-0">
          SMS Templates
        </h1>
        <div className="flex flex-col md:flex-row gap-4">
          <SearchInput setFilters={setFilters} />
        </div>
      </div>
      <div className="flex justify-end mb-6">
        <Link href={PATH_ROUTER.ADD_SMS_TEMPLATE}>
          <AddButton title="Add Message Template" />
        </Link>
      </div>

      <SMSTemplatesTable />
    </>
  );
}

export default function ParentWrapper() {
  return (
    <SMSTemplateContextProvider>
      <SMSTemplate />
    </SMSTemplateContextProvider>
  );
}
