"use client";
import React, { useEffect, useState } from "react";
import { Modal, Button, Avatar, Divider, Tag, Input, message, Tooltip } from "antd";
import { UserOutlined, LogoutOutlined, MailOutlined, PhoneOutlined, SafetyCertificateOutlined, CheckOutlined, CloseOutlined, CameraOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";

const ProfileModal = ({ open, onCancel }) => {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState({ name: "", phone: "" });

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

    const handleLogout = () => {
        localStorage.clear();
        router.push("/");
        onCancel();
    };

    const handleSave = () => {
        if (!editForm.name.trim()) {
            message.warning("Name cannot be empty");
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
            message.success("Profile updated successfully");
        } catch (error) {
            message.error("Failed to update profile locally");
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
            width={420}
            className="profile-modal-custom"
        >
            <div className="flex flex-col items-center py-4">
                {/* Profile Header Section */}
                <div className="relative mb-6">
                    <div className="relative group p-1 bg-gradient-to-tr from-[#0F172A] to-blue-500 rounded-full">
                        <Avatar
                            size={110}
                            icon={<UserOutlined />}
                            className="bg-white text-[#0F172A] border-4 border-white shadow-xl"
                            src={user?.adminData?.profileImage}
                        />
                        {!isEditing && (
                            <Tooltip title="Edit Profile">
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="absolute bottom-1 right-1 bg-[#0F172A] text-white p-2.5 rounded-full shadow-lg hover:bg-black transition-all transform hover:scale-110 border-2 border-white flex items-center justify-center"
                                >
                                    <CameraOutlined style={{ fontSize: '14px' }} />
                                </button>
                            </Tooltip>
                        )}
                    </div>
                </div>

                {/* Name and Role Section */}
                {isEditing ? (
                    <div className="w-full px-8 mb-4">
                        <Input
                            prefix={<UserOutlined className="text-gray-400 mr-1" />}
                            value={editForm.name}
                            onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                            placeholder="Full Name"
                            className="text-center font-semibold text-base rounded-xl h-11 border-blue-100 hover:border-[#0F172A] focus:border-[#0F172A]"
                        />
                    </div>
                ) : (
                    <div className="text-center mb-1">
                        <h2 className="text-2xl font-extrabold text-[#0F172A] tracking-tight">
                            {user?.adminData?.name || "Administrator"}
                        </h2>
                    </div>
                )}

                <Tag bordered={false} className="bg-blue-50 text-blue-600 rounded-full px-5 py-0.5 mb-6 font-bold text-[11px] tracking-widest uppercase shadow-sm">
                    {user?.adminData?.role?.replace(/_/g, " ") || "SUPER ADMIN"}
                </Tag>

                <Divider className="my-2 border-gray-100" />

                {/* Details Section */}
                <div className="w-full space-y-3 px-6 py-4">
                    <div className="group flex flex-col gap-1">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Email Address</span>
                        <div className="flex items-center gap-3 text-gray-500 bg-gray-50/50 p-3.5 rounded-2xl border border-gray-100/80 transition-all">
                            <MailOutlined className="text-[#0F172A] text-lg" />
                            <span className="text-sm font-medium truncate">{user?.adminData?.email || "N/A"}</span>
                            <div className="ml-auto">
                                <SafetyCertificateOutlined className="text-green-500" />
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col gap-1">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Contact Number</span>
                        {isEditing ? (
                            <Input
                                prefix={<PhoneOutlined className="text-[#0F172A] mr-2" />}
                                value={editForm.phone}
                                onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                                placeholder="Phone Number"
                                className="rounded-2xl h-12 border-gray-200 hover:border-[#0F172A] focus:border-[#0F172A]"
                            />
                        ) : (
                            <div className="flex items-center gap-3 text-gray-700 bg-white p-3.5 rounded-2xl border border-gray-100 shadow-sm transition-all hover:border-blue-100">
                                <PhoneOutlined className="text-[#0F172A] text-lg" />
                                <span className="text-sm font-semibold">{user?.adminData?.phone || "N/A"}</span>
                            </div>
                        )}
                    </div>

                    <div className="flex items-center gap-3 text-gray-500 bg-green-50/30 p-3 rounded-2xl border border-green-100/50 mt-4">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                        <span className="text-[11px] font-bold text-green-700 uppercase tracking-wider">Account Active & Verified</span>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="w-full px-6 mt-4">
                    {isEditing ? (
                        <div className="flex gap-3 w-full">
                            <Button
                                onClick={handleCancelEdit}
                                className="flex-1 h-12 rounded-2xl border-gray-200 font-bold text-gray-500 hover:text-red-500 hover:border-red-100"
                                icon={<CloseOutlined />}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="primary"
                                onClick={handleSave}
                                className="flex-1 h-12 rounded-2xl bg-[#0F172A] border-none font-bold shadow-lg shadow-blue-900/10"
                                icon={<CheckOutlined />}
                            >
                                Save Changes
                            </Button>
                        </div>
                    ) : (
                        <Button
                            type="primary"
                            danger
                            icon={<LogoutOutlined />}
                            onClick={handleLogout}
                            className="w-full h-12 rounded-2xl font-bold flex items-center justify-center hover:scale-[1.01] transition-all shadow-lg shadow-red-900/10 border-none bg-gradient-to-r from-red-600 to-red-500"
                        >
                            Sign Out
                        </Button>
                    )}
                </div>
            </div>
        </Modal>
    );
};

export default ProfileModal;
