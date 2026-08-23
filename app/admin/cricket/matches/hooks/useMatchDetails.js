import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { toast } from "react-toastify";

import { GET_CRICKET_MATCH_DETAILS } from "@/app/api/admin/cricket";
import { ADMIN_KEYS } from "@/constants/queryKeys";

/**
 * Backing query for the match scorecard and scorer control panel.
 *
 * The endpoint returns the fixture, both full squads (the panel lists players
 * side by side) and the prediction tally in one response.
 */
export const useMatchDetails = (id) => {
    const query = useQuery({
        queryKey: [ADMIN_KEYS.CRICKET.MATCH_DETAILS, id],
        queryFn: () => GET_CRICKET_MATCH_DETAILS(id),
        enabled: Boolean(id)
    });

    useEffect(() => {
        if (query.isError) {
            toast.error(query.error?.errorMessage || "Failed to load match details.");
        }
    }, [query.isError, query.error]);

    return {
        query,
        match: query.data?.data || null,
        teams: query.data?.teams || { teamA: null, teamB: null },
        totalPredictions: query.data?.totalPredictions || 0
    };
};
