import { Input } from "antd";
import React from "react";
import { FiSearch } from "react-icons/fi";

function SearchInput({ setFilters }) {
  return (
    <div className="search-input-wrap relative flex items-center">
      <Input
        onBlur={() => {
          setFilters((oldValues) => ({
            ...oldValues,
            onChangeSearch: false,
          }));
        }}
        placeholder="Search..."
        className="!h-[42px] !rounded-xl !border-2 !border-slate-100 focus:!border-primary focus:!shadow-none hover:!border-slate-200 transition-all font-sans text-slate-600"
        prefix={<FiSearch size={18} className="text-slate-400 mr-2" />}
        onChange={(event) => {
          const value = event?.target?.value;
          setFilters((oldValues) => ({
            ...oldValues,
            search: value ? value.trim() : "",
            onChangeSearch: true,
            page: 1,
          }));
        }}
      />
    </div>
  );
}

export default SearchInput;