import { Modal } from "antd";
import { FaExclamationTriangle, FaInfoCircle } from "react-icons/fa";
import CustomButton from "./CustomButton";
import React from "react";

/**
 * Modern SaaS Confirmation Modal
 * Standardized for both Primary (Info) and Danger (Delete) actions.
 */
const ConfirmModal = React.memo(({
    isOpen,
    onClose,
    onConfirm,
    title,
    description,
    confirmText = "Confirm",
    cancelText = "Cancel",
    variant = "primary", // 'primary' or 'danger'
    loading = false
}) => {
    const isDanger = variant === "danger";

    return (
        <Modal
            open={isOpen}
            onCancel={loading ? undefined : onClose}
            footer={null}
            centered
            closable={!loading}
            width={440}
            className="modern-modal"
        >
            <div className="flex flex-col items-center text-center">
                {/* Icon Container with subtle background wrap */}
                <div
                    className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-sm border ${isDanger
                        ? "bg-red-50 border-red-100 text-red-500"
                        : "bg-teal-50 border-teal-100 text-teal-600"
                        }`}
                >
                    {isDanger ? <FaExclamationTriangle size={28} /> : <FaInfoCircle size={28} />}
                </div>

                {/* Text Content */}
                <div className="mb-8">
                    <h3 className="text-xl font-bold text-slate-900 mb-2 leading-tight">
                        {title}
                    </h3>
                    <p className="text-slate-600 text-[15px] leading-relaxed px-4">
                        {description}
                    </p>
                </div>

                {/* Actions Footer */}
                <div className="flex items-center gap-3 w-full">
                    <CustomButton
                        label={cancelText}
                        type="secondary"
                        onClick={onClose}
                        disabled={loading}
                        className="flex-1"
                    />
                    <CustomButton
                        label={loading ? "Processing..." : confirmText}
                        type={isDanger ? "danger" : "primary"}
                        onClick={onConfirm}
                        loading={loading}
                        className="flex-1"
                    />
                </div>
            </div>
        </Modal>
    );
});

export default ConfirmModal;
