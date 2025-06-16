// popHoverContent.jsx

export const popoverContent = (menu, record) => (
  <div className="flex flex-col min-w-[120px] text-black bg-[#EDECEC]">
    {menu.map((item, index) => (
      <div
        key={index}
        onClick={() => item.handleFunction(record)}
        className={`px-3 py-2 cursor-pointer transition-colors duration-200 hover:text-white ${
          item.heading === "Delete"
            ? "hover:bg-red-600"
            : "hover:bg-primary"
        }`}
      >
        <div className="flex items-center gap-2">
          {item.icon}
          <span>{item.heading}</span>
        </div>
      </div>
    ))}
  </div>
);

