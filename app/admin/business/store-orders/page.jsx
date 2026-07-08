"use client";
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import SearchInput from "@/components/InnerPage/SearchInput";
import { Select } from "antd";
import OrderTable from "./components/Table";
import ViewOrderModal from "./components/ViewModal";
import { GET_ORDERS, GET_STORE_DASHBOARD_STATS } from "@/app/api/admin/store";
import { useAdminData } from "@/hooks/useAdminData";
import { useDebounce } from "@/hooks/useDebounce";
import InnerPageCard from "@/components/layout/InnerPageCard";
import StatCard from "@/components/shared/StatCard";
import { StatCardSkeleton } from "@/components/shared/Skeletons";
import { HiRefresh } from "react-icons/hi";
import { ADMIN_KEYS } from "@/constants/queryKeys";
import { useStoreContext } from "@/hooks/useStoreContext";
import StoreSelector from "@/components/InnerPage/StoreSelector";
import BusinessTabs from "../components/BusinessTabs";
import { useRouter } from "next/navigation";
import { hasPermission } from "@/utils/permissions";
import { PERMISSIONS } from "@/config/permissions";

const { Option } = Select;

const StoreOrdersPage = React.memo(() => {
    const router = useRouter();

    React.useEffect(() => {
        if (!hasPermission(PERMISSIONS.STORE.ORDERS.READ)) {
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
        status: null,
    });

    const debFilters = useDebounce(filters, 500);

    // Fetch main orders list
    const {
        listQuery: ordersList,
        countsQuery: dashboardQuery,
        isRefreshing,
        handleRefresh
    } = useAdminData({
        listQueryKey: [ADMIN_KEYS.STORE.ORDERS.LIST, selectedStoreId, JSON.stringify(debFilters)],
        listQueryFn: () => {
            if (!selectedStoreId) return Promise.resolve({ data: { data: [], pagination: {} } });
            return GET_ORDERS({
                businessId: selectedStoreId,
                status: debFilters.status || undefined,
                search: debFilters.search || undefined,
                page: debFilters.currentPage,
                limit: debFilters.itemsPerPage,
            });
        },
        countsQueryKey: [ADMIN_KEYS.STORE.DASHBOARD.STATS, selectedStoreId],
        countsQueryFn: () => {
            if (!selectedStoreId) return Promise.resolve({ data: { orders: {} } });
            return GET_STORE_DASHBOARD_STATS(selectedStoreId);
        },
        onListError: "Failed to fetch store orders.",
    });

    const { data: dashboardData, isLoading: countsLoading } = dashboardQuery;
    const orderStats = dashboardData?.data?.orders || {};

    const statCards = [
        { label: "Pending", short: "Pen", key: "PENDING", count: orderStats.PENDING || 0, color: "#ea580c", bg: "#fff7ed", border: "#fed7aa" },
        { label: "Confirmed", short: "Conf", key: "CONFIRMED", count: orderStats.CONFIRMED || 0, color: "#2563eb", bg: "#eff6ff", border: "#bfdbfe" },
        { label: "Preparing", short: "Prep", key: "PREPARING", count: orderStats.PREPARING || 0, color: "#0d9488", bg: "#f0fdfa", border: "#ccfbf1" },
        { label: "Out for Delivery", short: "Deliv", key: "OUT_FOR_DELIVERY", count: orderStats.OUT_FOR_DELIVERY || 0, color: "#8b5cf6", bg: "#f5f3ff", border: "#ddd6fe" },
        { label: "Delivered", short: "Done", key: "DELIVERED", count: orderStats.DELIVERED || 0, color: "#16a34a", bg: "#f0fdf4", border: "#bbf7d0" },
        { label: "Cancelled", short: "Canc", key: "CANCELLED", count: orderStats.CANCELLED || 0, color: "#dc2626", bg: "#fef2f2", border: "#fecaca" },
    ];

    const onChange = (data) => setFilters((prev) => ({ ...prev, ...data }));

    return (
        <InnerPageCard>
            <BusinessTabs handleRefresh={handleRefresh} isRefreshing={isRefreshing} />
            {!selectedStoreId ? (
                <div className="flex flex-col items-center justify-center p-8 bg-slate-50 dark:bg-slate-900 border border-dashed border-slate-200 dark:border-slate-800 rounded-lg">
                    <p className="text-sm font-semibold text-slate-500">Please select an active store from the dropdown above to view orders.</p>
                </div>
            ) : (
                <>
                    {/* Stat Cards & Search */}
                    <div className="flex justify-between items-start md:items-center flex-col md:flex-row mb-4 gap-4">
                        <div className="flex gap-2 items-center flex-wrap">
                            {countsLoading ? (
                                Array.from({ length: 6 }).map((_, i) => <StatCardSkeleton key={i} />)
                            ) : (
                                statCards.map((card) => (
                                    <StatCard
                                        key={card.key}
                                        title={card.label}
                                        shortTitle={card.short}
                                        count={card.count}
                                        color={card.color}
                                        bg={card.bg}
                                        border={card.border}
                                        active={filters.status === card.key}
                                        onClick={() =>
                                            setFilters((prev) => ({
                                                ...prev,
                                                status: prev.status === card.key ? null : card.key,
                                                currentPage: 1,
                                            }))
                                        }
                                    />
                                ))
                            )}
                        </div>

                        {/* Search */}
                        <div className="flex gap-2 items-center w-full md:w-auto justify-end">
                            <SearchInput
                                value={filters.search}
                                onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value, currentPage: 1 }))}
                                placeholder="Search by Order # or Phone..."
                                className="w-full md:w-64"
                            />
                        </div>
                    </div>

                    <OrderTable
                        modal={modal}
                        setModal={setModal}
                        ordersList={ordersList}
                        onChange={(data) => setFilters((prev) => ({ ...prev, ...data }))}
                        businessId={selectedStoreId}
                    />

                    {modal.name === "View" && modal.state && (
                        <ViewOrderModal
                            open={modal.state}
                            data={modal.data}
                            onCancel={() => setModal({ name: null, state: false, data: null })}
                            businessId={selectedStoreId}
                        />
                    )}
                </>
            )}
        </InnerPageCard>
    );
});

StoreOrdersPage.displayName = "StoreOrdersPage";

export default StoreOrdersPage;
