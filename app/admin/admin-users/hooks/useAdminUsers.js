import { GET_ADMIN_USERS, GET_ADMIN_USER_STATUS_COUNTS } from "@/app/api/admin/admin-users";
import { ADMIN_KEYS } from "@/constants/queryKeys";
import { useAdminData } from "@/hooks/useAdminData";

export const useAdminUsers = (filter) => {
    return useAdminData({
        listQueryKey: [ADMIN_KEYS.ADMIN_USERS.LIST, JSON.stringify(filter)],
        listQueryFn: () => GET_ADMIN_USERS(filter),
        countsQueryKey: [ADMIN_KEYS.ADMIN_USERS.COUNTS],
        countsQueryFn: GET_ADMIN_USER_STATUS_COUNTS,
        onListError: "Failed to fetch admin users.",
    });
};
