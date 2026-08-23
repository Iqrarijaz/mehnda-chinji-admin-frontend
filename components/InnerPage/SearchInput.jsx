import { Input } from "antd";
import React, { memo } from "react";
import { FiSearch } from "react-icons/fi";

const SearchInput = memo(function SearchInput({
  setFilters,
  className = "",
  pageKey = "page",
  searchKey = "search",
  placeholder = "Search..."
}) {
  return (
    <div className={`relative flex items-center ${className}`}>
      <Input
        onBlur={() => {
          setFilters((oldValues) => ({
            ...oldValues,
            onChangeSearch: false,
          }));
        }}
        placeholder={placeholder}
        className="custom-search-input !h-[40px] !font-sans !text-xs !text-slate-800 dark:!text-slate-100 !bg-white dark:!bg-slate-900 !border !border-slate-200 dark:!border-slate-700/80 !rounded-none shadow-none focus:!border-teal-600 dark:focus:!border-teal-500"
        prefix={<FiSearch size={16} className="text-teal-600 dark:text-teal-400 mr-2 shrink-0" />}
        onChange={(event) => {
          const value = event?.target?.value;
          setFilters((oldValues) => ({
            ...oldValues,
            [searchKey]: value ? value.trim() : "",
            onChangeSearch: true,
            [pageKey]: 1,
          }));
        }}
      />
    </div>
  );
});

SearchInput.displayName = "SearchInput";

export default SearchInput;