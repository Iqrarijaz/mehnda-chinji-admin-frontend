import React from "react";

function InnerPageCard({ title, children }) {
  return (
    <div className="min-h-[85vh]">
      {title && (
        <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-6 tracking-tight">
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
