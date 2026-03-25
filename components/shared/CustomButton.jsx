import { Button } from "antd";
import React from "react";
import { cn } from "@/utils/helper";

/**
 * CustomButton component for standardized modal actions
 * @param {Object} props
 * @param {string} props.label - Button text
 * @param {Function} props.onClick - Click handler
 * @param {string} props.type - 'primary', 'secondary', 'danger'
 * @param {boolean} props.loading - Loading state
 * @param {string} props.htmlType - 'button', 'submit', 'reset'
 * @param {React.ReactNode} props.icon - Optional icon
 * @param {string} props.className - Additional classes
 * @param {boolean} props.disabled - Disabled state
 */
const CustomButton = ({
  label,
  onClick,
  type = "primary",
  loading = false,
  htmlType = "button",
  icon = null,
  className = "",
  disabled = false,
  ...props
}) => {
  const getVariantClasses = () => {
    switch (type) {
      case "primary":
        return "!bg-[#006666] !text-white border-none shadow-lg shadow-teal-400/10 hover:!bg-[#004d4d]";
      case "secondary":
        return "!bg-white !text-slate-600 !border-slate-200 hover:!border-slate-300 hover:!bg-slate-50";
      case "danger":
        return "!bg-red-500 !text-white border-none shadow-lg shadow-red-400/10 hover:!bg-red-600";
      default:
        return "";
    }
  };

  return (
    <Button
      onClick={onClick}
      htmlType={htmlType}
      loading={loading}
      disabled={disabled}
      className={cn(
        "!h-[32px] !px-4 !rounded-lg text-xs transition-all flex items-center justify-center gap-2 font-medium",
        getVariantClasses(),
        className
      )}
      {...props}
    >
      {icon && icon}
      {label}
    </Button>
  );
};

export default CustomButton;
