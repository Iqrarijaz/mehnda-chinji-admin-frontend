"use client";

import { GET_EMAIL_TEMPLATES } from "@/app/api/admin/settings/emailTemplates";
import { useDebounce } from "@/hooks/useDebounce";
import { useQuery } from "react-query";
import { toast } from "react-toastify";

const { createContext, useState, useContext } = require("react");

export const emailTemplateContext = createContext();
export const useEmailTemplateContext = () => useContext(emailTemplateContext);

function EmailTemplateContextProvider({ children }) {
  const [filters, setFilters] = useState({
    limit: 20,
    page: 1,
    search: "",
    onChangeSearch: false,
  });

  const debFilter = useDebounce(filters, filters?.onChangeSearch ? 500 : 0);

  const emailTemplatesList = useQuery({
    queryKey: ["emailTemplatesList", JSON.stringify(debFilter)],
    queryFn: async () => {
      return await GET_EMAIL_TEMPLATES(debFilter);
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
      value={{ filters, emailTemplatesList, setFilters, onChange }}
    >
      {children}
    </emailTemplateContext.Provider>
  );
}

export default EmailTemplateContextProvider;
