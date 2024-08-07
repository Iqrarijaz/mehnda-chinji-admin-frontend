import Loading from "@/animations/homePageLoader";
import { DELETE_BUILDING } from "@/app/api/admin/buildings";
import { DELETE_CLIENT } from "@/app/api/admin/clients";
import { Button, Modal } from "antd";
import React from "react";
import { useMutation, useQueryClient } from "react-query";
import { toast } from "react-toastify";

function DeleteBuildingModal({ isModalOpen, setIsModalOpen }) {
  const queryClient = useQueryClient();
  const { record, name, state } = isModalOpen;

  const deleteMutation = useMutation({
    mutationKey: ["deleteBuilding"],
    mutationFn: async (values) => {
      return await DELETE_BUILDING(values);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(["buildingsList"]);
      toast.success(data?.message);
      setIsModalOpen({
        name: null,
        state: false,
        record: null,
      });
    },
    onError: (error) => {
      console.log(error);
      toast.error(error?.response?.data?.error);
    },
  });
  function handleModalCancel() {
    try {
      // Set the isModalOpen state to false to close the modal
      setIsModalOpen({
        name: null,
        state: false,
      });

      // Reset the record state to null
    } catch (error) {
      console.log({ error });
    }
  }

  // Function to handle delete mutation
  function handleDeleteMutation() {
    try {
      deleteMutation.mutate({ _id: record?._id });
    } catch (error) {
      console.log({ error });
    }
  }
  return (
    <Modal
      title="Delete Building"
      className="!rounded-2xl"
      centered
      width={600}
      open={name === "delete" && state === true}
      closeIcon={false}
      footer={false}
    >
      <div className="mb-6 relative">
      Are you sure you want to delete building with name {" "}
        {deleteMutation?.status === "loading" && <Loading />}
        <span className="font-bold capitalize">{record?.name}</span>?
      </div>
      <div className="flex justify-end gap-6">
        <Button className="cancel-button" onClick={handleModalCancel}>
          Cancel
        </Button>
        <Button className="apply-button" onClick={handleDeleteMutation}>
          Delete
        </Button>
      </div>
    </Modal>
  );
}

export default DeleteBuildingModal;
