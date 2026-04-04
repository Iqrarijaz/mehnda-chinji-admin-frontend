import { Button } from "antd";
import React from "react";
import { IoMdPersonAdd } from "react-icons/io";

function AddButton({ title, onClick, icon = true, className = "" }) {
  return (
    <Button
      className={`add-button !h-[32px] !rounded !bg-[#006666] dark:!bg-[#004d4d] hover:!bg-[#004d4d] dark:hover:!bg-[#003d3d] border-none text-white transition-all flex items-center justify-center gap-2 ${className}`}
      onClick={onClick}
    >
      {icon && <IoMdPersonAdd size={18} />}
      <span className="font-semibold">{title}</span>
    </Button>
  );
}

export default AddButton;
