
import { useState, useCallback, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";


export const useAdminData = ({
    listQueryKey,
    listQueryFn,
    countsQueryKey = null,
    countsQueryFn = null,
    onListError = "Failed to fetch data.",
    onCountsError = "Failed to fetch status counts.",
    keepPreviousData = true,
}) => {
    const [isRefreshing, setIsRefreshing] = useState(false);

    // 1. Fetch main list data
    const listQuery = useQuery({
        queryKey: listQueryKey,
        queryFn: listQueryFn,
        placeholderData: keepPreviousData ? (previousData) => previousData : undefined,
    });

    useEffect(() => {
        if (listQuery.isError) {
            const msg = listQuery.error?.response?.data?.message || onListError;
            toast.error(msg);
        }
    }, [listQuery.isError, listQuery.error, onListError]);

    // 2. Fetch status counts data (optional)
    const countsQuery = useQuery({
        queryKey: countsQueryKey,
        queryFn: countsQueryFn,
        enabled: Boolean(countsQueryKey && countsQueryFn),
    });

    useEffect(() => {
        if (countsQuery.isError) {
            const msg = countsQuery.error?.response?.data?.message || onCountsError;
            toast.error(msg);
        }
    }, [countsQuery.isError, countsQuery.error, onCountsError]);

    // 3. Centralized manual refresh handler
    const handleRefresh = useCallback(async () => {
        setIsRefreshing(true);
        try {
            const refetchPromises = [listQuery.refetch()];
            if (countsQueryKey && countsQuery.refetch) {
                refetchPromises.push(countsQuery.refetch());
            }
            await Promise.all(refetchPromises);
            toast.success("Data synchronized successfully!");
        } catch (error) {
            toast.error("Manual sync failed. Please try again.");
        } finally {
            setIsRefreshing(false);
        }
    }, [listQuery, countsQuery, countsQueryKey]);

    return {
        listQuery,    // Full react-query object for the list
        countsQuery,  // Full react-query object for the counts
        isRefreshing, // loading state for the refresh button
        handleRefresh // function to trigger manual sync
    };
};
