import { GET_CONFIGURATIONS } from "@/app/api/admin/configurations";
import { ADMIN_KEYS } from "@/constants/queryKeys";
import { useAdminData } from "@/hooks/useAdminData";

export const useConfigurations = (filter) => {
    return useAdminData({
        listQueryKey: [ADMIN_KEYS.CONFIGURATIONS.LIST, JSON.stringify(filter)],
        listQueryFn: () => GET_CONFIGURATIONS(filter),
        onListError: "Failed to fetch configurations.",
    });
};
