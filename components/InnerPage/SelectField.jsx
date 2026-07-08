import React from "react";
import { Field, ErrorMessage } from "formik";

const SelectField = ({ label, name, options, defVal, required, ...props }) => {
  return (
    <div className="mb-1.5 grid">
      <label className="text-[10px] text-slate-500 dark:text-slate-400 font-bold mb-1 transition-colors uppercase tracking-wider" htmlFor={name}>
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <Field
        as="select"
        className="formit-input focus:outline-none focus:ring-0 focus:border-slate-100 dark:focus:border-slate-800 w-full bg-white select-field !h-[32px] px-4 rounded-none border-2 border-slate-100 dark:border-slate-800 dark:bg-slate-900/40 dark:text-slate-100 transition-all font-sans font-bold text-[11px] text-slate-800"
        id={name}
        name={name}
        {...props}
      >
        <option value="" label={`Select ${label.toLowerCase()}`} />
        {options?.map((option) => (
          <option defaultValue={defVal} key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </Field>
      <ErrorMessage name={name} component="div" className="error" />
    </div>
  );
};

export default SelectField;
