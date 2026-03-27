import { Select } from "antd";
import React from "react";

function SelectBox({
  options = [],
  handleChange,
  defaultValue = "",
  value,
  width = "100%",
  height = "32px",
  className = "",
  placeholder = "",
  loading = false,
  showSearch = false,
  allowClear = false,
}) {
  // Support both string arrays and object arrays with value/label
  const formattedOptions = options.map((option) => {
    if (typeof option === "string") {
      return { value: option, label: option };
    }
    return { value: option.value, label: option.label };
  });

  return (
    <Select
      className={`w-full custom-selectbox ${className}`}
      defaultValue={defaultValue || undefined}
      value={value || undefined}
      style={{
        width,
        height,
      }}
      onChange={handleChange}
      options={formattedOptions}
      placeholder={placeholder}
      loading={loading}
      showSearch={showSearch}
      allowClear={allowClear}
      optionFilterProp="label"
    />
  );
}

export default SelectBox;

