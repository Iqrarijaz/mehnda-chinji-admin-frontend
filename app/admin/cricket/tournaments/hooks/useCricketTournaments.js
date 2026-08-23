import {
    GET_CRICKET_TOURNAMENTS,
    GET_CRICKET_TOURNAMENT_STATUS_COUNTS
} from "@/app/api/admin/cricket";
import { ADMIN_KEYS } from "@/constants/queryKeys";
import { useAdminData } from "@/hooks/useAdminData";

export const useCricketTournaments = (filter) => {
    return useAdminData({
        listQueryKey: [ADMIN_KEYS.CRICKET.TOURNAMENTS, JSON.stringify(filter)],
        listQueryFn: () => GET_CRICKET_TOURNAMENTS(filter),
        countsQueryKey: [ADMIN_KEYS.CRICKET.TOURNAMENT_COUNTS],
        countsQueryFn: GET_CRICKET_TOURNAMENT_STATUS_COUNTS,
        onListError: "Failed to fetch cricket tournaments.",
        onCountsError: "Failed to fetch tournament counts."
    });
};
