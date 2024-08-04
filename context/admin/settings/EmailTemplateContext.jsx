"use client";

import { LIST_EMAIL_TEMPLATES } from "@/app/api/admin/settings/emailTemplates";
import { useDebounce } from "@/hooks/useDebounce";
import { useQuery } from "react-query";
import { toast } from "react-toastify";

const { createContext, useState, useContext } = require("react");

export const emailTemplateContext = createContext();
export const useEmailTemplateContext = () => useContext(emailTemplateContext);

function EmailTemplateContextProvider({ children }) {
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
  const emailTemplateListList = useQuery({
    queryKey: ["emailTemplateListList", JSON.stringify(debFilter)],
    queryFn: async () => {
      return await LIST_EMAIL_TEMPLATES(debFilter);
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
    <emailTemplateContext.Provider
      value={{ filters, emailTemplateListList, setFilters, onChange }}
    >
      {children}
    </emailTemplateContext.Provider>
  );
}

export default EmailTemplateContextProvider;
