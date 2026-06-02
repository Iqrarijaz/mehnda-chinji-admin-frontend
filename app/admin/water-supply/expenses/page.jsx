"use client";
import React, { useState } from "react";
import { toast } from "react-toastify";
import moment from "moment";
import AddButton from "@/components/InnerPage/AddButton";
import SearchInput from "@/components/InnerPage/SearchInput";
import dayjs from "dayjs";
import { DatePicker } from "antd";
import ExpensesTable from "./components/Table";
import AddExpenseModal from "./components/AddModal";
import UpdateExpenseModal from "./components/UpdateModal";
import { LIST_EXPENSES } from "@/app/api/admin/water-supply";
import { useDebounce } from "@/hooks/useDebounce";
import InnerPageCard from "@/components/layout/InnerPageCard";
import ColumnVisibilityDropdown from "@/components/InnerPage/ColumnVisibilityDropdown";
import { HiRefresh, HiDownload } from "react-icons/hi";
import { ADMIN_KEYS } from "@/constants/queryKeys";
import { useAdminData } from "@/hooks/useAdminData";
import { downloadCSV } from "@/utils/export";
import { hasPermission } from "@/utils/permissions";
import { PERMISSIONS } from "@/config/permissions";

const columnOptions = [
    { label: "Title", value: "title" },
    { label: "Amount", value: "amount" },
    { label: "Date", value: "expenseDate" },
    { label: "Logged At", value: "createdAt" },
];
export default function ExpensesPage() {
    const [modal, setModal] = useState({ name: null, data: null, state: false });
    const [filters, setFilters] = useState({
        itemsPerPage: 20,
        currentPage: 1,
        search: null,
        expenseMonth: dayjs().format("YYYY-MM"),
        onChangeSearch: false,
    });

    const [visibleColumns, setVisibleColumns] = useState(["title", "amount", "expenseDate", "createdAt"]);

    const debFilter = useDebounce(filters, filters.onChangeSearch ? 1000 : 0);

    const {
        listQuery: expensesList,
        isRefreshing,
        handleRefresh
    } = useAdminData({
        listQueryKey: [ADMIN_KEYS.WATER_SUPPLY.EXPENSES_LIST, JSON.stringify(debFilter)],
        listQueryFn: () => LIST_EXPENSES(debFilter),
        onListError: "Failed to fetch expenses.",
    });

    const onChange = React.useCallback((data) => setFilters((old) => ({ ...old, ...data })), []);

    const handleExport = React.useCallback(async () => {
        try {
            const toastId = toast.loading("Preparing export...");
            const res = await LIST_EXPENSES({ ...debFilter, limit: 999999, page: 1 });
            const allDocs = res?.data?.docs || [];
            
            if (!allDocs.length) {
                toast.update(toastId, { render: "No data to export", type: "info", isLoading: false, autoClose: 3000 });
                return;
            }

            const formattedData = allDocs.map((expense, index) => ({
                "S.No": index + 1,
                "Title": expense.title || "-",
                "Amount": expense.amount || 0,
                "Expense Date": expense.expenseDate ? moment(expense.expenseDate).format("DD MMM YYYY") : "-",
                "Created Date": moment(expense.createdAt).format("DD MMM YYYY")
            }));
            
            downloadCSV(formattedData, "Water_Expenses.csv");
            toast.update(toastId, { render: "Export successful!", type: "success", isLoading: false, autoClose: 3000 });
        } catch (error) {
            console.error("Export Error:", error);
            toast.error("Failed to export data");
        }
    }, [debFilter]);

    return (
        <InnerPageCard title="Operational Expenses">
            <div className="flex flex-col md:flex-row justify-between mb-3 gap-2 md:gap-3 items-start md:items-center">
                <div className="grid grid-cols-2 md:flex gap-2 items-center md:flex-nowrap w-full md:w-auto"></div>

                <div className="flex flex-col md:flex-row gap-2 items-center w-full md:w-auto justify-end">
                    <div className="flex flex-wrap md:flex-nowrap w-full md:w-auto justify-end gap-1">
                            <DatePicker
                                picker="month"
                                format="MMMM YYYY"
                                value={filters.expenseMonth ? dayjs(filters.expenseMonth, "YYYY-MM") : null}
                                onChange={(date) => onChange({ expenseMonth: date ? date.format("YYYY-MM") : null, currentPage: 1 })}
                                className="!w-[140px] md:!w-auto !h-[32px] !rounded-[2px] !border-2 !border-[#006666] dark:!border-teal-900/50 !bg-white dark:!bg-slate-900 transition-all duration-300 hover:!border-teal-600 dark:hover:!border-teal-500/50"
                                placeholder="Select Month & Year"
                                allowClear
                            />
                        <SearchInput
                            setFilters={setFilters}
                            className="!w-full md:!max-w-[200px] !h-[32px] mt-1 md:mt-0"
                            placeholder="Search Title"
                        />
                    </div>

                    <div className="flex flex-wrap md:flex-nowrap justify-end items-center gap-1 w-full md:w-auto">
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
                            disabled={!expensesList?.data?.data?.docs?.length}
                            title="Download CSV"
                            className="flex items-center justify-center !h-[32px] !w-[32px] !border-2 !rounded-[2px] !border-[#006666] dark:!border-teal-900/50 !bg-white dark:!bg-slate-800 !text-[#006666] dark:!text-teal-400 hover:!bg-[#006666] dark:hover:!bg-teal-600 hover:!text-white shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <HiDownload size={16} />
                        </button>

                        {hasPermission(PERMISSIONS.WATER_SUPPLY.CREATE) && (
                            <AddButton
                                title="Log Expense"
                                icon={false}
                                onClick={() => setModal({ name: "Add", data: null, state: true })}
                                className="!h-[32px] !border-2 !border-[#006666] dark:!border-teal-900/50 !bg-white dark:!bg-slate-800 !text-[#006666] dark:!text-teal-400 hover:!bg-[#006666] dark:hover:!bg-teal-600 hover:!text-white !rounded !text-[10px] font-medium shadow-sm transition-all !px-3"
                            />
                        )}
                    </div>
                </div>
            </div>

            <div className="flex flex-col mb-4">
                <ExpensesTable
                    expensesList={expensesList}
                    onChange={onChange}
                    visibleColumns={visibleColumns}
                    setModal={setModal}
                />
            </div>

            <AddExpenseModal modal={modal} setModal={setModal} />
            <UpdateExpenseModal modal={modal} setModal={setModal} />
        </InnerPageCard>
    );
}
