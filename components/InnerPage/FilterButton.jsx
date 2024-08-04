import { Button } from "antd";
import React from "react";
import { MdOutlineFilterListOff } from "react-icons/md";

function FilterButton({ onClick }) {
  return (
    <Button className="filter-button group" onClick={onClick}>
      <MdOutlineFilterListOff
        size={20}
        className="text-white group-hover:text-black"
      />
      Filters
    </Button>
  );
}

export default FilterButton;
