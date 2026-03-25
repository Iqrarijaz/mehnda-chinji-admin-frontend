import { Button } from "antd";
import React from "react";
import { MdOutlineFilterListOff } from "react-icons/md";

function FilterButton({ onClick }) {
  return (
    <Button
      onClick={onClick}
      className="filter-button !h-[42px] !rounded !bg-[#006666] !border-none hover:!bg-[#004d4d] transition-all flex items-center gap-2"
    >
      <MdOutlineFilterListOff
        size={20}
        className="text-white group-hover:text-black"
      />
      Filters
    </Button>
  );
}

export default FilterButton;
