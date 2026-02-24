import React from "react";

function InnerPageCard({ title, children }) {
  return (
    <div className="p-4 bg-white min-h-[85vh] rounded-xl shadow-sm border border-gray-100">
      {title && (
        <h1 className="text-2xl font-semibold text-gray-900 mb-4">
          {title}
        </h1>
      )}
      <div>
        {children}
      </div>
    </div>
  );
}

export default InnerPageCard;
