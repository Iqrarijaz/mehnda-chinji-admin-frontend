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
      className="border-2 border-lightBlue focus:outline-none rounded-xl"
      prefix={<IoSearchCircle size={30} color="#7CB9E8" className="me-2" />}
      onChange={(event) => {
        const value = event?.target?.value;
        // if values has - then remove it from value (For Number search)
        if (value.includes("-")) {
          const newValue = value.replace(/-/g, "");
          setFilters((oldValues) => ({
            ...oldValues,
            keyWord: newValue.trim(),
            onChangeSearch: true,
          }));
          return;
        }
        setFilters((oldValues) => ({
          ...oldValues,
          keyWord: value.trim(),
          onChangeSearch: true,
        }));
      }}
    />
  );
}

export default SearchInput;
