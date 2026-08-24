"use client";
import React, { useState, useEffect } from "react";
import { Modal, Input, InputNumber, Switch, Select } from "antd";
import { toast } from "react-toastify";

export const GroupEditModal = React.memo(({ visible, onCancel, onSave, initialData }) => {
    const [formData, setFormData] = useState(initialData || {});

    useEffect(() => {
        setFormData(initialData || { isActive: true, order: 1, appVersions: [], items: [] });
    }, [initialData, visible]);

    return (
        <Modal
            title={<span className="font-bold text-[#006666] dark:text-teal-400">Utility Category Group</span>}
            open={visible}
            onCancel={onCancel}
            onOk={() => {
                if (!formData.id?.trim() || !formData.title?.trim()) {
                    toast.error("Group ID and Title are required");
                    return;
                }
                onSave(formData);
                onCancel();
            }}
            okText="Save Group"
            okButtonProps={{ className: "!bg-[#006666] hover:!bg-teal-700 border-0" }}
            centered
            width={480}
        >
            <div className="space-y-4 py-2">
                <div>
                    <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                        Group ID <span className="text-red-500">*</span>
                    </label>
                    <Input
                        value={formData.id}
                        onChange={(e) => setFormData({ ...formData, id: e.target.value.toLowerCase().trim() })}
                        placeholder="e.g. islamic, finance, sports"
                        className="rounded-lg"
                    />
                </div>

                <div>
                    <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                        Group Title <span className="text-red-500">*</span>
                    </label>
                    <Input
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        placeholder="e.g. Islamic Utilities, Finance & Rates"
                        className="rounded-lg"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                            Group Order
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
                            Group Status
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
                        Target App Versions <span className="text-slate-400 font-normal">(Leave empty for all)</span>
                    </label>
                    <Select
                        mode="tags"
                        value={formData.appVersions || []}
                        onChange={(vals) => setFormData({ ...formData, appVersions: vals })}
                        placeholder="All versions"
                        className="w-full"
                        tokenSeparators={[","]}
                    />
                </div>
            </div>
        </Modal>
    );
});

GroupEditModal.displayName = "GroupEditModal";
