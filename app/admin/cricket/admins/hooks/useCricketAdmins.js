import { GET_CRICKET_ADMINS } from "@/app/api/admin/cricket";
import { ADMIN_KEYS } from "@/constants/queryKeys";
import { useAdminData } from "@/hooks/useAdminData";

export const useCricketAdmins = (filter) => {
    return useAdminData({
        listQueryKey: [ADMIN_KEYS.CRICKET.ADMINS, JSON.stringify(filter)],
        listQueryFn: () => GET_CRICKET_ADMINS(filter),
        onListError: "Failed to fetch cricket admins."
    });
};
