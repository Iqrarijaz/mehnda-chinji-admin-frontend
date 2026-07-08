import { GET_SUPPORT_TICKETS, GET_SUPPORT_STATUS_COUNTS } from "@/app/api/admin/support";
import { ADMIN_KEYS } from "@/constants/queryKeys";
import { useAdminData } from "@/hooks/useAdminData";

export const useSupport = (filter) => {
    return useAdminData({
        listQueryKey: [ADMIN_KEYS.SUPPORT.LIST, JSON.stringify(filter)],
        listQueryFn: () => GET_SUPPORT_TICKETS(filter),
        countsQueryKey: [ADMIN_KEYS.SUPPORT.COUNTS],
        countsQueryFn: GET_SUPPORT_STATUS_COUNTS,
        onListError: "Failed to fetch support tickets.",
    });
};
