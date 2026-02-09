"use client";
import React from "react";
import { Modal } from "antd";
import { useRouter } from "next/navigation";
import { FaClock } from "react-icons/fa";

const SessionExpiredModal = ({ isOpen, onClose }) => {
    const router = useRouter();

    const handleLogin = () => {
        // Clear all stored data
        localStorage.clear();
        // Close modal and redirect to login
        if (onClose) onClose();
        router.push("/");
    };

    return (
        <Modal
            open={isOpen}
            footer={null}
            centered
            closable={false}
            maskClosable={false}
            width={380}
            className="session-expired-modal"
        >
            <div className="flex flex-col items-center text-center p-6 bg-white rounded-lg">
                {/* Icon */}
                <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mb-4">
                    <FaClock size={28} className="text-amber-500" />
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Session Expired
                </h3>

                {/* Description */}
                <p className="text-gray-500 mb-6 text-sm px-2">
                    Your session has expired due to inactivity. Please log in again to continue using the application.
                </p>

                {/* Login Button */}
                <button
                    onClick={handleLogin}
                    className="w-full px-4 py-3 bg-[#0F172A] hover:bg-[#1e293b] rounded-lg text-white font-semibold transition-all transform hover:scale-[1.01] focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 shadow-lg"
                >
                    Login Again
                </button>
            </div>
        </Modal>
    );
};

export default SessionExpiredModal;
