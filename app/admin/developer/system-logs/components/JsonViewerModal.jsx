"use client";
import React from "react";
import { Button, Modal } from "antd";
import JsonView from "react18-json-view";
import "react18-json-view/src/style.css";
import { FaCode, FaTerminal } from "react-icons/fa";

function JsonViewerModal({ isModalOpen, setIsModalOpen }) {
  const { name, state, record } = isModalOpen;

  const handleClose = () => {
    setIsModalOpen({
      name: null,
      state: false,
      record: null
    });
  };

  const isOpen = (name === "Error Details" || name === "Request Body" || name === "Response Data") && state;

  return (
    <Modal
      title={
        <div className="flex items-center gap-3 px-2 pt-1 uppercase">
          <div className="w-10 h-10 rounded bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400 transition-colors duration-300">
            <FaTerminal size={16} />
          </div>
          <div>
            <span className="text-xl font-bold text-slate-900 dark:text-slate-100 block transition-colors duration-300">{name}</span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-normal">Technical data inspection</span>
          </div>
        </div>
      }
      centered
      width={720}
      open={isOpen}
      onCancel={handleClose}
      footer={null}
      className="modern-modal"
    >
      <div className="p-2 pt-4">
        <div className="bg-slate-900 rounded p-6 border border-slate-800 shadow-xl overflow-hidden">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-800">
            <FaCode className="text-teal-400" size={14} />
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Raw Payload Output</span>
          </div>
          <div className="max-h-[500px] overflow-y-auto custom-scrollbar">
            <JsonView
              src={record}
              theme="dark"
              displayDataTypes={false}
              enableClipboard={true}
              style={{
                backgroundColor: 'transparent',
                fontSize: '13px',
                fontFamily: '"Fira Code", "JetBrains Mono", monospace'
              }}
            />
          </div>
        </div>

        <div className="flex justify-end pt-6 mt-6 border-t border-slate-100 dark:border-slate-800 transition-colors">
          <Button
            onClick={handleClose}
            className="modal-footer-btn-secondary !px-12"
          >
            Close Inspector
          </Button>
        </div>
      </div>
    </Modal>
  );
}

export default JsonViewerModal;
