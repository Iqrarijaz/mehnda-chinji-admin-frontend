import { Button } from "antd";
import React from "react";
import { IoMdPersonAdd } from "react-icons/io";

function AddButton({ title, onClick, icon = true }) {
  return (
    <Button className="add-button" onClick={onClick}>
      {icon && <IoMdPersonAdd size={20} />}
      {title}
    </Button>
  );
}

export default AddButton;
