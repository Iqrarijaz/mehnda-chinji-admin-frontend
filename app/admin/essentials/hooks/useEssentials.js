import { GET_ESSENTIALS, GET_ESSENTIAL_STATUS_COUNTS } from "@/app/api/admin/essentials";
import { ADMIN_KEYS } from "@/constants/queryKeys";
import { useAdminData } from "@/hooks/useAdminData";

export const useEssentials = (filter) => {
    return useAdminData({
        listQueryKey: [ADMIN_KEYS.ESSENTIALS.LIST, JSON.stringify(filter)],
        listQueryFn: () => GET_ESSENTIALS(filter),
        countsQueryKey: [ADMIN_KEYS.ESSENTIALS.COUNTS],
        countsQueryFn: GET_ESSENTIAL_STATUS_COUNTS,
        onListError: "Failed to fetch essentials.",
    });
};
