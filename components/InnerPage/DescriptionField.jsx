import React from "react";
import { ErrorMessage, Field } from "formik";

const DescriptionField = ({
  label,
  name,
  placeholder = "",
  disabled,
  col = "50",
  rows = "4",
}) => {
  return (
    <div className="mb-3">
      <div className="grid">
        <label className="text-black font-[500] mb-1" htmlFor={name}>
          {label}
        </label>
        <Field
          as="textarea"
          className="formit-input focus:outline-none w-full"
          id={name}
          name={name}
          placeholder={placeholder}
          rows={rows}
          cols={col}
          disabled={disabled}
        />
      </div>

      <ErrorMessage name={name} component="div" className="error" />
    </div>
  );
};

export default DescriptionField;
