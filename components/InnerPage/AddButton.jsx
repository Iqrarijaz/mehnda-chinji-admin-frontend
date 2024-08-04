import { Button } from "antd";
import React from "react";
import { IoMdPersonAdd } from "react-icons/io";

function AddButton({ title }) {
  return (
    <Button className="add-button">
      <IoMdPersonAdd size={20} />
      {title}
    </Button>
  );
}

export default AddButton;
