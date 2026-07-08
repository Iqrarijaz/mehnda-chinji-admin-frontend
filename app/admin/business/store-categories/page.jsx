"use client";
import React, { useState } from "react";
import AddButton from "@/components/InnerPage/AddButton";
import SearchInput from "@/components/InnerPage/SearchInput";
import CategoryTable from "./components/Table";
import AddCategoryModal from "./components/AddModal";
import UpdateCategoryModal from "./components/UpdateModal";
import { GET_CATEGORIES } from "@/app/api/admin/store";
import { useAdminData } from "@/hooks/useAdminData";
import InnerPageCard from "@/components/layout/InnerPageCard";
import { HiRefresh } from "react-icons/hi";
import { ADMIN_KEYS } from "@/constants/queryKeys";
import { useStoreContext } from "@/hooks/useStoreContext";
import StoreSelector from "@/components/InnerPage/StoreSelector";
import BusinessTabs from "../components/BusinessTabs";
import { hasPermission } from "@/utils/permissions";
import { PERMISSIONS } from "@/config/permissions";
import { useRouter } from "next/navigation";

const StoreCategoriesPage = React.memo(() => {
    const router = useRouter();

    React.useEffect(() => {
        if (!hasPermission(PERMISSIONS.STORE.CATEGORIES.READ)) {
            router.replace("/admin/business");
        }
    }, [router]);

    const storeContext = useStoreContext();
    const { selectedStoreId } = storeContext;

    const [modal, setModal] = useState({ name: null, data: null, state: false });
    const [search, setSearch] = useState("");

    const {
        listQuery: categoriesList,
        isRefreshing,
        handleRefresh
    } = useAdminData({
        listQueryKey: [ADMIN_KEYS.STORE.CATEGORIES.LIST, selectedStoreId],
        listQueryFn: () => {
            if (!selectedStoreId) return Promise.resolve({ data: [] });
            return GET_CATEGORIES(selectedStoreId);
        },
        onListError: "Failed to fetch store categories.",
    });

    const categories = categoriesList?.data?.data || [];

    // Client-side filtering
    const filteredCategories = categories.filter((cat) => {
        if (!search) return true;
        const lowercaseSearch = search.toLowerCase();
        return cat.name?.toLowerCase().includes(lowercaseSearch);
    });

    return (
        <InnerPageCard>
            <BusinessTabs handleRefresh={handleRefresh} isRefreshing={isRefreshing} />
            {!selectedStoreId ? (
                <div className="flex flex-col items-center justify-center p-8 bg-slate-50 dark:bg-slate-900 border border-dashed border-slate-200 dark:border-slate-800 rounded-lg">
                    <p className="text-sm font-semibold text-slate-500">Please select an active store from the dropdown above to view categories.</p>
                </div>
            ) : (
                <>
                    <div className="flex flex-col md:flex-row justify-end mb-4 gap-3 items-start md:items-center">
                        {/* Action Bar (Right) */}
                        <div className="flex flex-wrap md:flex-nowrap gap-2 items-center w-full md:w-auto justify-end">
                            <div className="hidden md:flex items-center gap-2">
                                <SearchInput
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Search category name..."
                                    className="!max-w-[250px] !h-[32px] mt-1 !border-2 !rounded-[2px]"
                                />
                            </div>

                            <div className="flex items-center gap-2">
                                {hasPermission(PERMISSIONS.STORE.CATEGORIES.CREATE) && (
                                    <AddButton
                                        title="Add"
                                        icon={false}
                                        onClick={() => setModal({ name: "Add", data: null, state: true })}
                                        className="!h-[32px] !rounded !px-4 !text-[10px] font-medium shadow-sm transform hover:scale-[1.02] active:scale-[0.98]"
                                    />
                                )}
                            </div>
                        </div>
                    </div>

                    <CategoryTable
                        modal={modal}
                        setModal={setModal}
                        categoriesList={{
                            ...categoriesList,
                            data: { data: filteredCategories }
                        }}
                        businessId={selectedStoreId}
                    />

                    {modal.name === "Add" && modal.state && (
                        <AddCategoryModal
                            modal={modal}
                            setModal={setModal}
                            businessId={selectedStoreId}
                        />
                    )}

                    {modal.name === "Update" && modal.state && (
                        <UpdateCategoryModal
                            modal={modal}
                            setModal={setModal}
                            businessId={selectedStoreId}
                        />
                    )}
                </>
            )}
        </InnerPageCard>
    );
});

StoreCategoriesPage.displayName = "StoreCategoriesPage";

export default StoreCategoriesPage;
