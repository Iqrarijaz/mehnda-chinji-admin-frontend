import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { toast } from "react-toastify";

import { GET_CRICKET_TOURNAMENT_DETAILS } from "@/app/api/admin/cricket";
import { ADMIN_KEYS } from "@/constants/queryKeys";

/**
 * Backing query for the tournament detail dashboard.
 *
 * The endpoint answers with the tournament (rosters, standings, organisers and
 * populated admins) alongside its fixtures, so every tab on the page is served
 * by this one request.
 */
export const useTournamentDetails = (id) => {
    const query = useQuery({
        queryKey: [ADMIN_KEYS.CRICKET.TOURNAMENT_DETAILS, id],
        queryFn: () => GET_CRICKET_TOURNAMENT_DETAILS(id),
        enabled: Boolean(id)
    });

    useEffect(() => {
        if (query.isError) {
            toast.error(query.error?.errorMessage || "Failed to load tournament details.");
        }
    }, [query.isError, query.error]);

    return {
        query,
        tournament: query.data?.data || null,
        matches: query.data?.matches || []
    };
};
