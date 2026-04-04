import React from "react";
import { Modal } from "antd";
import CustomButton from "./CustomButton";
import { FilterOutlined, CloseOutlined } from "@ant-design/icons";
import { cn } from "@/utils/helper";

/**
 * ResponsiveFilterModal component
 * Adapts to a bottom sheet on mobile devices.
 * 
 * @param {Object} props
 * @param {boolean} props.open - Whether the modal is visible
 * @param {Function} props.onCancel - Click handler for close/cancel
 * @param {Function} props.onApply - Click handler for Apply button
 * @param {Function} props.onReset - Click handler for Reset button
 * @param {string} props.title - Modal title
 * @param {React.ReactNode} props.icon - Optional header icon
 * @param {React.ReactNode} props.children - Modal content (filter inputs)
 * @param {number} props.activeFiltersCount - Number of active filters to display
 */
const ResponsiveFilterModal = ({
  open,
  onCancel,
  onApply,
  onReset,
  title = "Filter",
  icon = <FilterOutlined />,
  children,
  activeFiltersCount = 0,
  className = "",
  ...props
}) => {
  return (
    <Modal
      open={open}
      onCancel={onCancel}
      centered
      width={450}
      className={cn("modern-modal", className)}
      closeIcon={<CloseOutlined className="text-slate-400 hover:text-teal-600 transition-colors" />}
      title={
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded bg-teal-50 dark:bg-teal-900/20 flex items-center justify-center text-teal-600 dark:text-teal-400 shadow-sm transition-colors duration-300">
            {icon}
          </div>
          <div className="flex flex-col">
            <span className="text-base font-bold text-slate-800 dark:text-slate-100 leading-tight transition-colors duration-300">{title}</span>
            {activeFiltersCount > 0 && (
              <span className="text-[10px] font-medium text-teal-600 dark:text-teal-400 uppercase tracking-wider transition-colors duration-300">
                {activeFiltersCount} Active {activeFiltersCount === 1 ? 'Filter' : 'Filters'}
              </span>
            )}
          </div>
        </div>
      }
      footer={[
        <CustomButton
          key="reset"
          label="Reset Filters"
          type="secondary"
          onClick={onReset}
          className="!h-10 px-6 rounded flex-1 md:flex-none order-2 md:order-1"
        />,
        <CustomButton
          key="apply"
          label="Apply Filters"
          type="primary"
          onClick={onApply || onCancel}
          className="!h-10 px-6 rounded flex-[2] md:flex-none order-1 md:order-2"
        />
      ]}
      {...props}
    >
      <div className="flex flex-col gap-4">
        {children}
      </div>
    </Modal>
  );
};

export default ResponsiveFilterModal;
