"use client";
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import AddButton from "@/components/InnerPage/AddButton";
import SearchInput from "@/components/InnerPage/SearchInput";
import { Select } from "antd";
import ProductTable from "./components/Table";
import AddProductModal from "./components/AddModal";
import UpdateProductModal from "./components/UpdateModal";
import ViewProductModal from "./components/ViewModal";
import { GET_PRODUCTS, GET_CATEGORIES } from "@/app/api/admin/store";
import { useAdminData } from "@/hooks/useAdminData";
import { useDebounce } from "@/hooks/useDebounce";
import InnerPageCard from "@/components/layout/InnerPageCard";
import { HiRefresh } from "react-icons/hi";
import { ADMIN_KEYS } from "@/constants/queryKeys";
import { useStoreContext } from "@/hooks/useStoreContext";
import StoreSelector from "@/components/InnerPage/StoreSelector";
import BusinessTabs from "../components/BusinessTabs";
import { hasPermission } from "@/utils/permissions";
import { PERMISSIONS } from "@/config/permissions";
import { useRouter } from "next/navigation";

const { Option } = Select;

const StoreProductsPage = React.memo(() => {
    const router = useRouter();

    React.useEffect(() => {
        if (!hasPermission(PERMISSIONS.STORE.PRODUCTS.READ)) {
            router.replace("/admin/business");
        }
    }, [router]);

    const storeContext = useStoreContext();
    const { selectedStoreId } = storeContext;

    const [modal, setModal] = useState({ name: null, data: null, state: false });
    const [filters, setFilters] = useState({
        itemsPerPage: 10,
        currentPage: 1,
        search: "",
        categoryId: null,
        status: null,
    });

    const debFilters = useDebounce(filters, 500);

    // Fetch products
    const {
        listQuery: productsList,
        isRefreshing,
        handleRefresh
    } = useAdminData({
        listQueryKey: [ADMIN_KEYS.STORE.PRODUCTS.LIST, selectedStoreId, JSON.stringify(debFilters)],
        listQueryFn: () => {
            if (!selectedStoreId) return Promise.resolve({ data: { data: [], pagination: {} } });
            return GET_PRODUCTS({
                businessId: selectedStoreId,
                categoryId: debFilters.categoryId || undefined,
                status: debFilters.status || undefined,
                search: debFilters.search || undefined,
                page: debFilters.currentPage,
                limit: debFilters.itemsPerPage,
            });
        },
        onListError: "Failed to fetch store products.",
    });

    // Fetch categories for product dropdown filter
    const { data: categoriesData } = useQuery({
        queryKey: [ADMIN_KEYS.STORE.CATEGORIES.LIST, selectedStoreId],
        queryFn: () => GET_CATEGORIES(selectedStoreId),
        enabled: !!selectedStoreId,
    });
    const categories = categoriesData?.data || [];

    const onChange = (data) => setFilters((prev) => ({ ...prev, ...data, currentPage: 1 }));

    return (
        <InnerPageCard>
            <BusinessTabs handleRefresh={handleRefresh} isRefreshing={isRefreshing} />
            {!selectedStoreId ? (
                <div className="flex flex-col items-center justify-center p-8 bg-slate-50 dark:bg-slate-900 border border-dashed border-slate-200 dark:border-slate-800 rounded-lg">
                    <p className="text-sm font-semibold text-slate-500">Please select an active store from the dropdown above to view products.</p>
                </div>
            ) : (
                <>
                    <div className="flex flex-col md:flex-row justify-end mb-4 gap-3 items-start md:items-center">
                        {/* Action Bar (Right) */}
                        <div className="flex flex-wrap md:flex-nowrap gap-2 items-center w-full md:w-auto justify-end">
                            <div className="hidden md:flex items-center gap-2">
                                <SearchInput
                                    value={filters.search}
                                    onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value, currentPage: 1 }))}
                                    placeholder="Search products..."
                                    className="!max-w-[200px] !h-[32px] !border-2 !rounded-[2px]"
                                />

                                <Select
                                    placeholder="Filter by Category"
                                    className="w-full md:w-44 custom-selectbox h-[32px]"
                                    allowClear
                                    value={filters.categoryId}
                                    onChange={(val) => onChange({ categoryId: val })}
                                >
                                    {categories.map((cat) => (
                                        <Option key={cat._id} value={cat._id}>
                                            <span className="capitalize text-xs font-medium">{cat.name}</span>
                                        </Option>
                                    ))}
                                </Select>

                                <Select
                                    placeholder="Filter by Status"
                                    className="w-full md:w-44 custom-selectbox h-[32px]"
                                    allowClear
                                    value={filters.status}
                                    onChange={(val) => onChange({ status: val })}
                                >
                                    <Option value="ACTIVE"><span className="text-xs font-bold text-green-600">ACTIVE</span></Option>
                                    <Option value="OUT_OF_STOCK"><span className="text-xs font-bold text-red-600">OUT OF STOCK</span></Option>
                                    <Option value="DRAFT"><span className="text-xs font-bold text-slate-500">DRAFT</span></Option>
                                    <Option value="ARCHIVED"><span className="text-xs font-bold text-amber-600">ARCHIVED</span></Option>
                                </Select>
                            </div>

                            <div className="flex items-center gap-2">
                                {hasPermission(PERMISSIONS.STORE.PRODUCTS.CREATE) && (
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

                    <ProductTable
                        modal={modal}
                        setModal={setModal}
                        productsList={productsList}
                        onChange={(data) => setFilters((prev) => ({ ...prev, ...data }))}
                        businessId={selectedStoreId}
                    />

                    {modal.name === "Add" && modal.state && (
                        <AddProductModal
                            modal={modal}
                            setModal={setModal}
                            businessId={selectedStoreId}
                            categories={categories}
                        />
                    )}

                    {modal.name === "Update" && modal.state && (
                        <UpdateProductModal
                            modal={modal}
                            setModal={setModal}
                            businessId={selectedStoreId}
                            categories={categories}
                        />
                    )}

                    {modal.name === "View" && modal.state && (
                        <ViewProductModal
                            open={modal.state}
                            data={modal.data}
                            onCancel={() => setModal({ name: null, state: false, data: null })}
                        />
                    )}
                </>
            )}
        </InnerPageCard>
    );
});

StoreProductsPage.displayName = "StoreProductsPage";

export default StoreProductsPage;
