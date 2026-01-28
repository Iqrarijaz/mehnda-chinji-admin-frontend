// popHoverContent.jsx

export const popoverContent = (menu, record) => (
  <div className="flex flex-col min-w-[140px] bg-white">
    {menu.map((item, index) => (
      <div
        key={index}
        onClick={() => item.handleFunction(record)}
        className={`px-4 py-2.5 cursor-pointer transition-colors duration-200 text-sm font-medium border-b border-gray-50 last:border-b-0 ${item.heading === "Delete"
            ? "text-red-600 hover:bg-red-50"
            : "text-gray-700 hover:bg-teal-50 hover:text-teal-700"
          }`}
      >
        <div className="flex items-center gap-3">
          <span className="opacity-70">{item.icon}</span>
          <span>{item.heading}</span>
        </div>
      </div>
    ))}
  </div>
);

