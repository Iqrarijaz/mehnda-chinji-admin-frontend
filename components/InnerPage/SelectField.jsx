import React from "react";
import { Field, ErrorMessage } from "formik";

const SelectField = ({ label, name, options, defVal }) => {
  return (
    <div className="grid mb-3">
      <label className="text-black font-[500] mb-1 p-0" htmlFor={name}>
        {label}
      </label>
      <Field
        as="select"
        className="formit-input focus:outline-none w-[320px] bg-white select-field h-10 "
        id={name}
        name={name}
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
