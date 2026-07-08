import { GET_REPORTS, GET_REPORT_STATUS_COUNTS } from "@/app/api/admin/reports";
import { ADMIN_KEYS } from "@/constants/queryKeys";
import { useAdminData } from "@/hooks/useAdminData";

export const useReports = (filter) => {
    return useAdminData({
        listQueryKey: [ADMIN_KEYS.REPORTS.LIST, JSON.stringify(filter)],
        listQueryFn: () => GET_REPORTS(filter),
        countsQueryKey: [ADMIN_KEYS.REPORTS.COUNTS],
        countsQueryFn: GET_REPORT_STATUS_COUNTS,
        onListError: "Failed to fetch reports.",
    });
};
