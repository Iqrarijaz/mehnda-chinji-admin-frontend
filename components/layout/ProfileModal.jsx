"use client";
import React, { useEffect, useState } from "react";
import { Modal, Button, Avatar, Divider, Tag, Input, Tooltip } from "antd";
import { toast } from "react-toastify";
import {
    UserOutlined,
    LogoutOutlined,
    MailOutlined,
    PhoneOutlined,
    SafetyCertificateOutlined,
    CheckOutlined,
    CloseOutlined,
    CameraOutlined,
    ShieldCheckOutlined
} from "@ant-design/icons";
import { FaShieldAlt, FaSignOutAlt, FaUserCircle, FaCheckCircle } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { LOGOUT } from "@/app/api/login";

const ProfileModal = ({ open, onCancel }) => {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState({ name: "", phone: "" });
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    useEffect(() => {
        if (open) {
            const userData = localStorage.getItem("userData");
            if (userData) {
                try {
                    const parsed = JSON.parse(userData);
                    setUser(parsed);
                    setEditForm({
                        name: parsed?.adminData?.name || "",
                        phone: parsed?.adminData?.phone || "",
                    });
                } catch (e) {
                    console.error("Failed to parse user data", e);
                }
            }
        }
    }, [open]);

    const handleLogout = async () => {
        setIsLoggingOut(true);
        try {
            await LOGOUT();
            toast.success("Logged out successfully");
        } catch (error) {
            console.error("Server logout failed:", error);
        } finally {
            localStorage.clear();
            router.push("/");
            onCancel();
            setIsLoggingOut(false);
        }
    };

    const handleSave = () => {
        if (!editForm.name.trim()) {
            toast.warning("Name cannot be empty");
            return;
        }
        try {
            const userData = JSON.parse(localStorage.getItem("userData"));
            const updatedUser = {
                ...userData,
                adminData: {
                    ...userData.adminData,
                    name: editForm.name.trim(),
                    phone: editForm.phone.trim(),
                }
            };
            localStorage.setItem("userData", JSON.stringify(updatedUser));
            setUser(updatedUser);
            setIsEditing(false);
            toast.success("Profile updated successfully");
        } catch (error) {
            toast.error("Failed to update profile locally");
        }
    };

    const handleCancelEdit = () => {
        setEditForm({
            name: user?.adminData?.name || "",
            phone: user?.adminData?.phone || "",
        });
        setIsEditing(false);
    };

    return (
        <Modal
            open={open}
            onCancel={onCancel}
            footer={null}
            centered
            width={400}
            className="modern-modal profile-modal-modern"
        >
            <div className="flex flex-col items-center py-2">
                {/* Profile Header Section */}
                <div className="relative mb-6 mt-2">
                    <div className="relative p-1.5 bg-gradient-to-tr from-teal-600 to-teal-400 rounded-full shadow-lg">
                        <Avatar
                            size={100}
                            icon={<UserOutlined />}
                            className="bg-white text-teal-600 border-4 border-white"
                            src={user?.adminData?.profileImage}
                        />
                        {!isEditing && (
                            <Tooltip title="Update Photo">
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="absolute bottom-0 right-0 bg-teal-600 text-white p-2 rounded-full shadow-md hover:bg-teal-700 transition-all border-2 border-white flex items-center justify-center transform hover:scale-110"
                                >
                                    <CameraOutlined style={{ fontSize: '12px' }} />
                                </button>
                            </Tooltip>
                        )}
                    </div>
                </div>

                {/* Name and Role Section */}
                <div className="text-center px-6 w-full mb-6">
                    {isEditing ? (
                        <Input
                            prefix={<UserOutlined className="text-slate-400 mr-2" />}
                            value={editForm.name}
                            onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                            placeholder="Full Name"
                            className="!h-[44px] !rounded !border-2 !border-slate-100 focus:!border-teal-500 !text-center !font-bold !text-slate-800"
                        />
                    ) : (
                        <>
                            <h2 className="text-2xl font-black text-slate-800 tracking-tight leading-tight">
                                {user?.adminData?.name || "Administrator"}
                            </h2>
                            <p className="text-[10px] font-black text-teal-600 uppercase tracking-[0.2em] mt-1 opacity-80">
                                {user?.adminData?.role?.replace(/_/g, " ") || "SUPER ADMIN"}
                            </p>
                        </>
                    )}
                </div>

                {/* Verification Badge - Redesigned */}
                <div className="w-full px-8 mb-6">
                    <div className="flex items-center justify-center gap-2.5 bg-teal-50/50 py-3 px-4 rounded border border-teal-100/50 shadow-sm">
                        <FaCheckCircle className="text-teal-500" size={16} />
                        <span className="text-[11px] font-black text-teal-700 uppercase tracking-widest">Account Active & Verified</span>
                    </div>
                </div>

                {/* Details Section */}
                <div className="w-full space-y-4 px-8 mb-8">
                    <div className="flex flex-col gap-1.5">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em] ml-1">Email Terminal</span>
                        <div className="flex items-center gap-3 text-slate-600 bg-slate-50/50 p-3.5 rounded border border-slate-100 transition-all">
                            <MailOutlined className="text-teal-600" />
                            <span className="text-sm font-semibold truncate">{user?.adminData?.email || "N/A"}</span>
                        </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em] ml-1">Secure Contact</span>
                        {isEditing ? (
                            <Input
                                prefix={<PhoneOutlined className="text-teal-600 mr-2" />}
                                value={editForm.phone}
                                onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                                placeholder="Phone Number"
                                className="!h-[44px] !rounded !border-2 !border-slate-100 focus:!border-teal-500"
                            />
                        ) : (
                            <div className="flex items-center gap-3 text-slate-700 bg-white p-3.5 rounded border border-slate-100 shadow-sm transition-all hover:border-teal-100">
                                <PhoneOutlined className="text-teal-600" />
                                <span className="text-sm font-bold">{user?.adminData?.phone || "N/A"}</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="w-full px-8 pb-4">
                    {isEditing ? (
                        <div className="flex gap-3 w-full">
                            <Button
                                onClick={handleCancelEdit}
                                className="modal-footer-btn-secondary flex-1"
                                icon={<CloseOutlined />}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="primary"
                                onClick={handleSave}
                                className="modal-footer-btn-primary flex-1 !shadow-teal-900/10"
                                icon={<CheckOutlined />}
                            >
                                Save
                            </Button>
                        </div>
                    ) : (
                        <Button
                            type="primary"
                            danger
                            icon={<FaSignOutAlt />}
                            onClick={handleLogout}
                            loading={isLoggingOut}
                            className="modal-footer-btn-danger w-full !bg-gradient-to-r !from-red-600 !to-red-500 !border-none !shadow-xl !shadow-red-500/10"
                        >
                            Sign Out Account
                        </Button>
                    )}
                </div>
            </div>
        </Modal>
    );
};

export default ProfileModal;
