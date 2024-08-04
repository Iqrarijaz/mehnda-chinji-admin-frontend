import Loading from "@/animations/homePageLoader";
import { Button, Modal } from "antd";
import React from "react";
import JsonView from "react18-json-view";
import "react18-json-view/src/style.css";

function JsonViewerModal({ isModalOpen, setIsModalOpen }) {
  const { name, state, record } = isModalOpen;

  function handleModalOk() {
    try {
      // Set the isModalOpen state to false to close the modal
      setIsModalOpen({
        name: null,
        state: false,
      });
    } catch (error) {
      console.log({ error });
    }
  }

  // Function to handle delete mutation
  return (
    <Modal
      title={name}
      className="!rounded-2xl"
      centered
      width={600}
      open={
        name === "Error Details" || name === "Request Body" ? state : false
      }
      onCancel={handleModalOk}
      closeIcon={true}
      footer={false}
    >
      <JsonView
        className="mt-6 overflow-x-auto"
        name={record}
        src={record}
        nameStyle={{ color: "#000" }}
        style={{ color: "#000" }}
      />
    </Modal>
  );
}

export default JsonViewerModal;
