

import React from "react";

function InnerPageCard({ title, children }) {
  return (
    // <div className="p-4 md:p-8 bg-white min-h-[85vh] rounded-xl md:rounded-[24px] shadow-sm border border-slate-100">
    <div className="min-h-[85vh]">
      {title && (
        <h1 className="text-xl font-bold text-slate-900 mb-6 tracking-tight">
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
