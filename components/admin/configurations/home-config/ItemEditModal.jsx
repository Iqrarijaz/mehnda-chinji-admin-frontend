"use client";
import React, { useState, useEffect } from "react";
import { Modal, Button, Input, InputNumber, Switch, Select, Upload, Tag } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { toast } from "react-toastify";
import { UPLOAD_PUBLIC_IMAGE } from "@/app/api/admin/public";

export const ItemEditModal = React.memo(({ visible, onCancel, onSave, initialData, title }) => {
    const [formData, setFormData] = useState(initialData || {});
    const [isUploading, setIsUploading] = useState(false);

    useEffect(() => {
        setFormData(initialData || { isActive: true, order: 1, appVersions: [] });
    }, [initialData, visible]);

    const handleUpload = async (options) => {
        const { file, onSuccess, onError } = options;
        const body = new FormData();
        body.append("image", file);
        setIsUploading(true);
        try {
            const res = await UPLOAD_PUBLIC_IMAGE(body);
            if (res.success && res.data?.imageUrl) {
                setFormData((prev) => ({ ...prev, icon: res.data.imageUrl }));
                onSuccess(res.data);
                toast.success("Icon uploaded successfully!");
            } else {
                throw new Error(res.message || "Upload failed");
            }
        } catch (err) {
            onError(err);
            toast.error(err.message || "Failed to upload icon");
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <Modal
            title={<span className="font-bold text-[#006666] dark:text-teal-400">{title || "Edit Item"}</span>}
            open={visible}
            onCancel={onCancel}
            onOk={() => {
                if (!formData.id?.trim() || !formData.label?.trim()) {
                    toast.error("ID and Label are required");
                    return;
                }
                onSave(formData);
                onCancel();
            }}
            okText="Save"
            okButtonProps={{ className: "!bg-[#006666] hover:!bg-teal-700 border-0" }}
            centered
            width={540}
        >
            <div className="space-y-4 py-2">
                <div>
                    <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                        Unique ID <span className="text-red-500">*</span>
                    </label>
                    <Input
                        value={formData.id}
                        onChange={(e) => setFormData({ ...formData, id: e.target.value.toLowerCase().trim() })}
                        placeholder="e.g. emergency, quran, fuel"
                        className="rounded-lg"
                    />
                </div>

                <div>
                    <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                        Display Label <span className="text-red-500">*</span>
                    </label>
                    <Input
                        value={formData.label}
                        onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                        placeholder="e.g. Emergency, Quran Majeed"
                        className="rounded-lg"
                    />
                </div>

                <div>
                    <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                        Navigation Route
                    </label>
                    <Input
                        value={formData.route}
                        onChange={(e) => setFormData({ ...formData, route: e.target.value })}
                        placeholder="e.g. /listing/emergency or /quran"
                        className="rounded-lg"
                    />
                </div>

                <div>
                    <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                        Icon URL / Icon Name
                    </label>
                    <div className="flex gap-2">
                        <Input
                            value={formData.icon}
                            onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                            placeholder="https://... or trophy-outline or local key"
                            className="rounded-lg flex-1"
                        />
                        <Upload customRequest={handleUpload} showUploadList={false} accept="image/*">
                            <Button icon={<UploadOutlined />} loading={isUploading} className="border-0 bg-slate-100 dark:bg-slate-800">
                                Upload
                            </Button>
                        </Upload>
                    </div>
                    {formData.icon && (
                        <div className="mt-2 flex items-center gap-2 p-2 bg-slate-50 dark:bg-slate-800/60 rounded-lg border-0">
                            <span className="text-[11px] text-slate-500">Preview:</span>
                            {formData.icon.startsWith("http") ? (
                                <img src={formData.icon} alt="icon" className="w-8 h-8 object-contain" />
                            ) : (
                                <Tag color="cyan" className="border-0">{formData.icon}</Tag>
                            )}
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                            Display Order
                        </label>
                        <InputNumber
                            value={formData.order}
                            onChange={(val) => setFormData({ ...formData, order: val || 1 })}
                            min={1}
                            className="w-full rounded-lg"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                            Status (Toggle Active)
                        </label>
                        <div className="pt-1">
                            <Switch
                                checked={formData.isActive !== false}
                                onChange={(checked) => setFormData({ ...formData, isActive: checked })}
                                checkedChildren="Active"
                                unCheckedChildren="Hidden"
                                className="bg-slate-300 dark:bg-slate-700"
                            />
                        </div>
                    </div>
                </div>

                <div>
                    <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                        Target App Versions <span className="text-slate-400 font-normal">(Leave empty for all versions)</span>
                    </label>
                    <Select
                        mode="tags"
                        value={formData.appVersions || []}
                        onChange={(vals) => setFormData({ ...formData, appVersions: vals })}
                        placeholder="All versions (or type e.g. 2.0.8 and press Enter)"
                        className="w-full"
                        tokenSeparators={[","]}
                    />
                </div>
            </div>
        </Modal>
    );
});

ItemEditModal.displayName = "ItemEditModal";
