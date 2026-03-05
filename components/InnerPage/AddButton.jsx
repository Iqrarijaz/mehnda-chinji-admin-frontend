import { Button } from "antd";
import React from "react";
import { IoMdPersonAdd } from "react-icons/io";

function AddButton({ title, onClick, icon = true }) {
  return (
    <Button
      className="add-button !h-[42px] !rounded-xl !bg-[#006666] !border-none hover:!bg-[#004d4d] transition-all flex items-center gap-2"
      onClick={onClick}
    >
      {icon && <IoMdPersonAdd size={18} />}
      <span className="font-semibold">{title}</span>
    </Button>
  );
}

export default AddButton;
