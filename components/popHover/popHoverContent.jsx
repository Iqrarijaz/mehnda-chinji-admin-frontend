import React from "react";

export function popoverContent(actionMenu) {
  return (
    <div className="flex flex-col bg-white p-2 border border-gray-300 rounded">
      {actionMenu.map((item, index) => (
        <div
          key={index}
          className="text-gray-500 p-1 flex justify-between gap-10 items-center hover:text-primary hover:bg-gray-100 cursor-pointer"
          onClick={item.handleFunction}
        >
          <p>{item.heading}</p>
          {item.icon}
        </div>
      ))}
    </div>
  );
}
