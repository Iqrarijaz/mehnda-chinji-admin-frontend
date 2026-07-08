import React from "react";
import { ErrorMessage, Field } from "formik";

const FormField = React.memo(({ label, name, placeholder, type = "text", disabled, required, noLabel, as, rows, ...props }) => {
  return (
    <div className="mb-1.5">
      <div className="grid">
        {!noLabel && (
          <label className="text-[10px] text-slate-500 dark:text-slate-400 font-bold mb-1 transition-colors uppercase tracking-wider" htmlFor={name}>
            {label} {required && <span className="text-red-500">*</span>}
          </label>
        )}
        <Field
          as={as}
          rows={rows}
          type={as === "textarea" ? undefined : type}
          id={name}
          name={name}
          placeholder={placeholder}
          disabled={disabled}
          {...props}
          className={`formit-input focus:outline-none focus:ring-0 focus:border-slate-100 dark:focus:border-slate-800 w-full ${as === 'textarea' ? 'py-2' : '!h-[32px]'} px-4 rounded-none border-2 border-slate-100 dark:border-slate-800 dark:bg-slate-900/40 dark:text-slate-100 transition-all font-sans font-bold text-[11px] text-slate-800 transition-colors ${props.className || ""}`}
        />
      </div>

      <ErrorMessage name={name} component="div" className="text-red-500 text-xs mt-1 font-medium" />
    </div>
  );
});

export default FormField;
