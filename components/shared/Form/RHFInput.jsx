import React from "react";
import { Controller } from "react-hook-form";

export const RHFInput = ({ name, control, label, placeholder, type = "text", required, noLabel, labelClassName, ...rest }) => {
    return (
        <Controller
            name={name}
            control={control}
            render={({ field, fieldState: { error } }) => (
                <div className="mb-1.5">
                    <div className="grid">
                        {!noLabel && label && (
                            <label className={labelClassName || "text-slate-700 dark:text-slate-400 font-semibold text-xs mb-1 transition-colors"} htmlFor={name}>
                                {label} {required && <span className="text-red-500">*</span>}
                            </label>
                        )}
                        {type === "textarea" ? (
                            <textarea
                                {...field}
                                id={name}
                                placeholder={placeholder}
                                className={`formit-input focus:outline-none w-full !h-auto min-h-[64px] px-4 py-2 rounded-none border-2 border-slate-100 dark:border-slate-800 dark:bg-slate-900/40 dark:text-slate-300 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all font-sans text-[12px] text-slate-600 ${error ? "border-red-500" : ""} ${rest.className || ""}`}
                                {...rest}
                            />
                        ) : (
                            <input
                                {...field}
                                type={type}
                                id={name}
                                placeholder={placeholder}
                                className={`formit-input focus:outline-none w-full !h-[32px] px-4 rounded-none border-2 border-slate-100 dark:border-slate-800 dark:bg-slate-900/40 dark:text-slate-300 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all font-sans text-[12px] text-slate-600 ${error ? "border-red-500" : ""} ${rest.className || ""}`}
                                {...rest}
                            />
                        )}
                    </div>
                    {error && (
                        <div className="text-red-500 text-xs mt-1 font-medium">{error.message}</div>
                    )}
                </div>
            )}
        />
    );
};
