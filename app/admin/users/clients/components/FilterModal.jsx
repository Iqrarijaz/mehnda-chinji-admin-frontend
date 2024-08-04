import React, { useState } from "react";
import { Button, Input, Modal } from "antd";
import { Select } from "antd";

function ClientFilterModal({ isModalOpen, setIsModalOpen, setFilters }) {
  // Initialize the advanceFilter state with null values
  const [advanceFilter, setAdvanceFilter] = useState({
    companyName: null,
    contactName: null,
    contactEmail: null,
    status: null,
  });

  // Function to handle modal cancel
  function handleModalCancel() {
    try {
      // Reset the advanceFilter state to null values
      setAdvanceFilter({
        companyName: null,
        contactName: null,
        contactEmail: null,
        status: null,
      });

      // setting setFilters to null
      setFilters((old) => ({
        ...old,
        advance: null,
      }));

      // Set the isModalOpen state to false to close the modal
      setIsModalOpen(false);
    } catch (error) {
      console.log({ error });
    }
  }

  // Function to handle modal apply
  function handleModalApply() {
    try {
      // Update the filters using the setFilters function from the context
      setFilters((oldValues) => ({
        ...oldValues,
        advance: advanceFilter,
      }));
      // Set the isModalOpen state to false to close the modal
      setIsModalOpen(false);
    } catch (error) {
      console.log({ error });
    }
  }

  // Render the modal
  return (
    <Modal
      title="Select Fields for filter"
      className="!rounded-2xl"
      centered
      width={600}
      open={isModalOpen}
      closeIcon={false}
      footer={false}
    >
      <div className="grid grid-cols-2 gap-6 mb-6 mt-4">
        <div>
          <Input
            placeholder="Company Name..."
            onChange={(event) => {
              const value = event.target.value;
              // Update the advanceFilter state with the new company name
              setAdvanceFilter((old) => ({
                ...old,
                companyName: value.trim(),
              }));
            }}
            className="border-2 border-lightBlue focus:outline-none"
          />
        </div>
        <div>
          <Input
            placeholder="Contact Name..."
            onChange={(event) => {
              const value = event.target.value;
              // Update the advanceFilter state with the new contact name
              setAdvanceFilter((old) => ({
                ...old,
                contactName: value.trim(),
              }));
            }}
            className="border-2 border-lightBlue focus:outline-none p-2"
          />
        </div>
        <div>
          <Input
            placeholder="Contact Email..."
            onChange={(event) => {
              const value = event.target.value;
              // Update the advanceFilter state with the new contact email
              setAdvanceFilter((old) => ({
                ...old,
                contactEmail: value.trim(),
              }));
            }}
            className="border-2 border-lightBlue focus:outline-none"
          />
        </div>
        <div>
          <Select
            className="focus:outline-none"
            style={{
              width: "100%",
            }}
            onChange={(value) => {
              // Update the advanceFilter state with the new status
              setAdvanceFilter((old) => ({
                ...old,
                status: value.trim(),
              }));
            }}
            options={[
              {
                value: "ACTIVE",
                label: "Active",
              },
              {
                value: "INACTIVE",
                label: "Disabled",
              },
            ]}
          />
        </div>
      </div>
      <div className="flex justify-end gap-6">
        <Button className="cancel-button" onClick={handleModalCancel}>
          Cancel
        </Button>
        <Button className="apply-button" onClick={handleModalApply}>
          Apply
        </Button>
      </div>
    </Modal>
  );
}

export default ClientFilterModal;
