import React from "react";
import { Controller } from "react-hook-form";
import { Switch } from "antd";

export const RHFSwitch = ({ name, control, label, ...rest }) => {
    return (
        <Controller
            name={name}
            control={control}
            render={({ field: { value, onChange, ...field }, fieldState: { error } }) => (
                <div className="flex items-center gap-3">
                    <Switch
                        {...field}
                        checked={value}
                        onChange={onChange}
                        {...rest}
                    />
                    {label && (
                        <label className="text-sm font-semibold text-[#006666]">
                            {label}
                        </label>
                    )}
                    {error && (
                        <div className="text-red-500 text-xs mt-1">{error.message}</div>
                    )}
                </div>
            )}
        />
    );
};
