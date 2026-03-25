"use client";
import { Select } from "antd";

const itemsPerPageOptions = [10, 20, 30, 40, 50, 100];

function ItemsPerPageDropdown({ onChange }) {

  return (
    <div className="flex justify-end items-center gap-4 h-[36px]">
      <Select
        defaultValue={20}
        style={{ width: 80, height: 36 }}
        className="custom-selectbox"
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