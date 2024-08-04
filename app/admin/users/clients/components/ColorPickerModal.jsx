import { Button, Modal } from "antd";
import React from "react";
import { SketchPicker } from "react-color";

function ColorPickerModal({
  isModalOpen,
  setIsModalOpen,
  handlePrimaryColorChange,
  handleSecondaryColorChange,
}) {
  return (
    <Modal
      className="!rounded-2xl flex flex-col justify-center"
      centered
      width={300}
      open={isModalOpen?.state}
      closeIcon={false}
      footer={false}
    >
      <div className="flex justify-center items-center w-full p-4 mb-4">
        <SketchPicker
          color={isModalOpen?.colorCode}
          onChange={({ hex }) => {
            setIsModalOpen({ ...isModalOpen, colorCode: hex });
            if (isModalOpen?.type === "primary") {
              handlePrimaryColorChange(hex);
            } else {
              handleSecondaryColorChange(hex);
            }
          }}
        />
      </div>

      <div className="flex justify-center gap-4">
        <Button
          className="cancel-button"
          onClick={() => setIsModalOpen((prev) => ({ ...prev, state: false }))}
        >
          Cancel
        </Button>
        <Button
          className="apply-button"
          onClick={() => setIsModalOpen((prev) => ({ ...prev, state: false }))}
        >
          Apply
        </Button>
      </div>
    </Modal>
  );
}

export default ColorPickerModal;
