"use client";

import { LIST_CLIENTS } from "@/app/api/admin/clients";
import { useDebounce } from "@/hooks/useDebounce";
import { useQuery } from "react-query";
import { toast } from "react-toastify";

const { createContext, useState, useContext } = require("react");

export const clientContext = createContext();
export const useClientContext = () => useContext(clientContext);

function ClientContextProvider({ children }) {
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
  const clientsList = useQuery({
    queryKey: ["clientsList", JSON.stringify(debFilter)],
    queryFn: async () => {
      return await LIST_CLIENTS(debFilter);
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
    <clientContext.Provider
      value={{ filters, clientsList, setFilters, onChange }}
    >
      {children}
    </clientContext.Provider>
  );
}

export default ClientContextProvider;
