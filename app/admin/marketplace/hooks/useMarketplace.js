import { GET_MARKETPLACE_LIST, GET_MARKETPLACE_STATUS_COUNTS } from "@/app/api/admin/marketplace";
import { ADMIN_KEYS } from "@/constants/queryKeys";
import { useAdminData } from "@/hooks/useAdminData";

export const useMarketplace = (filter) => {
    return useAdminData({
        listQueryKey: [ADMIN_KEYS.MARKETPLACE.LIST, JSON.stringify(filter)],
        listQueryFn: () => GET_MARKETPLACE_LIST(filter),
        countsQueryKey: [ADMIN_KEYS.MARKETPLACE.COUNTS],
        countsQueryFn: GET_MARKETPLACE_STATUS_COUNTS,
        onListError: "Failed to fetch marketplace listings.",
    });
};
