"use client";
import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { toast } from "react-toastify";
import FeedbackList from "@/components/admin/feedback/FeedbackList";
import { GET_FEEDBACK, UPDATE_FEEDBACK_STATUS, DELETE_FEEDBACK } from "@/app/api/admin/feedback";
import InnerPageCard from "@/components/layout/InnerPageCard";
import ConfirmModal from "@/components/shared/ConfirmModal";
import { ADMIN_KEYS } from "@/constants/queryKeys";

export default function FeedbackPage() {
    const queryClient = useQueryClient();
    const [filters, setFilters] = useState({
        limit: 20,
        page: 1,
    });
    
    const [confirmModal, setConfirmModal] = useState({
        isOpen: false,
        title: "",
        description: "",
        onConfirm: null,
        variant: "primary",
        confirmText: "Confirm",
        cancelText: "Cancel"
    });

    const closeConfirmModal = React.useCallback(() => {
        setConfirmModal((prev) => ({ ...prev, isOpen: false }));
    }, []);

    const { data, isLoading } = useQuery(
        [ADMIN_KEYS.FEEDBACK.LIST, filters],
        () => GET_FEEDBACK(filters),
        { keepPreviousData: true }
    );

    const statusMutation = useMutation({
        mutationFn: ({ id, status }) => UPDATE_FEEDBACK_STATUS(id, status),
        onSuccess: () => {
            toast.success("Status updated successfully");
            queryClient.invalidateQueries([ADMIN_KEYS.FEEDBACK.LIST]);
            closeConfirmModal();
        },
        onError: (error) => {
            toast.error(error.errorMessage || error.message || "Failed to update status");
            closeConfirmModal();
        },
    });

    const deleteMutation = useMutation({
        mutationFn: (id) => DELETE_FEEDBACK(id),
        onSuccess: () => {
            toast.success("Feedback deleted successfully");
            queryClient.invalidateQueries([ADMIN_KEYS.FEEDBACK.LIST]);
            closeConfirmModal();
        },
        onError: (error) => {
            toast.error(error.errorMessage || error.message || "Failed to delete feedback");
            closeConfirmModal();
        },
    });

    const onDelete = React.useCallback((id) => {
        setConfirmModal({
            isOpen: true,
            title: 'Confirm Deletion',
            description: 'Are you sure you want to delete this feedback? This action cannot be undone.',
            confirmText: 'Yes, Delete',
            cancelText: 'Cancel',
            variant: 'danger',
            onConfirm: () => deleteMutation.mutate(id)
        });
    }, [deleteMutation]);

    const onUpdateStatus = React.useCallback((id, status) => {
        setConfirmModal({
            isOpen: true,
            title: 'Confirm Status Update',
            description: `Are you sure you want to mark this feedback as ${status.replace(/_/g, ' ')}?`,
            confirmText: 'Yes, Update',
            cancelText: 'Cancel',
            variant: 'primary',
            onConfirm: () => statusMutation.mutate({ id, status })
        });
    }, [statusMutation]);

    return (
        <InnerPageCard title="User Feedback">
            <FeedbackList 
                data={data?.data || []} 
                isLoading={isLoading} 
                filters={filters} 
                setFilters={setFilters} 
                pagination={data?.pagination}
                onUpdateStatus={onUpdateStatus}
                onDelete={onDelete}
            />
            
            <ConfirmModal 
                isOpen={confirmModal.isOpen} 
                onClose={closeConfirmModal} 
                title={confirmModal.title} 
                description={confirmModal.description} 
                onConfirm={confirmModal.onConfirm}
                variant={confirmModal.variant}
                confirmText={confirmModal.confirmText}
                cancelText={confirmModal.cancelText}
            />
        </InnerPageCard>
    );
}
