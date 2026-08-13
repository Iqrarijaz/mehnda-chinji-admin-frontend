import { Modal } from "antd";
import { ExclamationCircleOutlined, InfoCircleOutlined } from "@ant-design/icons";
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
                    className={`w-16 h-16 rounded-[6px] flex items-center justify-center mb-6 border-0 ${isDanger
                        ? "bg-red-50 dark:bg-red-950/20 text-red-500"
                        : "bg-teal-50 dark:bg-teal-950/20 text-teal-600 dark:text-teal-400"
                        }`}
                >
                    {isDanger ? <ExclamationCircleOutlined className="text-3xl" /> : <InfoCircleOutlined className="text-3xl" />}
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
