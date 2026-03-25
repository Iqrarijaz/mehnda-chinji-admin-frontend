import { Input } from "antd";
import React from "react";
import { FiSearch } from "react-icons/fi";

function SearchInput({ setFilters, className = "", pageKey = "page", searchKey = "search" }) {
  return (
    <div className={`relative flex items-center ${className}`}>
      <Input
        onBlur={() => {
          setFilters((oldValues) => ({
            ...oldValues,
            onChangeSearch: false,
          }));
        }}
        placeholder="Search..."
        className="custom-search-input !font-sans !text-slate-600"
        prefix={<FiSearch size={16} className="text-[#006666] mr-2" />}
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
}

export default SearchInput;