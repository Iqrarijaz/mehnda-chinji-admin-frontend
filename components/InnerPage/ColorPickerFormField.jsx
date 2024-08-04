import React from "react";
import { ErrorMessage, Field } from "formik";
import { Button } from "antd";

const ColorPickerFormField = ({
  label,
  name,
  placeholder,
  type = "text",
  disabled,
  onClick,
  colorModal,
}) => {
  return (
    <div className="grid mb-3">
      <label className="text-black font-[500] mb-1" htmlFor={name}>
        {label}
      </label>
      <div className="input-container relative">
        <Field
          className="formit-input focus:outline-none w-full border-r-0 pr-10"
          type={type}
          id={name}
          name={name}
          placeholder={placeholder}
          disabled={disabled}
          value={colorModal?.colorCode}
        />
        <Button
          className={`absolute top-0 bottom-0 border-2 border-lightBlue right-1 !m-auto rounded-lg focus:outline-none border-none item-center`}
          onClick={onClick}
          style={{
            backgroundColor: colorModal?.colorCode ?? "#5790d4",
          }}
        >
          Pick Color
        </Button>
      </div>
      <ErrorMessage name={name} component="div" className="error" />
    </div>
  );
};

export default ColorPickerFormField;
