"use client";
import React, { useState } from "react";
import { toast } from "react-toastify";
import moment from "moment";
import dayjs from "dayjs";
import { DatePicker } from "antd";
import { SkeletonPulse, StatCardSkeleton } from "@/components/shared/Skeletons";
import StatCard from "@/components/shared/StatCard";
import AddButton from "@/components/InnerPage/AddButton";
import BillsTable from "./components/Table";
import AddBillModal from "./components/AddModal";
import BulkAddModal from "./components/BulkAddModal";
import UpdateBillModal from "./components/UpdateModal";
import PayBillModal from "./components/PayModal";
import { LIST_BILLS } from "@/app/api/admin/water-supply";
import { useDebounce } from "@/hooks/useDebounce";
import InnerPageCard from "@/components/layout/InnerPageCard";
import ColumnVisibilityDropdown from "@/components/InnerPage/ColumnVisibilityDropdown";
import FilterModal from "./components/FilterModal";
import { FiFilter } from "react-icons/fi";
import { HiRefresh, HiDownload } from "react-icons/hi";
import { ADMIN_KEYS } from "@/constants/queryKeys";
import { useAdminData } from "@/hooks/useAdminData";
import { downloadCSV } from "@/utils/export";
import { hasPermission } from "@/utils/permissions";
import { PERMISSIONS } from "@/config/permissions";

const columnOptions = [
    { label: "Connection", value: "connectionId" },
    { label: "Billing Month", value: "billingMonth" },
    { label: "Amount", value: "amount" },
    { label: "Status", value: "status" },
    { label: "Payment Mode", value: "paymentMode" },
    { label: "Paid On", value: "paidOn" },
];
export default function BillsPage() {
    const [modal, setModal] = useState({ name: null, data: null, state: false });
    const [filters, setFilters] = useState({
        itemsPerPage: 20,
        currentPage: 1,
        status: null,
        billingMonth: moment().format("YYYY-MM"),
    });
    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

    const [visibleColumns, setVisibleColumns] = useState(["connectionId", "billingMonth", "amount", "status", "paymentMode", "paidOn", "actions"]);

    const debFilter = useDebounce(filters, 500);

    const {
        listQuery: billsList,
        isRefreshing,
        handleRefresh
    } = useAdminData({
        listQueryKey: [ADMIN_KEYS.WATER_SUPPLY.BILLS_LIST, JSON.stringify(debFilter)],
        listQueryFn: () => LIST_BILLS(debFilter),
        onListError: "Failed to fetch bills.",
    });

    console.log(billsList?.data?.data?.stats)
    const onChange = React.useCallback((data) => setFilters((old) => ({ ...old, ...data })), []);

    const handleStatClick = React.useCallback((field, key) => {
        setFilters((prev) => ({
            ...prev,
            [field]: prev[field] === key ? null : key,
            currentPage: 1,
        }));
    }, []);

    const handleExport = React.useCallback(async () => {
        try {
            const toastId = toast.loading("Preparing export...");
            const res = await LIST_BILLS({ ...debFilter, limit: 999999, page: 1 });
            const allDocs = res?.data?.docs || [];
            
            if (!allDocs.length) {
                toast.update(toastId, { render: "No data to export", type: "info", isLoading: false, autoClose: 3000 });
                return;
            }

            const formattedData = allDocs.map((bill, index) => ({
                "S.No": index + 1,
                "Connection ID": bill.connectionId?.connectionId || "-",
                "Billing Month": bill.billingMonth || "-",
                "Amount": bill.amount || 0,
                "Status": bill.status || "-",
                "Payment Mode": bill.paymentMode || "-",
                "Paid On": bill.paidOn ? moment(bill.paidOn).format("DD MMM YYYY") : "-",
                "Created Date": moment(bill.createdAt).format("DD MMM YYYY")
            }));
            
            downloadCSV(formattedData, "Water_Bills.csv");
            toast.update(toastId, { render: "Export successful!", type: "success", isLoading: false, autoClose: 3000 });
        } catch (error) {
            console.error("Export Error:", error);
            toast.error("Failed to export data");
        }
    }, [debFilter]);

    const statCards = React.useMemo(() => [
        { label: "Total Bills", short: "Total", key: null, count: billsList?.data?.data?.stats?.totalBills || 0, amount: billsList?.data?.data?.stats?.totalAmount || 0, color: "#2563eb", bg: "#eff6ff", border: "#bfdbfe", field: "status" },
        { label: "Paid", short: "Paid", key: "PAID", count: billsList?.data?.data?.stats?.paidBills || 0, amount: billsList?.data?.data?.stats?.paidAmount || 0, color: "#16a34a", bg: "#f0fdf4", border: "#bbf7d0", field: "status" },
        { label: "Pending", short: "Pend", key: "PENDING", count: billsList?.data?.data?.stats?.unpaidBills || 0, amount: billsList?.data?.data?.stats?.unpaidAmount || 0, color: "#dc2626", bg: "#fef2f2", border: "#fecaca", field: "status" },
    ], [billsList?.data?.data?.stats]);

    return (
        <InnerPageCard title="Water Bills Management">
            <div className="flex flex-col md:flex-row justify-between mb-3 gap-2 md:gap-3 items-start md:items-center">
                <div className="grid grid-cols-3 md:flex gap-2 items-center md:flex-nowrap w-full md:w-auto">
                    {billsList?.status === "loading" ? (
                        Array.from({ length: 3 }).map((_, i) => <StatCardSkeleton key={i} />)
                    ) : (
                        statCards.map((card, i) => (
                            <StatCard
                                key={i}
                                title={card.label}
                                shortTitle={card.short}
                                count={
                                    <span className="flex gap-1.5 items-baseline">
                                        <span>{card.count}</span>
                                        {card.amount > 0 && <span className="text-[10px] opacity-80 font-bold pl-1">Amount: {card.amount.toLocaleString()}</span>}
                                    </span>
                                }
                                color={card.color}
                                bg={card.bg}
                                border={card.border}
                                active={filters[card.field] === card.key}
                                onClick={() => handleStatClick(card.field, card.key)}
                            />
                        ))
                    )}
                </div>

                <div className="flex flex-col md:flex-row gap-2 items-center w-full md:w-auto justify-end">
                    <div className="hidden md:flex items-center gap-1">
                        <DatePicker
                            picker="month"
                            format="MMMM YYYY"
                            value={filters.billingMonth ? dayjs(filters.billingMonth, "YYYY-MM") : null}
                            onChange={(date) => onChange({ billingMonth: date ? date.format("YYYY-MM") : null, currentPage: 1 })}
                            className="!h-[32px] !rounded-[2px] !border-2 !border-[#006666] dark:!border-teal-900/50 !bg-white dark:!bg-slate-900 transition-all duration-300 hover:!border-teal-600 dark:hover:!border-teal-500/50"
                            placeholder="Select Month & Year"
                            allowClear
                        />

                        <ColumnVisibilityDropdown
                            options={columnOptions}
                            visibleColumns={visibleColumns}
                            setVisibleColumns={setVisibleColumns}
                        />

                        <button
                            onClick={handleRefresh}
                            disabled={isRefreshing}
                            title="Refresh Data"
                            className="flex items-center justify-center !h-[32px] !w-[32px] !border-2 !rounded-[2px] !border-[#006666] dark:!border-teal-900/50 !bg-white dark:!bg-slate-800 !text-[#006666] dark:!text-teal-400 hover:!bg-[#006666] dark:hover:!bg-teal-600 hover:!text-white shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <HiRefresh size={16} className={isRefreshing ? "animate-spin" : ""} />
                        </button>

                        <button
                            onClick={handleExport}
                            disabled={!billsList?.data?.data?.docs?.length}
                            title="Download CSV"
                            className="flex items-center justify-center !h-[32px] !w-[32px] !border-2 !rounded-[2px] !border-[#006666] dark:!border-teal-900/50 !bg-white dark:!bg-slate-800 !text-[#006666] dark:!text-teal-400 hover:!bg-[#006666] dark:hover:!bg-teal-600 hover:!text-white shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <HiDownload size={16} />
                        </button>
                    </div>

                    <div className="flex flex-wrap justify-end items-center gap-1 w-full md:w-auto">
                        {/* Mobile Filter Toggle */}
                        <button
                            onClick={() => setIsFilterModalOpen(true)}
                            className="flex md:hidden items-center justify-center !h-[32px] !w-[32px] !border-2 !rounded-[2px] !border-[#006666] dark:!border-teal-900/50 !bg-white dark:!bg-slate-800 !text-[#006666] dark:!text-teal-400 hover:!bg-[#006666] dark:hover:!bg-teal-600 hover:!text-white shadow-sm transition-all"
                            title="Filters"
                        >
                            <FiFilter size={16} />
                        </button>

                        {hasPermission(PERMISSIONS.WATER_SUPPLY.CREATE) && (
                            <>
                                <AddButton
                                    title="Bulk Generate"
                                    icon={false}
                                    onClick={() => setModal({ name: "BulkAdd", data: null, state: true })}
                                    className="!h-[32px] !border-2 !border-[#006666] dark:!border-teal-900/50 !bg-white dark:!bg-slate-800 !text-[#006666] dark:!text-teal-400 hover:!bg-[#006666] dark:hover:!bg-teal-600 hover:!text-white !rounded !text-[10px] font-medium shadow-sm transition-all !px-3"
                                />

                                <AddButton
                                    title="Single Bill"
                                    icon={false}
                                    onClick={() => setModal({ name: "Add", data: null, state: true })}
                                    className="!h-[32px] !border-2 !border-[#006666] dark:!border-teal-900/50 !bg-white dark:!bg-slate-800 !text-[#006666] dark:!text-teal-400 hover:!bg-[#006666] dark:hover:!bg-teal-600 hover:!text-white !rounded !text-[10px] font-medium shadow-sm transition-all !px-3"
                                />
                            </>
                        )}
                    </div>
                </div>
            </div>

            <div className="flex flex-col mb-4">
                <BillsTable
                    modal={modal}
                    setModal={setModal}
                    billsList={billsList}
                    onChange={onChange}
                    setFilters={setFilters}
                    visibleColumns={visibleColumns}
                />
            </div>

            <AddBillModal modal={modal} setModal={setModal} />
            <BulkAddModal modal={modal} setModal={setModal} />
            <UpdateBillModal modal={modal} setModal={setModal} />
            <PayBillModal modal={modal} setModal={setModal} />
            
            <FilterModal
                open={isFilterModalOpen}
                onCancel={() => setIsFilterModalOpen(false)}
                filters={filters}
                onChange={onChange}
                columnOptions={columnOptions}
                visibleColumns={visibleColumns}
                setVisibleColumns={setVisibleColumns}
                handleRefresh={handleRefresh}
                isRefreshing={isRefreshing}
                handleExport={handleExport}
                hasData={billsList?.data?.data?.docs?.length > 0}
            />
        </InnerPageCard>
    );
}
