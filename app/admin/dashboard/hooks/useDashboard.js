import { useQuery } from "@tanstack/react-query";
import {
    GET_COMMUNITY_STATS,
    GET_MARKETPLACE_STATS,
    GET_SUPPORT_STATS
} from "@/app/api/admin/dashboard";
import { ADMIN_KEYS } from "@/constants/queryKeys";

export const useCommunityStats = () => {
    return useQuery({
        queryKey: [ADMIN_KEYS.DASHBOARD?.COMMUNITY || "dashboard_community"],
        queryFn: async () => {
            try {
                const res = await GET_COMMUNITY_STATS();
                return res?.data || {};
            } catch (err) {
                return {};
            }
        },
    });
};

export const useMarketplaceStats = () => {
    return useQuery({
        queryKey: [ADMIN_KEYS.DASHBOARD?.MARKETPLACE || "dashboard_marketplace"],
        queryFn: async () => {
            try {
                const res = await GET_MARKETPLACE_STATS();
                return res?.data || {};
            } catch (err) {
                return {};
            }
        },
    });
};

export const useSupportStats = () => {
    return useQuery({
        queryKey: [ADMIN_KEYS.DASHBOARD?.SUPPORT || "dashboard_support"],
        queryFn: async () => {
            try {
                const res = await GET_SUPPORT_STATS();
                return res?.data || {};
            } catch (err) {
                return {};
            }
        },
    });
};
