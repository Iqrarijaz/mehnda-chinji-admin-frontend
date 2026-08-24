"use client";
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Tabs } from "antd";
import { EyeOutlined, AppstoreAddOutlined, ToolOutlined } from "@ant-design/icons";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { FaThLarge } from "react-icons/fa";

import { GET_CONFIGURATIONS, UPDATE_CONFIGURATION, UPDATE_CONFIGURATION_ITEM, CREATE_CONFIGURATION } from "@/app/api/admin/configurations";
import { ADMIN_KEYS } from "@/constants/queryKeys";
import ConfigPreview from "@/components/admin/configurations/ConfigPreview";

import { DEFAULT_CONFIG_DATA } from "@/components/admin/configurations/home-config/constants";
import { HeaderToolbar } from "@/components/admin/configurations/home-config/HeaderToolbar";
import { StatsOverview } from "@/components/admin/configurations/home-config/StatsOverview";
import { CategoriesTab } from "@/components/admin/configurations/home-config/CategoriesTab";
import { MoreCategoriesTab } from "@/components/admin/configurations/home-config/MoreCategoriesTab";
import { UtilitiesTab } from "@/components/admin/configurations/home-config/UtilitiesTab";
import { ItemEditModal } from "@/components/admin/configurations/home-config/ItemEditModal";
import { GroupEditModal } from "@/components/admin/configurations/home-config/GroupEditModal";

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

    /**
     * Persist one entry immediately, addressed by id.
     *
     * A visibility toggle is a single-field edit, so it goes through the
     * targeted endpoint rather than re-saving the whole layout — that way one
     * admin flipping a switch cannot overwrite another's in-flight edits
     * elsewhere in the document. Local state updates first so the switch feels
     * instant, and reverts if the request fails.
     *
     * Before the document exists there is nothing to patch, so the change stays
     * local until the first Save creates it.
     */
    const persistItem = useCallback(async ({ section, itemId, groupId, patch, revert }) => {
        if (!configDoc?._id) return;

        try {
            await UPDATE_CONFIGURATION_ITEM({
                _id: configDoc._id,
                type: "HOME_PAGE_CONFIG",
                section,
                itemId,
                ...(groupId ? { groupId } : {}),
                patch,
            });
            queryClient.invalidateQueries({ queryKey: [ADMIN_KEYS.CONFIGURATIONS.LIST] });
        } catch (err) {
            revert?.();
            toast.error(err?.errorMessage || err?.message || "Failed to update item");
        }
    }, [configDoc, queryClient]);

    // Handlers for Categories
    const handleToggleCategory = useCallback((index, isActive) => {
        let target = null;
        setConfigData((prev) => {
            const next = [...prev.categories];
            target = next[index];
            next[index] = { ...next[index], isActive };
            return { ...prev, categories: next };
        });
        if (target?.id) {
            persistItem({
                section: "categories",
                itemId: target.id,
                patch: { isActive },
                revert: () => setConfigData((prev) => {
                    const next = [...prev.categories];
                    next[index] = { ...next[index], isActive: !isActive };
                    return { ...prev, categories: next };
                }),
            });
        }
    }, [persistItem]);

    const handleDeleteCategory = useCallback((index) => {
        setConfigData((prev) => ({
            ...prev,
            categories: prev.categories.filter((_, idx) => idx !== index),
        }));
    }, []);

    // Handlers for More Categories
    const handleToggleMoreCategory = useCallback((index, isActive) => {
        let target = null;
        setConfigData((prev) => {
            const next = [...prev.moreCategories];
            target = next[index];
            next[index] = { ...next[index], isActive };
            return { ...prev, moreCategories: next };
        });
        if (target?.id) {
            persistItem({
                section: "moreCategories",
                itemId: target.id,
                patch: { isActive },
                revert: () => setConfigData((prev) => {
                    const next = [...prev.moreCategories];
                    next[index] = { ...next[index], isActive: !isActive };
                    return { ...prev, moreCategories: next };
                }),
            });
        }
    }, [persistItem]);

    const handleDeleteMoreCategory = useCallback((index) => {
        setConfigData((prev) => ({
            ...prev,
            moreCategories: prev.moreCategories.filter((_, idx) => idx !== index),
        }));
    }, []);

    // Handlers for Utility Groups & Items
    const handleToggleGroup = useCallback((groupIndex, isActive) => {
        let target = null;
        setConfigData((prev) => {
            const next = [...prev.utilities];
            target = next[groupIndex];
            next[groupIndex] = { ...next[groupIndex], isActive };
            return { ...prev, utilities: next };
        });
        if (target?.id) {
            // No groupId: for utilities that addresses the group itself.
            persistItem({
                section: "utilities",
                itemId: target.id,
                patch: { isActive },
                revert: () => setConfigData((prev) => {
                    const next = [...prev.utilities];
                    next[groupIndex] = { ...next[groupIndex], isActive: !isActive };
                    return { ...prev, utilities: next };
                }),
            });
        }
    }, [persistItem]);

    const handleDeleteGroup = useCallback((groupIndex) => {
        setConfigData((prev) => ({
            ...prev,
            utilities: prev.utilities.filter((_, idx) => idx !== groupIndex),
        }));
    }, []);

    const handleToggleUtilityItem = useCallback((groupIndex, itemIndex, isActive) => {
        let groupId = null;
        let itemId = null;
        setConfigData((prev) => {
            const nextUtilities = [...prev.utilities];
            const group = { ...nextUtilities[groupIndex] };
            const nextItems = [...group.items];
            groupId = group.id;
            itemId = nextItems[itemIndex]?.id;
            nextItems[itemIndex] = { ...nextItems[itemIndex], isActive };
            group.items = nextItems;
            nextUtilities[groupIndex] = group;
            return { ...prev, utilities: nextUtilities };
        });
        if (groupId && itemId) {
            persistItem({
                section: "utilities",
                groupId,
                itemId,
                patch: { isActive },
                revert: () => setConfigData((prev) => {
                    const nextUtilities = [...prev.utilities];
                    const group = { ...nextUtilities[groupIndex] };
                    const nextItems = [...group.items];
                    nextItems[itemIndex] = { ...nextItems[itemIndex], isActive: !isActive };
                    group.items = nextItems;
                    nextUtilities[groupIndex] = group;
                    return { ...prev, utilities: nextUtilities };
                }),
            });
        }
    }, [persistItem]);

    const handleDeleteUtilityItem = useCallback((groupIndex, itemIndex) => {
        setConfigData((prev) => {
            const nextUtilities = [...prev.utilities];
            const group = { ...nextUtilities[groupIndex] };
            group.items = group.items.filter((_, idx) => idx !== itemIndex);
            nextUtilities[groupIndex] = group;
            return { ...prev, utilities: nextUtilities };
        });
    }, []);

    // Save modal handlers
    const handleSaveItemModal = useCallback((savedItem) => {
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
    }, [itemModal]);

    const handleSaveGroupModal = useCallback((savedGroup) => {
        const { groupIndex } = groupModal;
        setConfigData((prev) => {
            const next = [...prev.utilities];
            if (groupIndex !== null) next[groupIndex] = { ...next[groupIndex], ...savedGroup };
            else next.push({ ...savedGroup, items: [] });
            return { ...prev, utilities: next };
        });
    }, [groupModal]);

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
            <HeaderToolbar
                onReload={() => refetch()}
                isRefetching={isRefetching}
                onSave={() => saveMutation.mutate()}
                isSaving={saveMutation.isPending}
            />

            {/* Quick Stats Summary */}
            <StatsOverview stats={stats} configData={configData} />

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
                            <CategoriesTab
                                categories={configData.categories}
                                onAdd={() =>
                                    setItemModal({
                                        visible: true,
                                        type: "category",
                                        groupIndex: null,
                                        itemIndex: null,
                                        data: { isActive: true, order: configData.categories.length + 1, appVersions: [] },
                                    })
                                }
                                onToggle={handleToggleCategory}
                                onEdit={(idx, cat) =>
                                    setItemModal({
                                        visible: true,
                                        type: "category",
                                        groupIndex: null,
                                        itemIndex: idx,
                                        data: cat,
                                    })
                                }
                                onDelete={handleDeleteCategory}
                            />
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
                            <MoreCategoriesTab
                                moreCategories={configData.moreCategories}
                                onAdd={() =>
                                    setItemModal({
                                        visible: true,
                                        type: "moreCategory",
                                        groupIndex: null,
                                        itemIndex: null,
                                        data: { isActive: true, order: configData.moreCategories.length + 1, appVersions: [] },
                                    })
                                }
                                onToggle={handleToggleMoreCategory}
                                onEdit={(idx, cat) =>
                                    setItemModal({
                                        visible: true,
                                        type: "moreCategory",
                                        groupIndex: null,
                                        itemIndex: idx,
                                        data: cat,
                                    })
                                }
                                onDelete={handleDeleteMoreCategory}
                            />
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
                            <UtilitiesTab
                                utilities={configData.utilities}
                                onAddGroup={() =>
                                    setGroupModal({
                                        visible: true,
                                        groupIndex: null,
                                        data: { isActive: true, order: configData.utilities.length + 1, appVersions: [], items: [] },
                                    })
                                }
                                onToggleGroup={handleToggleGroup}
                                onEditGroup={(gIdx, group) =>
                                    setGroupModal({ visible: true, groupIndex: gIdx, data: group })
                                }
                                onDeleteGroup={handleDeleteGroup}
                                onAddItem={(gIdx, group) =>
                                    setItemModal({
                                        visible: true,
                                        type: "utilityItem",
                                        groupIndex: gIdx,
                                        itemIndex: null,
                                        data: { isActive: true, order: (group.items?.length || 0) + 1, appVersions: [] },
                                    })
                                }
                                onToggleItem={handleToggleUtilityItem}
                                onEditItem={(gIdx, iIdx, item) =>
                                    setItemModal({
                                        visible: true,
                                        type: "utilityItem",
                                        groupIndex: gIdx,
                                        itemIndex: iIdx,
                                        data: item,
                                    })
                                }
                                onDeleteItem={handleDeleteUtilityItem}
                            />
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
                            <div className="p-4 bg-slate-50 dark:bg-slate-900/30 rounded-xl border-0">
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
