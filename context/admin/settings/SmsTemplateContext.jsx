"use client";

import { LIST_SMS_TEMPLATES } from "@/app/api/admin/settings/smsTemplates";
import { useDebounce } from "@/hooks/useDebounce";
import { useQuery } from "react-query";
import { toast } from "react-toastify";

const { createContext, useState, useContext } = require("react");

export const smsTemplateContext = createContext();
export const useSMSTemplateContext = () => useContext(smsTemplateContext);

function SMSTemplateContextProvider({ children }) {
  const [filters, setFilters] = useState({
    itemsPerPage: 10,
    currentPage: 1,
    keyWord: null,
    sortOrder: -1,
    sortingKey: "_id",
    onChangeSearch: false,
    advance: null,
  });

  const debFilter = useDebounce(filters, filters?.onChangeSearch ? 1000 : 0);
  const smsTemplateListList = useQuery({
    queryKey: ["smsTemplateListList", JSON.stringify(debFilter)],
    queryFn: async () => {
      return await LIST_SMS_TEMPLATES(debFilter);
    },
    enabled: true,
    onError: (error) => {
      console.error("Error fetching data:", error);
      toast.error("Something went wrong. Please try again later.");
    },
  });

  function onChange(data) {
    setFilters((old) => ({ ...old, ...data }));
  }

  return (
    <smsTemplateContext.Provider
      value={{ filters, smsTemplateListList, setFilters, onChange }}
    >
      {children}
    </smsTemplateContext.Provider>
  );
}

export default SMSTemplateContextProvider;
