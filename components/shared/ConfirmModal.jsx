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

    const isDanger = variant === "danger";

    // Colours derived from variant — mirrors the toast palette
    const palette = isDanger
        ? { bg: "#fee2e2", border: "#fca5a5", iconColor: "#dc2626", blob: "#f87171", btnBg: "#dc2626", btnHover: "#b91c1c", ring: "#dc2626" }
        : { bg: "#dbeafe", border: "#93c5fd", iconColor: "#2563eb", blob: "#60a5fa", btnBg: "#0F172A", btnHover: "#1e293b", ring: "#0F172A" };

    return (
        <Modal
            open={isOpen}
            onCancel={onClose}
            footer={null}
            centered
            closable={false}
            width={350}
            className="confirm-modal-custom"
            styles={{
                content: {
                    background: palette.bg,
                    border: `1px solid ${palette.border}`,
                    overflow: "hidden",
                    position: "relative",
                    padding: 0,
                }
            }}
        >
            {/* Decorative blob — bottom-left, same as toast */}
            <div
                style={{
                    position: "absolute",
                    bottom: -24,
                    left: -14,
                    width: 100,
                    height: 100,
                    borderRadius: "50%",
                    background: palette.blob,
                    opacity: 0.18,
                    pointerEvents: "none",
                }}
            />

            <div className="flex flex-col items-center text-center p-5">

                {/* White icon circle — same as toast icon */}
                <div
                    style={{
                        width: 52,
                        height: 52,
                        borderRadius: "50%",
                        background: "#fff",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.10)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        marginBottom: 12,
                        color: palette.iconColor,
                        flexShrink: 0,
                    }}
                >
                    {isDanger
                        ? <FaExclamationTriangle size={22} />
                        : <FaInfoCircle size={22} />
                    }
                </div>

                <h3 className="text-lg font-bold mb-2" style={{ color: isDanger ? "#7f1d1d" : "#1e3a5f" }}>
                    {title}
                </h3>

                <p className="mb-6 text-sm px-2" style={{ color: isDanger ? "#991b1b" : "#1e40af", opacity: 0.8 }}>
                    {description}
                </p>

                <div className="flex gap-2 w-full">
                    <button
                        onClick={onClose}
                        className="flex-1 px-3 py-2 border rounded text-sm font-medium transition-colors focus:outline-none"
                        style={{ borderColor: palette.border, color: isDanger ? "#7f1d1d" : "#1e3a5f", background: "rgba(255,255,255,0.55)" }}
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={loading}
                        className="flex-1 px-3 py-2 rounded text-sm text-white font-medium transition-colors focus:outline-none"
                        style={{
                            background: palette.btnBg,
                            opacity: loading ? 0.7 : 1,
                            cursor: loading ? "not-allowed" : "pointer",
                        }}
                    >
                        {loading ? "Processing..." : confirmText}
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default ConfirmModal;
