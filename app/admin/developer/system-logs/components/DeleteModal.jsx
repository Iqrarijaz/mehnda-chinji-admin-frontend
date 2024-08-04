import Loading from "@/animations/homePageLoader";
import { DELETE_SYSTEM_LOG } from "@/app/api/admin/developers/systemLogs";
import { Button, Modal } from "antd";
import React from "react";
import { useMutation, useQueryClient } from "react-query";
import { toast } from "react-toastify";

function DeleteSystemLogsModal({ isModalOpen, setIsModalOpen }) {
  // Accessing query client from react-query
  const queryClient = useQueryClient();

  // Destructuring modal state
  const { record, name, state } = isModalOpen;

  // Mutation hook for deleting system log
  const deleteMutation = useMutation({
    // Unique key for the mutation
    mutationKey: ["deleteMutation"],
    // Mutation function to call DELETE_SYSTEM_LOG API
    mutationFn: async (values) => {
      return await DELETE_SYSTEM_LOG(values);
    },
    // On successful mutation
    onSuccess: (data) => {
      // Invalidate systemLogsList query to trigger refetch
      queryClient.invalidateQueries(["systemLogsList"]);
      // Show success toast message
      toast.success(data?.message);
      // Close the modal by resetting isModalOpen state
      setIsModalOpen({
        name: null,
        state: false,
        record: null,
      });
    },
    // On error during mutation
    onError: (error) => {
      console.log(error);
      // Show error toast message
      toast.error(error?.response?.data?.error);
    },
  });

  // Function to handle modal cancel action
  function handleModalCancel() {
    try {
      // Close the modal by resetting isModalOpen state
      setIsModalOpen({
        name: null,
        state: false,
        record: null,
      });
    } catch (error) {
      console.log({ error });
    }
  }

  // Function to handle delete action
  function handleDeleteMutation() {
    try {
      // Trigger delete mutation with _id of the record to delete
      deleteMutation.mutate({ _id: record?._id });
    } catch (error) {
      console.log({ error });
    }
  }

  // JSX structure for the modal component
  return (
    <Modal
      title="Delete System Log"
      className="!rounded-2xl"
      centered
      width={600}
      // Control modal visibility based on name and state
      open={name === "Delete" ? state : false}
      // Disable close icon in modal header
      closeIcon={false}
      // Hide modal footer
      footer={false}
    >
      <div className="mb-6 relative">
        {/* Confirmation message */}
        Are you sure you want to delete this system log?
        {/* Display loading indicator if delete mutation is in progress */}
        {deleteMutation?.status === "loading" && <Loading />}
      </div>
      {/* Modal actions */}
      <div className="flex justify-end gap-6">
        {/* Cancel button */}
        <Button className="cancel-button" onClick={handleModalCancel}>
          Cancel
        </Button>
        {/* Delete button */}
        <Button className="apply-button" onClick={handleDeleteMutation}>
          Delete
        </Button>
      </div>
    </Modal>
  );
}

export default DeleteSystemLogsModal;
