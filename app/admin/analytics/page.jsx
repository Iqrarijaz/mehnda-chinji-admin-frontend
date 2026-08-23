"use client";

import React, { useState, useMemo, useCallback, memo } from "react";
import UseMount from "@/hooks/useMount";

import {
    AnalyticsHeader,
    AnalyticsStatCards,
    UserGrowthChart,
    PeakUsageChart,
    MarketplaceListingsChart,
    MarketplaceCategoryChart
} from "@/components/admin/analytics";

import {
    useAnalyticsOverview,
    useUserAnalytics,
    useMarketplaceAnalytics,
    usePeakUsageAnalytics
} from "./hooks/useAnalytics";

const AnalyticsPage = memo(function AnalyticsPage() {
    const isMounted = UseMount();
    const [range, setRange] = useState("30d");
    const [customDates, setCustomDates] = useState(null);

    // Format start and end dates for custom date range picker
    const formattedStartDate = useMemo(() => {
        return customDates && customDates[0] ? customDates[0].format("YYYY-MM-DD") : undefined;
    }, [customDates]);

    const formattedEndDate = useMemo(() => {
        return customDates && customDates[1] ? customDates[1].format("YYYY-MM-DD") : undefined;
    }, [customDates]);

    // React Query Hooks
    const {
        data: overview = {},
        isLoading: ovLoading,
        refetch: refetchOverview,
        isRefetching: ovRefetching
    } = useAnalyticsOverview(range, formattedStartDate, formattedEndDate);

    const {
        data: userGrowth = [],
        isLoading: ugLoading,
        refetch: refetchUserGrowth,
        isRefetching: ugRefetching
    } = useUserAnalytics(range, formattedStartDate, formattedEndDate);

    const {
        data: marketplace = { listingsOverTime: [], categoryBreakdown: [] },
        isLoading: mpLoading,
        refetch: refetchMarketplace,
        isRefetching: mpRefetching
    } = useMarketplaceAnalytics(range, formattedStartDate, formattedEndDate);

    const {
        data: peakUsage = [],
        isLoading: pkLoading,
        refetch: refetchPeakUsage,
        isRefetching: pkRefetching
    } = usePeakUsageAnalytics();

    const isGlobalLoading = ovLoading || ugLoading || mpLoading || pkLoading ||
        ovRefetching || ugRefetching || mpRefetching || pkRefetching;

    // Highest Peak Hour Calculation (memoized)
    const highestPeakHour = useMemo(() => {
        if (!peakUsage.length) return "N/A";
        const max = [...peakUsage].sort((a, b) => b.activeCount - a.activeCount)[0];
        return max ? `${max.hour} (${max.activeCount} active)` : "N/A";
    }, [peakUsage]);

    // Range Change Handler
    const handleRangeChange = useCallback((newRange) => {
        setRange(newRange);
        setCustomDates(null); // Clear custom dates when selecting preset pills
    }, []);

    // Custom Date Range Handler
    const handleCustomDatesChange = useCallback((dates) => {
        setCustomDates(dates);
    }, []);

    // Global Refresh Handler
    const handleRefreshAll = useCallback(() => {
        refetchOverview();
        refetchUserGrowth();
        refetchMarketplace();
        refetchPeakUsage();
    }, [refetchOverview, refetchUserGrowth, refetchMarketplace, refetchPeakUsage]);

    if (!isMounted) return null;

    return (
        <div className="space-y-6 min-h-screen">
            {/* 1. Header Toolbar with Preset Pills & Date Picker */}
            <AnalyticsHeader
                range={range}
                onRangeChange={handleRangeChange}
                customDates={customDates}
                onCustomDatesChange={handleCustomDatesChange}
                onRefresh={handleRefreshAll}
                isLoading={isGlobalLoading}
            />

            {/* 2. Overview Metric KPI Summary Cards */}
            <AnalyticsStatCards
                overview={overview}
                peakHour={highestPeakHour}
            />

            {/* 3. Visual Charts Grid (2x2 Grid) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* User Registrations Trend */}
                <UserGrowthChart
                    data={userGrowth}
                    isLoading={ugLoading}
                />

                {/* 24-Hour Activity Peak Distribution */}
                <PeakUsageChart
                    data={peakUsage}
                    isLoading={pkLoading}
                />

                {/* Marketplace Listings Velocity */}
                <MarketplaceListingsChart
                    data={marketplace.listingsOverTime}
                    isLoading={mpLoading}
                />

                {/* Marketplace Category Share Donut */}
                <MarketplaceCategoryChart
                    data={marketplace.categoryBreakdown}
                    isLoading={mpLoading}
                />
            </div>
        </div>
    );
});

AnalyticsPage.displayName = "AnalyticsPage";

export default AnalyticsPage;
