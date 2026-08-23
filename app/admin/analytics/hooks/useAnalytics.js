import { useQuery } from "@tanstack/react-query";
import { Axios } from "@/interceptors";

export function useAnalyticsOverview(range = "7d", startDate, endDate) {
    return useQuery({
        queryKey: ["analytics", "overview", range, startDate, endDate],
        queryFn: async () => {
            const res = await Axios.get("/api/admin/v1/analytics/overview", {
                params: { range, startDate, endDate }
            });
            return res?.data?.data || {};
        },
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
}

export function useUserAnalytics(range = "7d", startDate, endDate) {
    return useQuery({
        queryKey: ["analytics", "users", range, startDate, endDate],
        queryFn: async () => {
            const res = await Axios.get("/api/admin/v1/analytics/users", {
                params: { range, startDate, endDate }
            });
            return res?.data?.data || [];
        },
        staleTime: 1000 * 60 * 5,
    });
}

export function useMarketplaceAnalytics(range = "7d", startDate, endDate) {
    return useQuery({
        queryKey: ["analytics", "marketplace", range, startDate, endDate],
        queryFn: async () => {
            const res = await Axios.get("/api/admin/v1/analytics/marketplace", {
                params: { range, startDate, endDate }
            });
            return res?.data?.data || { listingsOverTime: [], categoryBreakdown: [] };
        },
        staleTime: 1000 * 60 * 5,
    });
}

export function usePeakUsageAnalytics() {
    return useQuery({
        queryKey: ["analytics", "peak-usage"],
        queryFn: async () => {
            const res = await Axios.get("/api/admin/v1/analytics/peak-usage");
            return res?.data?.data || [];
        },
        staleTime: 1000 * 60 * 5,
    });
}
