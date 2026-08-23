import { Button } from "antd";
import React, { memo } from "react";
import { IoMdPersonAdd } from "react-icons/io";

const AddButton = memo(function AddButton({ title, onClick, icon = true, className = "" }) {
  return (
    <Button
      className={`add-button !h-[40px] !rounded !bg-[#006666] dark:!bg-[#006666] hover:!bg-[#004d4d] dark:hover:!bg-[#007a7a] border-none text-white transition-all flex items-center justify-center shadow-none gap-1.5 px-4 font-semibold text-xs ${className}`}
      onClick={onClick}
    >
      {icon && <IoMdPersonAdd size={18} className="text-white" />}
      <span>{title}</span>
    </Button>
  );
});

AddButton.displayName = "AddButton";

export default AddButton;
