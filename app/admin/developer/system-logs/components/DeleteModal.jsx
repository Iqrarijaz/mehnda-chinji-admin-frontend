"use client";
import React from "react";
import { useMutation, useQueryClient } from "react-query";
import { toast } from "react-toastify";
import { Button, Modal } from "antd";
import { FaExclamationTriangle, FaTrashAlt, FaTerminal } from "react-icons/fa";

import Loading from "@/animations/homePageLoader";
import { DELETE_SYSTEM_LOG } from "@/app/api/admin/developers/systemLogs";

function DeleteSystemLogsModal({ isModalOpen, setIsModalOpen }) {
  const queryClient = useQueryClient();
  const { record, name, state } = isModalOpen;

  const deleteMutation = useMutation({
    mutationKey: ["deleteMutation"],
    mutationFn: async (values) => {
      return await DELETE_SYSTEM_LOG(values);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(["systemLogsList"]);
      toast.success(data?.message || "Log entry deleted successfully");
      handleClose();
    },
    onError: (error) => {
      toast.error(error?.response?.data?.error || "Failed to delete log entry");
    },
  });

  const handleClose = () => {
    setIsModalOpen({
      name: null,
      state: false,
      record: null,
    });
  };

  const handleDelete = () => {
    deleteMutation.mutate({ _id: record?._id });
  };

  const isOpen = name === "Delete" && state;

  return (
    <Modal
      open={isOpen}
      onCancel={handleClose}
      footer={null}
      centered
      width={440}
      closable={false}
      className="modern-modal"
    >
      <div className="flex flex-col items-center text-center p-4">
        {deleteMutation.status === "loading" && <Loading />}

        {/* Warning Icon */}
        <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center text-red-500 mb-6">
          <FaExclamationTriangle size={36} />
        </div>

        {/* Content */}
        <h2 className="text-2xl font-black text-slate-900 mb-2">Delete Log Entry?</h2>
        <p className="text-slate-500 text-sm leading-relaxed mb-8">
          You are about to permanently delete this system log entry. This action cannot be undone.
        </p>

        {/* Identifier Card */}
        {record?._id && (
          <div className="w-full bg-slate-50 rounded-2xl p-4 border border-slate-100 flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-slate-400 shadow-sm">
              <FaTerminal size={14} />
            </div>
            <div className="text-left overflow-hidden">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-tight">Log Identifier</p>
              <p className="text-sm font-mono text-slate-600 truncate">{record._id}</p>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="w-full space-y-3">
          <Button
            type="primary"
            danger
            onClick={handleDelete}
            loading={deleteMutation.isLoading}
            icon={<FaTrashAlt size={14} />}
            className="modal-footer-btn-danger w-full !h-[52px] !text-base"
          >
            Delete Permanently
          </Button>
          <Button
            type="text"
            onClick={handleClose}
            className="modal-footer-btn-secondary w-full !h-[44px] !border-none hover:!bg-slate-100"
          >
            Keep Log Entry
          </Button>
        </div>
      </div>
    </Modal>
  );
}

export default DeleteSystemLogsModal;
