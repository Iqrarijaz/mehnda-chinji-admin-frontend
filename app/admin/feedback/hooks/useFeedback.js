import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { GET_FEEDBACK, UPDATE_FEEDBACK_STATUS, DELETE_FEEDBACK } from "@/app/api/admin/feedback";
import { ADMIN_KEYS } from "@/constants/queryKeys";


export const useFeedbackList = (filters) => {
    return useQuery({
        queryKey: [ADMIN_KEYS.FEEDBACK.LIST, filters],
        queryFn: () => GET_FEEDBACK(filters),
        placeholderData: (prev) => prev
    });
};


export const useUpdateFeedbackStatus = (onCloseModal) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, status }) => UPDATE_FEEDBACK_STATUS(id, status),


        onMutate: async ({ id, status }) => {

            await queryClient.cancelQueries({ queryKey: [ADMIN_KEYS.FEEDBACK.LIST] });


            queryClient.setQueriesData({ queryKey: [ADMIN_KEYS.FEEDBACK.LIST] }, (oldData) => {
                if (!oldData || !oldData.data) return oldData;

                return {
                    ...oldData,
                    data: oldData.data.map((item) =>
                        item._id === id ? { ...item, status } : item
                    )
                };
            });

            if (onCloseModal) onCloseModal();
        },


        onError: (err) => {
            toast.error(err.errorMessage || err.message || "Failed to update status");
            queryClient.invalidateQueries({ queryKey: [ADMIN_KEYS.FEEDBACK.LIST] });
        },


        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: [ADMIN_KEYS.FEEDBACK.LIST] });
        },

        onSuccess: () => {
            toast.success("Status updated successfully");
        }
    });
};

/**
 * Hook to delete feedback
 */
export const useDeleteFeedback = (onCloseModal) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id) => DELETE_FEEDBACK(id),

        onMutate: async (id) => {
            await queryClient.cancelQueries({ queryKey: [ADMIN_KEYS.FEEDBACK.LIST] });


            queryClient.setQueriesData({ queryKey: [ADMIN_KEYS.FEEDBACK.LIST] }, (oldData) => {
                if (!oldData || !oldData.data) return oldData;
                return {
                    ...oldData,
                    data: oldData.data.filter((item) => item._id !== id)
                };
            });

            if (onCloseModal) onCloseModal();
        },

        onError: (error) => {
            toast.error(error.errorMessage || error.message || "Failed to delete feedback");
            queryClient.invalidateQueries({ queryKey: [ADMIN_KEYS.FEEDBACK.LIST] });
        },

        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: [ADMIN_KEYS.FEEDBACK.LIST] });
        },

        onSuccess: () => {
            toast.success("Feedback deleted successfully");
        }
    });
};
