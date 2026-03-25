import React from "react";
import { ErrorMessage, Field } from "formik";

const FormField = React.memo(({ label, name, placeholder, type = "text", disabled, required }) => {
  return (
    <div className="mb-1.5">
      <div className="grid">
        <label className="text-slate-700 font-semibold text-xs mb-1" htmlFor={name}>
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        <Field
          className="formit-input focus:outline-none w-full !h-[32px] px-4 rounded border-2 border-slate-100 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all font-sans text-[12px] text-slate-600"
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
