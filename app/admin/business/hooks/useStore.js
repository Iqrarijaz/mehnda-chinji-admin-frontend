import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import {
    GET_STORE_DASHBOARD_STATS,
    GET_CATEGORIES,
    CREATE_CATEGORY,
    UPDATE_CATEGORY,
    DELETE_CATEGORY,
    GET_PRODUCTS,
    CREATE_PRODUCT,
    UPDATE_PRODUCT,
    DELETE_PRODUCT,
    GET_ORDERS,
    GET_ORDER,
    UPDATE_ORDER_STATUS
} from "@/app/api/admin/store";
import { ADMIN_KEYS } from "@/constants/queryKeys";

// ==============================
// Dashboard Hooks
// ==============================
export const useStoreDashboardStats = (businessId) => {
    return useQuery({
        queryKey: [ADMIN_KEYS.STORE.DASHBOARD.STATS, businessId],
        queryFn: () => GET_STORE_DASHBOARD_STATS(businessId),
        enabled: !!businessId,
        placeholderData: (prev) => prev
    });
};

// ==============================
// Category Hooks
// ==============================
export const useStoreCategoryList = (businessId) => {
    return useQuery({
        queryKey: [ADMIN_KEYS.STORE.CATEGORIES.LIST, businessId],
        queryFn: () => GET_CATEGORIES(businessId),
        enabled: !!businessId,
        placeholderData: (prev) => prev
    });
};

export const useCreateStoreCategory = (onCloseModal) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data) => CREATE_CATEGORY(data),
        onSuccess: (data) => {
            toast.success(data?.message || "Category created successfully");
            queryClient.invalidateQueries({ queryKey: [ADMIN_KEYS.STORE.CATEGORIES.LIST] });
            if (onCloseModal) onCloseModal(true);
        },
        onError: (error) => {
            toast.error(error.errorMessage || "Failed to create category");
        }
    });
};

export const useUpdateStoreCategory = (onCloseModal) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload) => UPDATE_CATEGORY(payload),
        onMutate: async ({ id, data }) => {
            await queryClient.cancelQueries({ queryKey: [ADMIN_KEYS.STORE.CATEGORIES.LIST] });
            
            queryClient.setQueriesData({ queryKey: [ADMIN_KEYS.STORE.CATEGORIES.LIST] }, (oldData) => {
                if (!oldData || !oldData.data) return oldData;
                return {
                    ...oldData,
                    data: oldData.data.map((cat) => cat._id === id ? { ...cat, ...data } : cat)
                };
            });
            
            if (onCloseModal) onCloseModal(true);
        },
        onError: (error) => {
            toast.error(error.errorMessage || "Failed to update category");
            queryClient.invalidateQueries({ queryKey: [ADMIN_KEYS.STORE.CATEGORIES.LIST] });
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: [ADMIN_KEYS.STORE.CATEGORIES.LIST] });
        },
        onSuccess: (data) => {
            toast.success(data?.message || "Category updated successfully");
        }
    });
};

export const useDeleteStoreCategory = (onCloseModal) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id) => DELETE_CATEGORY(id),
        onMutate: async (id) => {
            await queryClient.cancelQueries({ queryKey: [ADMIN_KEYS.STORE.CATEGORIES.LIST] });
            
            queryClient.setQueriesData({ queryKey: [ADMIN_KEYS.STORE.CATEGORIES.LIST] }, (oldData) => {
                if (!oldData || !oldData.data) return oldData;
                return {
                    ...oldData,
                    data: oldData.data.filter((cat) => cat._id !== id)
                };
            });
            
            if (onCloseModal) onCloseModal();
        },
        onError: (error) => {
            toast.error(error.errorMessage || "Failed to delete category");
            queryClient.invalidateQueries({ queryKey: [ADMIN_KEYS.STORE.CATEGORIES.LIST] });
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: [ADMIN_KEYS.STORE.CATEGORIES.LIST] });
        },
        onSuccess: (data) => {
            toast.success(data?.message || "Category deleted successfully");
        }
    });
};

// ==============================
// Product Hooks
// ==============================
export const useStoreProductList = (filters) => {
    return useQuery({
        queryKey: [ADMIN_KEYS.STORE.PRODUCTS.LIST, filters],
        queryFn: () => GET_PRODUCTS(filters),
        enabled: !!filters.businessId,
        placeholderData: (prev) => prev
    });
};

export const useCreateStoreProduct = (onCloseModal) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data) => CREATE_PRODUCT(data),
        onSuccess: (data) => {
            toast.success(data?.message || "Product created successfully");
            queryClient.invalidateQueries({ queryKey: [ADMIN_KEYS.STORE.PRODUCTS.LIST] });
            if (onCloseModal) onCloseModal(true);
        },
        onError: (error) => {
            toast.error(error.errorMessage || "Failed to create product");
        }
    });
};

export const useUpdateStoreProduct = (onCloseModal) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload) => UPDATE_PRODUCT(payload),
        onMutate: async ({ id, data }) => {
            await queryClient.cancelQueries({ queryKey: [ADMIN_KEYS.STORE.PRODUCTS.LIST] });
            
            // To properly update FormData optimistically is hard, so we just invalidate,
            // but we can try to update simple fields if they are sent as plain objects.
            // But since products often use FormData, we will stick to invalidation + closing modal instantly.
            if (onCloseModal) onCloseModal(true);
        },
        onError: (error) => {
            toast.error(error.errorMessage || "Failed to update product");
            queryClient.invalidateQueries({ queryKey: [ADMIN_KEYS.STORE.PRODUCTS.LIST] });
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: [ADMIN_KEYS.STORE.PRODUCTS.LIST] });
        },
        onSuccess: (data) => {
            toast.success(data?.message || "Product updated successfully");
        }
    });
};

export const useDeleteStoreProduct = (onCloseModal) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id) => DELETE_PRODUCT(id),
        onMutate: async (id) => {
            await queryClient.cancelQueries({ queryKey: [ADMIN_KEYS.STORE.PRODUCTS.LIST] });
            
            queryClient.setQueriesData({ queryKey: [ADMIN_KEYS.STORE.PRODUCTS.LIST] }, (oldData) => {
                if (!oldData || !oldData.data) return oldData;
                return {
                    ...oldData,
                    data: oldData.data.filter((prod) => prod._id !== id)
                };
            });
            
            if (onCloseModal) onCloseModal();
        },
        onError: (error) => {
            toast.error(error.errorMessage || "Failed to delete product");
            queryClient.invalidateQueries({ queryKey: [ADMIN_KEYS.STORE.PRODUCTS.LIST] });
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: [ADMIN_KEYS.STORE.PRODUCTS.LIST] });
        },
        onSuccess: (data) => {
            toast.success(data?.message || "Product deleted successfully");
        }
    });
};

// ==============================
// Order Hooks
// ==============================
export const useStoreOrderList = (filters) => {
    return useQuery({
        queryKey: [ADMIN_KEYS.STORE.ORDERS.LIST, filters],
        queryFn: () => GET_ORDERS(filters),
        placeholderData: (prev) => prev
    });
};

export const useStoreOrderDetails = (id) => {
    return useQuery({
        queryKey: [ADMIN_KEYS.STORE.ORDERS.DETAILS, id],
        queryFn: () => GET_ORDER(id),
        enabled: !!id
    });
};

export const useUpdateStoreOrderStatus = (onCloseModal) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload) => UPDATE_ORDER_STATUS(payload),
        onMutate: async ({ id, status }) => {
            await queryClient.cancelQueries({ queryKey: [ADMIN_KEYS.STORE.ORDERS.LIST] });
            
            queryClient.setQueriesData({ queryKey: [ADMIN_KEYS.STORE.ORDERS.LIST] }, (oldData) => {
                if (!oldData || !oldData.data) return oldData;
                return {
                    ...oldData,
                    data: oldData.data.map((order) => order._id === id ? { ...order, status } : order)
                };
            });
            
            if (onCloseModal) onCloseModal();
        },
        onError: (error) => {
            toast.error(error.errorMessage || "Failed to update order status");
            queryClient.invalidateQueries({ queryKey: [ADMIN_KEYS.STORE.ORDERS.LIST] });
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: [ADMIN_KEYS.STORE.ORDERS.LIST] });
            queryClient.invalidateQueries({ queryKey: [ADMIN_KEYS.STORE.ORDERS.DETAILS] });
        },
        onSuccess: (data) => {
            toast.success(data?.message || "Order status updated successfully");
        }
    });
};
