import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { 
    GET_BUSINESSES, 
    GET_BUSINESS, 
    CREATE_BUSINESS, 
    UPDATE_BUSINESS, 
    UPDATE_BUSINESS_STATUS, 
    DELETE_BUSINESS, 
    GET_BUSINESS_STATUS_COUNTS 
} from "@/app/api/admin/business";
import { ADMIN_KEYS } from "@/constants/queryKeys";

/**
 * Hook to fetch the paginated list of businesses
 */
export const useBusinessList = (filters) => {
    return useQuery({
        queryKey: [ADMIN_KEYS.BUSINESS.LIST, filters],
        queryFn: () => GET_BUSINESSES(filters),
        placeholderData: (prev) => prev
    });
};

/**
 * Hook to fetch business status counts for dashboard
 */
export const useBusinessStatusCounts = () => {
    return useQuery({
        queryKey: [ADMIN_KEYS.BUSINESS.COUNTS],
        queryFn: () => GET_BUSINESS_STATUS_COUNTS(),
        placeholderData: (prev) => prev
    });
};

/**
 * Hook to get a single business details
 */
export const useBusinessDetails = (id) => {
    return useQuery({
        queryKey: [ADMIN_KEYS.BUSINESS.LIST, "details", id],
        queryFn: () => GET_BUSINESS(id),
        enabled: !!id
    });
};

/**
 * Hook to create a business
 */
export const useCreateBusiness = (onSuccessCallback) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data) => CREATE_BUSINESS(data),
        onSuccess: (data) => {
            toast.success(data?.message || "Business created successfully");
            queryClient.invalidateQueries({ queryKey: [ADMIN_KEYS.BUSINESS.LIST] });
            queryClient.invalidateQueries({ queryKey: [ADMIN_KEYS.BUSINESS.COUNTS] });
            if (onSuccessCallback) onSuccessCallback();
        },
        onError: (error) => {
            toast.error(error.errorMessage || error.message || "Failed to create business");
        }
    });
};

/**
 * Hook to update a business
 */
export const useUpdateBusiness = (onSuccessCallback) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data) => UPDATE_BUSINESS(data),
        onSuccess: (data) => {
            toast.success(data?.message || "Business updated successfully");
            queryClient.invalidateQueries({ queryKey: [ADMIN_KEYS.BUSINESS.LIST] });
            if (onSuccessCallback) onSuccessCallback();
        },
        onError: (error) => {
            toast.error(error.errorMessage || error.message || "Failed to update business");
        }
    });
};

/**
 * Hook to update the business status, implementing Optimistic UI updates
 */
export const useUpdateBusinessStatus = (onCloseModal) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data) => UPDATE_BUSINESS_STATUS(data),
        
        onMutate: async (data) => {
            // Cancel outgoing refetches
            await queryClient.cancelQueries({ queryKey: [ADMIN_KEYS.BUSINESS.LIST] });

            // Optimistically update to the new value across all paginated caches
            queryClient.setQueriesData({ queryKey: [ADMIN_KEYS.BUSINESS.LIST] }, (oldData) => {
                if (!oldData || !oldData.data) return oldData;
                
                return {
                    ...oldData,
                    data: oldData.data.map((item) => 
                        item._id === data._id ? { ...item, status: data.status } : item
                    )
                };
            });

            if (onCloseModal) onCloseModal();
        },

        onError: (err) => {
            toast.error(err.errorMessage || err.message || "Failed to update status");
            queryClient.invalidateQueries({ queryKey: [ADMIN_KEYS.BUSINESS.LIST] });
        },

        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: [ADMIN_KEYS.BUSINESS.LIST] });
            queryClient.invalidateQueries({ queryKey: [ADMIN_KEYS.BUSINESS.COUNTS] });
        },
        
        onSuccess: (response) => {
            toast.success(response?.message || "Status updated successfully");
        }
    });
};

/**
 * Hook to delete a business
 */
export const useDeleteBusiness = (onCloseModal) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data) => DELETE_BUSINESS(data),
        
        onMutate: async (data) => {
            await queryClient.cancelQueries({ queryKey: [ADMIN_KEYS.BUSINESS.LIST] });
            
            // Optimistically remove the item
            queryClient.setQueriesData({ queryKey: [ADMIN_KEYS.BUSINESS.LIST] }, (oldData) => {
                if (!oldData || !oldData.data) return oldData;
                return {
                    ...oldData,
                    data: oldData.data.filter((item) => item._id !== data._id)
                };
            });

            if (onCloseModal) onCloseModal();
        },
        
        onError: (error) => {
            toast.error(error.errorMessage || error.message || "Failed to delete business");
            queryClient.invalidateQueries({ queryKey: [ADMIN_KEYS.BUSINESS.LIST] });
        },
        
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: [ADMIN_KEYS.BUSINESS.LIST] });
            queryClient.invalidateQueries({ queryKey: [ADMIN_KEYS.BUSINESS.COUNTS] });
        },
        
        onSuccess: (response) => {
            toast.success(response?.message || "Business deleted successfully");
        }
    });
};
