import React from "react";

function InnerPageCard({ title, children }) {
  return (
    <div className="p-8 bg-white min-h-[85vh] rounded-[24px] shadow-sm border border-slate-100">
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
