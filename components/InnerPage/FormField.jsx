import React from "react";
import { ErrorMessage, Field } from "formik";

const FormField = React.memo(({ label, name, placeholder, type = "text", disabled, required, noLabel }) => {
  return (
    <div className="mb-1.5">
      <div className="grid">
        {!noLabel && (
          <label className="text-slate-700 dark:text-slate-400 font-semibold text-xs mb-1 transition-colors" htmlFor={name}>
            {label} {required && <span className="text-red-500">*</span>}
          </label>
        )}
        <Field
          className="formit-input focus:outline-none w-full !h-[32px] px-4 rounded border-2 border-slate-100 dark:border-slate-800 dark:bg-slate-900/40 dark:text-slate-300 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all font-sans text-[12px] text-slate-600 transition-colors"
          type={type}
          id={name}
          name={name}
          placeholder={placeholder}
          disabled={disabled}
        />
      </div>

      <ErrorMessage name={name} component="div" className="text-red-500 text-xs mt-1 font-medium" />
    </div>
  );
});

export default FormField;
