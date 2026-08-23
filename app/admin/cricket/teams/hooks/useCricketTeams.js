import { GET_CRICKET_TEAMS } from "@/app/api/admin/cricket";
import { ADMIN_KEYS } from "@/constants/queryKeys";
import { useAdminData } from "@/hooks/useAdminData";

export const useCricketTeams = (filter) => {
    return useAdminData({
        listQueryKey: [ADMIN_KEYS.CRICKET.TEAMS, JSON.stringify(filter)],
        listQueryFn: () => GET_CRICKET_TEAMS(filter),
        onListError: "Failed to fetch teams."
    });
};
