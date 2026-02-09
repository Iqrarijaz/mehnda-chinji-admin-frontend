import React from "react";
import { Modal } from "antd";
import { FaExclamationTriangle, FaInfoCircle } from "react-icons/fa";

const ConfirmModal = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    description,
    confirmText = "Confirm",
    cancelText = "Cancel",
    variant = "primary",  // 'primary' or 'danger'
    loading = false
}) => {

    // Icon selection based on variant
    const renderIcon = () => {
        if (variant === "danger") {
            return (
                <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center mb-3 text-red-500">
                    <FaExclamationTriangle size={20} />
                </div>
            );
        }
        return (
            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center mb-3 text-primary">
                <FaInfoCircle size={20} />
            </div>
        );
    };

    return (
        <Modal
            open={isOpen}
            onCancel={onClose}
            footer={null}
            centered
            closable={false}
            width={350}
            className="confirm-modal-custom"
        >
            <div className="flex flex-col items-center text-center p-5 bg-white rounded-lg">
                {renderIcon()}

                <h3 className="text-lg font-bold text-gray-900 mb-2">
                    {title}
                </h3>

                <p className="text-gray-500 mb-6 text-sm px-2">
                    {description}
                </p>

                <div className="flex gap-2 w-full">
                    <button
                        onClick={onClose}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm text-gray-700 font-medium hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-200"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={loading}
                        className={`
                            flex-1 px-3 py-2 rounded text-sm text-white font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2
                            ${variant === 'danger'
                                ? 'bg-red-500 hover:bg-red-600 focus:ring-red-500'
                                : 'bg-primary hover:bg-[#1e293b] focus:ring-primary'
                            }
                            ${loading ? 'opacity-70 cursor-not-allowed' : ''}
                        `}
                    >
                        {loading ? 'Processing...' : confirmText}
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default ConfirmModal;
