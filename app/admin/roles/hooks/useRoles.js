import { GET_ROLES } from "@/app/api/admin/roles";
import { ADMIN_KEYS } from "@/constants/queryKeys";
import { useAdminData } from "@/hooks/useAdminData";

export const useRoles = (filter) => {
    return useAdminData({
        listQueryKey: [ADMIN_KEYS.ROLES.LIST, JSON.stringify(filter)],
        listQueryFn: () => GET_ROLES(filter),
        onListError: "Failed to fetch roles.",
    });
};
