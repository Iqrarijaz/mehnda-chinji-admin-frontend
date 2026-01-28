import React from "react";

function InnerPageCard({ title, children }) {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {title && (
          <h1 className="text-2xl font-semibold text-gray-900 mb-6">
            {title}
          </h1>
        )}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          {children}
        </div>
      </div>
    </div>
  );
}

export default InnerPageCard;
