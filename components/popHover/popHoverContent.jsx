// popHoverContent.js
import React from "react";

export function popoverContent(actionMenu, record) {
  return (
    <div className="flex flex-col bg-white border-[#e0dede96] border-2 rounded min-w-[140px]">
      {actionMenu.map((item, index) => (
        <div
          key={index}
          className="text-black p-1 flex justify-between gap-10 items-center hover:text-white hover:bg-lightBlue cursor-pointer px-2 py-1"
          onClick={() => item.handleFunction(record)}
        >
          <p>{item.heading}</p>
          {item.icon}
        </div>
      ))}
    </div>
  );
}
