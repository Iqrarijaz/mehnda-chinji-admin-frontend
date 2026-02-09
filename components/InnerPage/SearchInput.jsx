import { Input } from "antd";
import React from "react";
import { IoSearchCircle } from "react-icons/io5";

function SearchInput({ setFilters }) {
  return (
    <Input
      onBlur={() => {
        setFilters((oldValues) => ({
          ...oldValues,
          onChangeSearch: false,
        }));
      }}
      placeholder="Search..."
      className="custom-search-input border-2 border-[#0F172A] rounded"
      prefix={<IoSearchCircle size={30} color="#0F172A" className="me-2" />}
      onChange={(event) => {
        const value = event?.target?.value;
        if (value.includes("-")) {
          const newValue = value.replace(/-/g, "");
          setFilters((oldValues) => ({
            ...oldValues,
            search: newValue.trim(),
            onChangeSearch: true,
          }));
          return;
        }
        setFilters((oldValues) => ({
          ...oldValues,
          search: value.trim(),
          onChangeSearch: true,
        }));
      }}
    />
  );
}

export default SearchInput;