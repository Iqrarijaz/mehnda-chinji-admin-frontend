"use client";
import React from "react";
import { Modal, Button } from "antd";
import { FaClock, FaSignOutAlt, FaShieldAlt } from "react-icons/fa";
import { useRouter } from "next/navigation";

const SessionExpiredModal = ({ open, handleClose }) => {
    const router = useRouter();

    const handleLoginRedirect = () => {
        handleClose();
        router.push("/login");
    };

    return (
        <Modal
            open={open}
            onCancel={handleClose}
            footer={null}
            centered
            closable={false}
            maskClosable={false}
            width={440}
            className="modern-modal"
        >
            <div className="flex flex-col items-center text-center p-4">
                {/* Visual Icon */}
                <div className="w-20 h-20 rounded-full bg-orange-50 flex items-center justify-center text-orange-500 mb-6 animate-pulse">
                    <FaClock size={36} />
                </div>

                {/* Content */}
                <h2 className="text-2xl font-black text-slate-900 mb-2">Session Expired</h2>
                <p className="text-slate-500 text-sm leading-relaxed mb-8 max-w-[280px]">
                    Your login session has timed out for security reasons. Please sign in again to continue.
                </p>

                {/* Actions */}
                <div className="w-full space-y-3">
                    <Button
                        type="primary"
                        onClick={handleLoginRedirect}
                        icon={<FaSignOutAlt className="rotate-180" />}
                        className="modal-footer-btn-primary w-full !h-[52px] !text-base"
                    >
                        Sign In Again
                    </Button>

                    <div className="flex items-center justify-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest pt-2">
                        <FaShieldAlt size={10} />
                        Security Protected Session
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default SessionExpiredModal;
