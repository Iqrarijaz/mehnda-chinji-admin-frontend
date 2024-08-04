import React from "react";
import { ErrorMessage, Field } from "formik";

const FormField = ({ label, name, placeholder, type = "text", disabled }) => {
  return (
    <div className="mb-3">
      <div className="grid">
          <label className="text-black font-[500] mb-1 " htmlFor={name}>
            {label}
          </label>
        <Field
          className="formit-input focus:outline-none w-full"
          type={type}
          id={name}
          name={name}
          placeholder={placeholder}
          disabled={disabled}
        />
      </div>

      <ErrorMessage name={name} component="div" className="error" />
    </div>
  );
};

export default FormField;
