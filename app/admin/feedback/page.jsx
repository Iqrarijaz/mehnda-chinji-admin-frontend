"use client";
import React, { useState } from "react";
import FeedbackList from "@/components/admin/feedback/FeedbackList";
import InnerPageCard from "@/components/layout/InnerPageCard";
import ConfirmModal from "@/components/shared/ConfirmModal";
import { useFeedbackList, useUpdateFeedbackStatus, useDeleteFeedback } from "./hooks/useFeedback";

export default function FeedbackPage() {
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

    const { data, isLoading } = useFeedbackList(filters);
    const statusMutation = useUpdateFeedbackStatus(closeConfirmModal);
    const deleteMutation = useDeleteFeedback(closeConfirmModal);

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
        <InnerPageCard>
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
