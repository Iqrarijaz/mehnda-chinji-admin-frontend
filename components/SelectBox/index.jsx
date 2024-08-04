import { Select } from "antd";
import React from "react";

function SelectBox({
  options,
  handleChange,
  defaultValue = "",
  width = "150px",
  height = "35px",
}) {
  const formattedOptions = options.map((option) => ({
    value: option,
    label: option,
  }));

  return (
    <Select
      className="w-full font-xl"
      defaultValue={defaultValue}
      style={{
        width,
        height,
      }}
      onChange={handleChange}
      options={formattedOptions}
    />
  );
}

export default SelectBox;
