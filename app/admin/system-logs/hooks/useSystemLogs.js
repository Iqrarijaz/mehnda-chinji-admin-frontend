import { GET_SYSTEM_LOGS } from "@/app/api/admin/logs";
import { ADMIN_KEYS } from "@/constants/queryKeys";
import { useAdminData } from "@/hooks/useAdminData";

export const useSystemLogs = (filter) => {
    return useAdminData({
        listQueryKey: [ADMIN_KEYS.LOGS.LIST, JSON.stringify(filter)],
        listQueryFn: () => GET_SYSTEM_LOGS(filter),
        onListError: "Failed to fetch system logs.",
    });
};
