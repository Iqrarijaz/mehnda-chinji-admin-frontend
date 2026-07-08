import React from "react";

function InnerPageCard({ title, extra, children, className = "" }) {
  return (
    <div className={`min-h-[85vh] ${className}`}>
      {(title || extra) && (
        <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
          {title ? (
            <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
              {title}
            </h1>
          ) : <div />}
          {extra && <div>{extra}</div>}
        </div>
      )}
      <div className={className.includes("flex") ? "flex-1 min-h-0 flex flex-col overflow-hidden" : ""}>
        {children}
      </div>
    </div>
  );
}

export default InnerPageCard;
