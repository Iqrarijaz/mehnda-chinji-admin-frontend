"use client";
import { Select } from "antd";

const itemsPerPageOptions = [10, 20, 30, 40, 50,100];

function ItemsPerPageDropdown({onChange}) {

  return (
    <div className="flex justify-end items-center gap-2">
      <span className="text-sm text-white">Items per page:</span>
      <Select
        defaultValue={20}
        style={{ width: 100 }}
        className="custom-select-no-focus"
        onChange={(e) => {
          onChange({ itemsPerPage: Number(e) });
        }}
        options={itemsPerPageOptions.map((value) => ({
          value,
          label: `${value}`,
        }))}
      />
    </div>
  );
}

export default ItemsPerPageDropdown;