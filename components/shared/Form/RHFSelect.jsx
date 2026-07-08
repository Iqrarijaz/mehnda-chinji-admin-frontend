import React from "react";
import { Controller } from "react-hook-form";
import { Select } from "antd";

export const RHFSelect = ({ name, control, label, options, placeholder, ...rest }) => {
    return (
        <Controller
            name={name}
            control={control}
            render={({ field, fieldState: { error } }) => (
                <div>
                    {label && (
                        <label className="block text-sm font-semibold text-[#006666] mb-1">
                            {label}
                        </label>
                    )}
                    <Select
                        {...field}
                        placeholder={placeholder}
                        options={options}
                        className={`w-full custom-selectbox ${error ? "border-red-500" : ""} ${rest.className || ""}`}
                        {...rest}
                    />
                    {error && (
                        <div className="text-red-500 text-xs mt-1">{error.message}</div>
                    )}
                </div>
            )}
        />
    );
};
