import { GET_USERS, GET_USER_STATUS_COUNTS } from "@/app/api/admin/users";
import { ADMIN_KEYS } from "@/constants/queryKeys";
import { useAdminData } from "@/hooks/useAdminData";

export const useUsers = (filter) => {
    return useAdminData({
        listQueryKey: [ADMIN_KEYS.USERS.LIST, JSON.stringify(filter)],
        listQueryFn: () => GET_USERS(filter),
        countsQueryKey: [ADMIN_KEYS.USERS.COUNTS],
        countsQueryFn: GET_USER_STATUS_COUNTS,
        onListError: "Failed to fetch users.",
    });
};
