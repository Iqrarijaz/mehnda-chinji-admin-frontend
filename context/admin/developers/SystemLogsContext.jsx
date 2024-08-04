"use client";

import { LIST_SYSTEM_LOGS } from "@/app/api/admin/developers/systemLogs";
import { useDebounce } from "@/hooks/useDebounce";
import { useQuery } from "react-query";
import { toast } from "react-toastify";

const { createContext, useState, useContext } = require("react");

export const systemLogsContext = createContext();
export const useSystemLogsContext = () => useContext(systemLogsContext);

function SystemLogsContextProvider({ children }) {
  const [filters, setFilters] = useState({
    itemsPerPage: 10,
    currentPage: 1,
    keyWord: null,
    sortOrder: -1,
    sortingKey: "_id",
    onChangeSearch: false,
    advance: {
      portal:"ADMIN"
    },
  });

  const debFilter = useDebounce(filters, filters?.onChangeSearch ? 1000 : 0);
  const systemLogsList = useQuery({
    queryKey: ["systemLogsList", JSON.stringify(debFilter)],
    queryFn: async () => {
      return await LIST_SYSTEM_LOGS(debFilter);
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
    <systemLogsContext.Provider
      value={{ filters, systemLogsList, setFilters, onChange }}
    >
      {children}
    </systemLogsContext.Provider>
  );
}

export default SystemLogsContextProvider;
