import { Button } from "antd";
import React from "react";
import { IoMdPersonAdd } from "react-icons/io";

function AddButton({ title, onClick, icon = true, className = "" }) {
  return (
    <Button
      className={`add-button !h-[36px] !rounded-xl !bg-[#006666] !border-none hover:!bg-[#004d4d] transition-all flex items-center gap-2 ${className}`}
      onClick={onClick}
    >
      {icon && <IoMdPersonAdd size={18} />}
      <span className="font-semibold">{title}</span>
    </Button>
  );
}

export default AddButton;
