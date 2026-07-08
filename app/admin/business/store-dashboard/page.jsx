"use client";
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import InnerPageCard from "@/components/layout/InnerPageCard";
import DashboardCard from "@/components/shared/DashboardCard";
import { DashboardCardSkeleton } from "@/components/shared/Skeletons";
import { HiRefresh } from "react-icons/hi";
import { FaBoxOpen, FaTag, FaClipboardList, FaHandHoldingUsd, FaArrowRight } from "react-icons/fa";
import { Table, Tag, Button } from "antd";
import { timestampToDate } from "@/utils/date";
import { GET_STORE_DASHBOARD_STATS } from "@/app/api/admin/store";
import { ADMIN_KEYS } from "@/constants/queryKeys";
import { useStoreContext } from "@/hooks/useStoreContext";
import StoreSelector from "@/components/InnerPage/StoreSelector";
import ViewOrderModal from "../store-orders/components/ViewModal";
import BusinessTabs from "../components/BusinessTabs";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { hasPermission } from "@/utils/permissions";
import { PERMISSIONS } from "@/config/permissions";

const StoreDashboardPage = React.memo(() => {
    const router = useRouter();

    React.useEffect(() => {
        if (!hasPermission(PERMISSIONS.STORE.ANALYTICS.READ)) {
            router.replace("/admin/business");
        }
    }, [router]);

    const storeContext = useStoreContext();
    const { selectedStoreId } = storeContext;

    const [isRefreshing, setIsRefreshing] = useState(false);
    const [viewOrderModal, setViewOrderModal] = useState({ state: false, data: null });

    // Fetch dashboard statistics
    const {
        data: statsData,
        isLoading: loadingStats,
        refetch,
        isError,
        error
    } = useQuery({
        queryKey: [ADMIN_KEYS.STORE.DASHBOARD.STATS, selectedStoreId],
        queryFn: () => {
            if (!selectedStoreId) return Promise.resolve({ data: null });
            return GET_STORE_DASHBOARD_STATS(selectedStoreId);
        },
        enabled: !!selectedStoreId,
    });

    React.useEffect(() => {
        if (isError) {
            const msg = error?.response?.data?.message || "Failed to fetch store dashboard statistics.";
            toast.error(msg);
        }
    }, [isError, error]);

    const handleRefresh = async () => {
        setIsRefreshing(true);
        try {
            await refetch();
            toast.success("Dashboard stats synchronized!");
        } catch (error) {
            toast.error("Failed to sync dashboard stats.");
        } finally {
            setIsRefreshing(false);
        }
    };

    const stats = statsData?.data || {};
    const recentOrders = stats.recentOrders || [];

    const totalOrdersCount = stats.orders?.totalOrders || 0;
    const deliveredRevenue = stats.orders?.totalRevenue || 0;
    const productsCount = stats.productsCount || 0;
    const categoriesCount = stats.categoriesCount || 0;

    const statCards = React.useMemo(() => [
        {
            title: "Total Products",
            value: productsCount,
            icon: <FaBoxOpen size={20} />,
            color: "teal"
        },
        {
            title: "Categories",
            value: categoriesCount,
            icon: <FaTag size={18} />,
            color: "indigo"
        },
        {
            title: "Total Orders",
            value: totalOrdersCount,
            icon: <FaClipboardList size={18} />,
            color: "amber"
        },
        {
            title: "Store Revenue",
            value: `Rs. ${deliveredRevenue}`,
            icon: <FaHandHoldingUsd size={22} />,
            color: "emerald"
        }
    ], [productsCount, categoriesCount, totalOrdersCount, deliveredRevenue]);

    const colors = {
        PENDING: "orange",
        CONFIRMED: "blue",
        PREPARING: "cyan",
        OUT_FOR_DELIVERY: "purple",
        DELIVERED: "green",
        CANCELLED: "red",
        REJECTED: "error",
    };

    const columns = [
        {
            title: "Order #",
            dataIndex: "orderNumber",
            key: "orderNumber",
            width: 130,
            render: (num) => <span className="font-mono font-bold text-slate-700">{num}</span>
        },
        {
            title: "Customer Name",
            key: "customerName",
            render: (record) => (
                <span className="font-bold text-slate-800 dark:text-slate-200 text-xs capitalize">
                    {record.customerId?.name || "Anonymous Customer"}
                </span>
            )
        },
        {
            title: "Customer Phone",
            key: "customerPhone",
            render: (record) => (
                <span className="text-xs text-slate-500 dark:text-slate-400 font-mono font-semibold">
                    {record.deliveryAddress?.phone || record.customerId?.phone || "No Phone"}
                </span>
            )
        },
        {
            title: "Order Date",
            dataIndex: "createdAt",
            key: "createdAt",
            width: 150,
            render: (date) => <span className="text-slate-400 font-bold text-[10px]">{timestampToDate(date)}</span>
        },
        {
            title: "Payable Amount",
            dataIndex: "total",
            key: "total",
            width: 200,
            render: (val) => <span className="text-xs font-bold text-slate-800">Rs. {val}</span>
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            width: 140,
            render: (status) => (
                <Tag color={colors[status] || "default"} className="m-0 font-bold px-2 py-0.5 rounded text-[8px] uppercase border-none">
                    {status.replace(/_/g, " ")}
                </Tag>
            )
        },
        {
            title: "",
            key: "actions",
            width: 80,
            align: "right",
            fixed: "right",
            render: (record) => (
                <Button
                    type="link"
                    size="small"
                    className="!text-[#006666] font-bold text-xs"
                    onClick={() => setViewOrderModal({ state: true, data: record })}
                >
                    View
                </Button>
            )
        }
    ];

    return (
        <InnerPageCard>
            <BusinessTabs handleRefresh={handleRefresh} isRefreshing={isRefreshing || loadingStats} />
            {!selectedStoreId ? (
                <div className="flex flex-col items-center justify-center p-8 bg-slate-50 dark:bg-slate-900 border border-dashed border-slate-200 dark:border-slate-800 rounded-lg">
                    <p className="text-sm font-semibold text-slate-500">Please select an active store from the dropdown above to view dashboard metrics.</p>
                </div>
            ) : (
                <div className="space-y-6">

                    {/* Dashboard Counts Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {loadingStats ? (
                            Array.from({ length: 4 }).map((_, i) => <DashboardCardSkeleton key={i} />)
                        ) : (
                            statCards.map((card, index) => (
                                <DashboardCard
                                    key={index}
                                    title={card.title}
                                    value={card.value}
                                    icon={card.icon}
                                    color={card.color}
                                />
                            ))
                        )}
                    </div>

                    {/* Recent Orders Section */}
                    <div className="bg-white dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
                        <Table
                            rowKey="_id"
                            columns={columns}
                            dataSource={recentOrders}
                            loading={loadingStats}
                            pagination={false}
                            className="custom-ant-table"
                        />
                    </div>

                    {viewOrderModal.state && (
                        <ViewOrderModal
                            open={viewOrderModal.state}
                            data={viewOrderModal.data}
                            onCancel={() => setViewOrderModal({ state: false, data: null })}
                            businessId={selectedStoreId}
                        />
                    )}
                </div>
            )}
        </InnerPageCard>
    );
});

StoreDashboardPage.displayName = "StoreDashboardPage";

export default StoreDashboardPage;
