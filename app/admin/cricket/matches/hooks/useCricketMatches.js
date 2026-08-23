import {
    GET_CRICKET_MATCHES,
    GET_CRICKET_MATCH_STATUS_COUNTS
} from "@/app/api/admin/cricket";
import { ADMIN_KEYS } from "@/constants/queryKeys";
import { useAdminData } from "@/hooks/useAdminData";

export const useCricketMatches = (filter) => {
    return useAdminData({
        listQueryKey: [ADMIN_KEYS.CRICKET.MATCHES, JSON.stringify(filter)],
        listQueryFn: () => GET_CRICKET_MATCHES(filter),
        countsQueryKey: [ADMIN_KEYS.CRICKET.MATCH_COUNTS],
        countsQueryFn: GET_CRICKET_MATCH_STATUS_COUNTS,
        onListError: "Failed to fetch matches.",
        onCountsError: "Failed to fetch match counts."
    });
};
