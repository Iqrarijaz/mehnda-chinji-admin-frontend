"use client";
import React from "react";
import { Modal, Button } from "antd";
import { FaClock, FaSignOutAlt, FaShieldAlt } from "react-icons/fa";
import { useRouter } from "next/navigation";

const SessionExpiredModal = React.memo(({ open, handleClose }) => {
    const router = useRouter();

    const handleLoginRedirect = () => {
        if (typeof window !== "undefined") {
            localStorage.removeItem("userData");
        }
        if (handleClose) {
            handleClose();
        }
        router.push("/");
    };

    return (
        <Modal
            open={open}
            onCancel={handleLoginRedirect}
            footer={null}
            centered
            closable={false}
            maskClosable={false}
            width={400}
            className="modern-modal"
        >
            <div className="flex flex-col items-center text-center p-5">
                {/* Visual Icon */}
                <div className="w-16 h-16 rounded-full bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center text-amber-500 mb-4 animate-pulse border border-amber-200 dark:border-amber-800">
                    <FaClock size={30} />
                </div>

                {/* Content */}
                <h2 className="text-xl font-black text-slate-800 dark:text-slate-100 mb-2">Session Expired</h2>
                <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed mb-6 max-w-[280px]">
                    Your login session has expired or timed out for security reasons. Please sign in again to access the admin portal.
                </p>

                {/* Actions */}
                <div className="w-full space-y-3">
                    <Button
                        type="primary"
                        onClick={handleLoginRedirect}
                        icon={<FaSignOutAlt className="rotate-180" />}
                        className="modal-footer-btn-primary w-full !h-[42px] !text-xs font-bold uppercase tracking-wider bg-[#006666] hover:!bg-[#005555]"
                    >
                        Sign In Again
                    </Button>

                    <div className="flex items-center justify-center gap-1.5 text-[9px] font-bold text-slate-400 uppercase tracking-widest pt-1">
                        <FaShieldAlt size={10} />
                        Security Protected Session
                    </div>
                </div>
            </div>
        </Modal>
    );
});

SessionExpiredModal.displayName = "SessionExpiredModal";

export default SessionExpiredModal;
