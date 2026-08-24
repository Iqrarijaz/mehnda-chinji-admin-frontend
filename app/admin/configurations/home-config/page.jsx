"use client";
import React, { useState, useEffect, useMemo } from "react";
import {
    Tabs,
    Button,
    Switch,
    Input,
    InputNumber,
    Select,
    Modal,
    Popconfirm,
    Upload,
    Tag,
    Tooltip,
    Empty,
} from "antd";
import {
    PlusOutlined,
    DeleteOutlined,
    SaveOutlined,
    ReloadOutlined,
    UploadOutlined,
    EyeOutlined,
    AppstoreOutlined,
    AppstoreAddOutlined,
    ToolOutlined,
    MobileOutlined,
} from "@ant-design/icons";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { FaThLarge, FaLayerGroup, FaImage } from "react-icons/fa";

import { GET_CONFIGURATIONS, UPDATE_CONFIGURATION, CREATE_CONFIGURATION } from "@/app/api/admin/configurations";
import { UPLOAD_PUBLIC_IMAGE } from "@/app/api/admin/public";
import { ADMIN_KEYS } from "@/constants/queryKeys";
import ConfigPreview from "@/components/admin/configurations/ConfigPreview";

const DEFAULT_CONFIG_DATA = {
    categories: [
        { id: "emergency", label: "Emergency", icon: "https://cdn.example.com/icons/emergency.webp", route: "/listing/emergency", isActive: true, order: 1, appVersions: [] },
        { id: "education", label: "Education", icon: "https://cdn.example.com/icons/education_icon.webp", route: "/listing/education", isActive: true, order: 2, appVersions: [] },
        { id: "religious", label: "Religious", icon: "https://cdn.example.com/icons/religious.webp", route: "/listing/religious", isActive: true, order: 3, appVersions: [] },
        { id: "health", label: "Health", icon: "https://cdn.example.com/icons/health.webp", route: "/listing/health", isActive: true, order: 4, appVersions: [] },
        { id: "govt", label: "Govt Offices", icon: "https://cdn.example.com/icons/govt_office.webp", route: "/listing/govt", isActive: true, order: 5, appVersions: [] },
        { id: "banks", label: "Banks", icon: "https://cdn.example.com/icons/bank.webp", route: "/listing/banks", isActive: true, order: 6, appVersions: [] },
        { id: "travel", label: "Travel", icon: "https://cdn.example.com/icons/travel.webp", route: "/listing/travel", isActive: true, order: 7, appVersions: [] },
    ],
    moreCategories: [],
    utilities: [
        {
            id: "islamic",
            title: "Islamic Utilities",
            isActive: true,
            order: 1,
            appVersions: [],
            items: [
                { id: "quran", label: "Quran", icon: "https://cdn.example.com/icons/quran_icon.webp", route: "/quran", isActive: true, order: 1, appVersions: [] },
                { id: "prayers", label: "Prayers", icon: "https://cdn.example.com/icons/prayer_icon.webp", route: "/prayerTimes", isActive: true, order: 2, appVersions: [] },
                { id: "qibla", label: "Qibla", icon: "https://cdn.example.com/icons/qibla.webp", route: "/qibla", isActive: true, order: 3, appVersions: [] },
            ],
        },
        {
            id: "finance",
            title: "Finance & Rates",
            isActive: true,
            order: 2,
            appVersions: [],
            items: [
                { id: "currency", label: "Currency", icon: "https://cdn.example.com/icons/currency.webp", route: "/currency", isActive: true, order: 1, appVersions: [] },
                { id: "metals", label: "Metals & Gold", icon: "https://cdn.example.com/icons/gold_rate.webp", route: "/metals", isActive: true, order: 2, appVersions: [] },
                { id: "fuel", label: "Fuel Prices", icon: "https://cdn.example.com/icons/fuel.webp", route: "/fuel", isActive: true, order: 3, appVersions: [] },
            ],
        },
        {
            id: "sports",
            title: "Local Sports & Community",
            isActive: true,
            order: 3,
            appVersions: ["2.0.8", "2.0.9"],
            items: [
                { id: "cricket", label: "Cricket Hub", icon: "trophy-outline", route: "/cricket", isActive: true, order: 1, appVersions: ["2.0.8", "2.0.9"] },
            ],
        },
    ],
};

// Item Editor Modal Component
const ItemEditModal = React.memo(({ visible, onCancel, onSave, initialData, title }) => {
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
            okButtonProps={{ className: "!bg-[#006666] hover:!bg-teal-700" }}
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
                            <Button icon={<UploadOutlined />} loading={isUploading}>
                                Upload
                            </Button>
                        </Upload>
                    </div>
                    {formData.icon && (
                        <div className="mt-2 flex items-center gap-2 p-2 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-slate-200 dark:border-slate-700">
                            <span className="text-[11px] text-slate-500">Preview:</span>
                            {formData.icon.startsWith("http") ? (
                                <img src={formData.icon} alt="icon" className="w-8 h-8 object-contain" />
                            ) : (
                                <Tag color="cyan">{formData.icon}</Tag>
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

// Group Editor Modal Component
const GroupEditModal = React.memo(({ visible, onCancel, onSave, initialData }) => {
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
            okButtonProps={{ className: "!bg-[#006666] hover:!bg-teal-700" }}
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

// Category/Item Card Item Component
const ConfigItemCard = React.memo(({ item, onToggle, onEdit, onDelete }) => {
    const isRemoteImage = typeof item.icon === "string" && (item.icon.startsWith("http") || item.icon.startsWith("data:"));

    return (
        <div
            className={`flex items-center justify-between p-3.5 rounded-xl border transition-all duration-200 ${
                item.isActive !== false
                    ? "bg-white dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 shadow-sm"
                    : "bg-slate-50/70 dark:bg-slate-900/20 border-slate-200/50 dark:border-slate-800/40 opacity-70"
            }`}
        >
            <div className="flex items-center gap-3 min-w-0 flex-1">
                <div className="w-11 h-11 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 flex items-center justify-center shrink-0 overflow-hidden p-1">
                    {isRemoteImage ? (
                        <img src={item.icon} alt={item.label} className="w-full h-full object-contain" />
                    ) : item.icon ? (
                        <Tag color="cyan" className="m-0 text-[10px] font-mono px-1 py-0.5 max-w-[40px] truncate">
                            {item.icon}
                        </Tag>
                    ) : (
                        <FaImage className="text-slate-400" size={16} />
                    )}
                </div>

                <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate">
                            {item.label}
                        </span>
                        <span className="text-[10px] font-mono bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-slate-500">
                            #{item.order ?? 0}
                        </span>
                        {item.appVersions && item.appVersions.length > 0 ? (
                            <Tag color="purple" className="text-[10px] font-mono m-0">
                                {item.appVersions.join(", ")}
                            </Tag>
                        ) : (
                            <Tag color="default" className="text-[10px] text-slate-400 m-0">
                                All Versions
                            </Tag>
                        )}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                        <span className="text-[11px] font-mono text-teal-600 dark:text-teal-400 truncate">
                            id: {item.id}
                        </span>
                        {item.route && (
                            <span className="text-[11px] text-slate-400 font-mono truncate">
                                • {item.route}
                            </span>
                        )}
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-3 shrink-0 ml-3">
                <Tooltip title={item.isActive !== false ? "Visible on Mobile" : "Hidden from Mobile"}>
                    <Switch
                        checked={item.isActive !== false}
                        onChange={(checked) => onToggle(checked)}
                        size="small"
                        checkedChildren="ON"
                        unCheckedChildren="OFF"
                    />
                </Tooltip>

                <Button size="small" onClick={onEdit} className="rounded-md text-xs">
                    Edit
                </Button>

                <Popconfirm
                    title="Delete Item"
                    description={`Are you sure you want to remove "${item.label}"?`}
                    onConfirm={onDelete}
                    okText="Yes"
                    cancelText="No"
                    okButtonProps={{ danger: true }}
                >
                    <Button size="small" danger icon={<DeleteOutlined />} className="rounded-md" />
                </Popconfirm>
            </div>
        </div>
    );
});
ConfigItemCard.displayName = "ConfigItemCard";

function HomePageConfigManager() {
    const queryClient = useQueryClient();
    const [activeTab, setActiveTab] = useState("categories");
    const [configDoc, setConfigDoc] = useState(null);
    const [configData, setConfigData] = useState(DEFAULT_CONFIG_DATA);
    const [itemModal, setItemModal] = useState({ visible: false, type: "", groupIndex: null, itemIndex: null, data: null });
    const [groupModal, setGroupModal] = useState({ visible: false, groupIndex: null, data: null });

    // Fetch HOME_PAGE_CONFIG from backend
    const { data: remoteRes, isLoading, refetch, isRefetching } = useQuery({
        queryKey: [ADMIN_KEYS.CONFIGURATIONS.LIST, "HOME_PAGE_CONFIG"],
        queryFn: () => GET_CONFIGURATIONS({ type: "HOME_PAGE_CONFIG", search: "HOME_PAGE_CONFIG", limit: 50 }),
    });

    useEffect(() => {
        const list = remoteRes?.data || [];
        const doc = list.find((item) => item.type === "HOME_PAGE_CONFIG");
        if (doc) {
            setConfigDoc(doc);
            if (doc.data) {
                setConfigData({
                    categories: doc.data.categories || [],
                    moreCategories: doc.data.moreCategories || [],
                    utilities: doc.data.utilities || [],
                });
            }
        }
    }, [remoteRes]);

    // Save Mutation
    const saveMutation = useMutation({
        mutationFn: async () => {
            if (configDoc?._id) {
                return UPDATE_CONFIGURATION({
                    _id: configDoc._id,
                    type: "HOME_PAGE_CONFIG",
                    data: configData,
                    isActive: true,
                });
            } else {
                return CREATE_CONFIGURATION({
                    type: "HOME_PAGE_CONFIG",
                    data: configData,
                    isActive: true,
                });
            }
        },
        onSuccess: (res) => {
            toast.success(res?.message || "Home Page Configuration saved successfully!");
            queryClient.invalidateQueries({ queryKey: [ADMIN_KEYS.CONFIGURATIONS.LIST] });
            refetch();
        },
        onError: (err) => {
            toast.error(err?.errorMessage || err?.message || "Failed to save configuration");
        },
    });

    // Handlers for Categories
    const handleToggleCategory = (index, isActive) => {
        setConfigData((prev) => {
            const next = [...prev.categories];
            next[index] = { ...next[index], isActive };
            return { ...prev, categories: next };
        });
    };

    const handleDeleteCategory = (index) => {
        setConfigData((prev) => ({
            ...prev,
            categories: prev.categories.filter((_, idx) => idx !== index),
        }));
    };

    // Handlers for More Categories
    const handleToggleMoreCategory = (index, isActive) => {
        setConfigData((prev) => {
            const next = [...prev.moreCategories];
            next[index] = { ...next[index], isActive };
            return { ...prev, moreCategories: next };
        });
    };

    const handleDeleteMoreCategory = (index) => {
        setConfigData((prev) => ({
            ...prev,
            moreCategories: prev.moreCategories.filter((_, idx) => idx !== index),
        }));
    };

    // Handlers for Utility Groups & Items
    const handleToggleGroup = (groupIndex, isActive) => {
        setConfigData((prev) => {
            const next = [...prev.utilities];
            next[groupIndex] = { ...next[groupIndex], isActive };
            return { ...prev, utilities: next };
        });
    };

    const handleDeleteGroup = (groupIndex) => {
        setConfigData((prev) => ({
            ...prev,
            utilities: prev.utilities.filter((_, idx) => idx !== groupIndex),
        }));
    };

    const handleToggleUtilityItem = (groupIndex, itemIndex, isActive) => {
        setConfigData((prev) => {
            const nextUtilities = [...prev.utilities];
            const group = { ...nextUtilities[groupIndex] };
            const nextItems = [...group.items];
            nextItems[itemIndex] = { ...nextItems[itemIndex], isActive };
            group.items = nextItems;
            nextUtilities[groupIndex] = group;
            return { ...prev, utilities: nextUtilities };
        });
    };

    const handleDeleteUtilityItem = (groupIndex, itemIndex) => {
        setConfigData((prev) => {
            const nextUtilities = [...prev.utilities];
            const group = { ...nextUtilities[groupIndex] };
            group.items = group.items.filter((_, idx) => idx !== itemIndex);
            nextUtilities[groupIndex] = group;
            return { ...prev, utilities: nextUtilities };
        });
    };

    // Save modal handler
    const handleSaveItemModal = (savedItem) => {
        const { type, groupIndex, itemIndex } = itemModal;
        if (type === "category") {
            setConfigData((prev) => {
                const next = [...prev.categories];
                if (itemIndex !== null) next[itemIndex] = savedItem;
                else next.push(savedItem);
                return { ...prev, categories: next };
            });
        } else if (type === "moreCategory") {
            setConfigData((prev) => {
                const next = [...prev.moreCategories];
                if (itemIndex !== null) next[itemIndex] = savedItem;
                else next.push(savedItem);
                return { ...prev, moreCategories: next };
            });
        } else if (type === "utilityItem") {
            setConfigData((prev) => {
                const nextUtilities = [...prev.utilities];
                const group = { ...nextUtilities[groupIndex] };
                const nextItems = [...(group.items || [])];
                if (itemIndex !== null) nextItems[itemIndex] = savedItem;
                else nextItems.push(savedItem);
                group.items = nextItems;
                nextUtilities[groupIndex] = group;
                return { ...prev, utilities: nextUtilities };
            });
        }
    };

    const handleSaveGroupModal = (savedGroup) => {
        const { groupIndex } = groupModal;
        setConfigData((prev) => {
            const next = [...prev.utilities];
            if (groupIndex !== null) next[groupIndex] = { ...next[groupIndex], ...savedGroup };
            else next.push({ ...savedGroup, items: [] });
            return { ...prev, utilities: next };
        });
    };

    // Stats calculations
    const stats = useMemo(() => {
        const activeCategories = configData.categories.filter((c) => c.isActive !== false).length;
        const activeMore = configData.moreCategories.filter((c) => c.isActive !== false).length;
        const totalGroups = configData.utilities.length;
        const activeGroups = configData.utilities.filter((g) => g.isActive !== false).length;
        const totalUtilItems = configData.utilities.reduce((acc, g) => acc + (g.items?.length || 0), 0);
        const activeUtilItems = configData.utilities.reduce(
            (acc, g) => acc + (g.isActive !== false ? g.items?.filter((i) => i.isActive !== false).length || 0 : 0),
            0
        );
        return { activeCategories, activeMore, totalGroups, activeGroups, totalUtilItems, activeUtilItems };
    }, [configData]);

    return (
        <div className="space-y-6">
            {/* Header Toolbar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
                <div>
                    <h2 className="text-base font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2 m-0">
                        <MobileOutlined className="text-[#006666] dark:text-teal-400" />
                        Mobile Home Screen Layout Manager
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400 m-0 mt-0.5">
                        Manage categories, utilities, icon images, and target app versions for the mobile app home screen.
                    </p>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto">
                    <Button
                        icon={<ReloadOutlined />}
                        onClick={() => refetch()}
                        loading={isRefetching}
                        className="rounded-lg text-xs"
                    >
                        Reload
                    </Button>
                    <Button
                        type="primary"
                        icon={<SaveOutlined />}
                        onClick={() => saveMutation.mutate()}
                        loading={saveMutation.isPending}
                        className="!bg-[#006666] hover:!bg-teal-700 rounded-lg text-xs font-semibold"
                    >
                        Save All Changes
                    </Button>
                </div>
            </div>

            {/* Quick Stats Summary */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                    <div>
                        <span className="text-[11px] text-slate-500 font-medium">Explore Categories</span>
                        <p className="text-base font-bold text-slate-800 dark:text-slate-100 m-0">
                            {stats.activeCategories} / {configData.categories.length} <span className="text-xs text-teal-600 font-normal">Active</span>
                        </p>
                    </div>
                    <AppstoreOutlined className="text-teal-500 text-lg opacity-80" />
                </div>

                <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                    <div>
                        <span className="text-[11px] text-slate-500 font-medium">More Categories</span>
                        <p className="text-base font-bold text-slate-800 dark:text-slate-100 m-0">
                            {stats.activeMore} / {configData.moreCategories.length} <span className="text-xs text-teal-600 font-normal">Active</span>
                        </p>
                    </div>
                    <AppstoreAddOutlined className="text-teal-500 text-lg opacity-80" />
                </div>

                <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                    <div>
                        <span className="text-[11px] text-slate-500 font-medium">Utility Groups</span>
                        <p className="text-base font-bold text-slate-800 dark:text-slate-100 m-0">
                            {stats.activeGroups} / {stats.totalGroups} <span className="text-xs text-teal-600 font-normal">Active</span>
                        </p>
                    </div>
                    <FaLayerGroup className="text-teal-500 text-base opacity-80" />
                </div>

                <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                    <div>
                        <span className="text-[11px] text-slate-500 font-medium">Utility Items</span>
                        <p className="text-base font-bold text-slate-800 dark:text-slate-100 m-0">
                            {stats.activeUtilItems} / {stats.totalUtilItems} <span className="text-xs text-teal-600 font-normal">Active</span>
                        </p>
                    </div>
                    <ToolOutlined className="text-teal-500 text-lg opacity-80" />
                </div>
            </div>

            {/* Main Tabs */}
            <Tabs
                activeKey={activeTab}
                onChange={setActiveTab}
                type="card"
                className="custom-admin-tabs"
                items={[
                    {
                        key: "categories",
                        label: (
                            <span className="flex items-center gap-1.5">
                                <FaThLarge size={12} /> Explore Categories ({configData.categories.length})
                            </span>
                        ),
                        children: (
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                                        Primary Category Tiles (Home Grid)
                                    </span>
                                    <Button
                                        type="dashed"
                                        icon={<PlusOutlined />}
                                        onClick={() =>
                                            setItemModal({
                                                visible: true,
                                                type: "category",
                                                groupIndex: null,
                                                itemIndex: null,
                                                data: { isActive: true, order: configData.categories.length + 1, appVersions: [] },
                                            })
                                        }
                                        className="rounded-lg text-xs"
                                    >
                                        Add Category
                                    </Button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {configData.categories.map((cat, idx) => (
                                        <ConfigItemCard
                                            key={cat.id || idx}
                                            item={cat}
                                            onToggle={(checked) => handleToggleCategory(idx, checked)}
                                            onEdit={() =>
                                                setItemModal({
                                                    visible: true,
                                                    type: "category",
                                                    groupIndex: null,
                                                    itemIndex: idx,
                                                    data: cat,
                                                })
                                            }
                                            onDelete={() => handleDeleteCategory(idx)}
                                        />
                                    ))}
                                </div>
                            </div>
                        ),
                    },
                    {
                        key: "moreCategories",
                        label: (
                            <span className="flex items-center gap-1.5">
                                <AppstoreAddOutlined /> More Categories Modal ({configData.moreCategories.length})
                            </span>
                        ),
                        children: (
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                                        Overflow Categories (Rendered inside "More" Modal)
                                    </span>
                                    <Button
                                        type="dashed"
                                        icon={<PlusOutlined />}
                                        onClick={() =>
                                            setItemModal({
                                                visible: true,
                                                type: "moreCategory",
                                                groupIndex: null,
                                                itemIndex: null,
                                                data: { isActive: true, order: configData.moreCategories.length + 1, appVersions: [] },
                                            })
                                        }
                                        className="rounded-lg text-xs"
                                    >
                                        Add Overflow Category
                                    </Button>
                                </div>

                                {configData.moreCategories.length === 0 ? (
                                    <Empty description="No overflow categories added yet. Click 'Add Overflow Category' to create one." />
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {configData.moreCategories.map((cat, idx) => (
                                            <ConfigItemCard
                                                key={cat.id || idx}
                                                item={cat}
                                                onToggle={(checked) => handleToggleMoreCategory(idx, checked)}
                                                onEdit={() =>
                                                    setItemModal({
                                                        visible: true,
                                                        type: "moreCategory",
                                                        groupIndex: null,
                                                        itemIndex: idx,
                                                        data: cat,
                                                    })
                                                }
                                                onDelete={() => handleDeleteMoreCategory(idx)}
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>
                        ),
                    },
                    {
                        key: "utilities",
                        label: (
                            <span className="flex items-center gap-1.5">
                                <ToolOutlined /> Daily Utilities ({configData.utilities.length} Groups)
                            </span>
                        ),
                        children: (
                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                                        Grouped Daily Utility Sections
                                    </span>
                                    <Button
                                        type="dashed"
                                        icon={<PlusOutlined />}
                                        onClick={() =>
                                            setGroupModal({
                                                visible: true,
                                                groupIndex: null,
                                                data: { isActive: true, order: configData.utilities.length + 1, appVersions: [], items: [] },
                                            })
                                        }
                                        className="rounded-lg text-xs"
                                    >
                                        Add Utility Group
                                    </Button>
                                </div>

                                {configData.utilities.map((group, gIdx) => (
                                    <div
                                        key={group.id || gIdx}
                                        className="bg-slate-50/60 dark:bg-slate-900/40 rounded-xl border border-slate-200 dark:border-slate-800 p-4 space-y-3"
                                    >
                                        {/* Group Header */}
                                        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                                            <div className="flex items-center gap-2">
                                                <FaLayerGroup className="text-teal-600 dark:text-teal-400" size={14} />
                                                <span className="text-sm font-bold text-slate-800 dark:text-slate-100">
                                                    {group.title}
                                                </span>
                                                <span className="text-[10px] font-mono bg-slate-200 dark:bg-slate-800 px-1.5 py-0.5 rounded text-slate-600">
                                                    #{group.order ?? 0}
                                                </span>
                                                {group.appVersions && group.appVersions.length > 0 ? (
                                                    <Tag color="purple" className="text-[10px] m-0">
                                                        v{group.appVersions.join(", v")}
                                                    </Tag>
                                                ) : (
                                                    <Tag color="default" className="text-[10px] text-slate-400 m-0">
                                                        All Versions
                                                    </Tag>
                                                )}
                                            </div>

                                            <div className="flex items-center gap-3">
                                                <Switch
                                                    checked={group.isActive !== false}
                                                    onChange={(checked) => handleToggleGroup(gIdx, checked)}
                                                    size="small"
                                                    checkedChildren="Group ON"
                                                    unCheckedChildren="Group OFF"
                                                />
                                                <Button
                                                    size="small"
                                                    onClick={() => setGroupModal({ visible: true, groupIndex: gIdx, data: group })}
                                                    className="rounded-md text-xs"
                                                >
                                                    Edit Group
                                                </Button>
                                                <Button
                                                    size="small"
                                                    type="dashed"
                                                    icon={<PlusOutlined />}
                                                    onClick={() =>
                                                        setItemModal({
                                                            visible: true,
                                                            type: "utilityItem",
                                                            groupIndex: gIdx,
                                                            itemIndex: null,
                                                            data: { isActive: true, order: (group.items?.length || 0) + 1, appVersions: [] },
                                                        })
                                                    }
                                                    className="rounded-md text-xs"
                                                >
                                                    Add Item
                                                </Button>
                                                <Popconfirm
                                                    title="Delete Group"
                                                    description={`Delete group "${group.title}" and its items?`}
                                                    onConfirm={() => handleDeleteGroup(gIdx)}
                                                    okButtonProps={{ danger: true }}
                                                >
                                                    <Button size="small" danger icon={<DeleteOutlined />} className="rounded-md" />
                                                </Popconfirm>
                                            </div>
                                        </div>

                                        {/* Group Items Grid */}
                                        {group.items && group.items.length > 0 ? (
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                                                {group.items.map((item, iIdx) => (
                                                    <ConfigItemCard
                                                        key={item.id || iIdx}
                                                        item={item}
                                                        onToggle={(checked) => handleToggleUtilityItem(gIdx, iIdx, checked)}
                                                        onEdit={() =>
                                                            setItemModal({
                                                                visible: true,
                                                                type: "utilityItem",
                                                                groupIndex: gIdx,
                                                                itemIndex: iIdx,
                                                                data: item,
                                                            })
                                                        }
                                                        onDelete={() => handleDeleteUtilityItem(gIdx, iIdx)}
                                                    />
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="py-4 text-center text-xs text-slate-400">
                                                No items in this group. Click "Add Item" above.
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ),
                    },
                    {
                        key: "preview",
                        label: (
                            <span className="flex items-center gap-1.5">
                                <EyeOutlined /> Live Visual Preview
                            </span>
                        ),
                        children: (
                            <div className="p-4 bg-slate-50 dark:bg-slate-900/30 rounded-xl border border-slate-200 dark:border-slate-800">
                                <ConfigPreview dataString={JSON.stringify(configData, null, 2)} />
                            </div>
                        ),
                    },
                ]}
            />

            {/* Modals */}
            <ItemEditModal
                visible={itemModal.visible}
                onCancel={() => setItemModal({ visible: false, type: "", groupIndex: null, itemIndex: null, data: null })}
                onSave={handleSaveItemModal}
                initialData={itemModal.data}
                title={
                    itemModal.type === "category"
                        ? "Edit Category"
                        : itemModal.type === "moreCategory"
                        ? "Edit Overflow Category"
                        : "Edit Utility Item"
                }
            />

            <GroupEditModal
                visible={groupModal.visible}
                onCancel={() => setGroupModal({ visible: false, groupIndex: null, data: null })}
                onSave={handleSaveGroupModal}
                initialData={groupModal.data}
            />
        </div>
    );
}

HomePageConfigManager.displayName = "HomePageConfigManager";
export default React.memo(HomePageConfigManager);
