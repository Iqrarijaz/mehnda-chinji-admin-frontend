"use client";
import { Modal, Tag, Divider } from "antd";
import { UserOutlined, MailOutlined, GlobalOutlined, ClockCircleOutlined, InfoCircleOutlined } from "@ant-design/icons";
import { useMutation, useQueryClient } from "react-query";
import { toast } from "react-toastify";
import SelectBox from "@/components/SelectBox";
import CustomButton from "@/components/shared/CustomButton";
import { UPDATE_CONTACT_REQUEST_STATUS } from "@/app/api/admin/contact-us";
import { timestampToDate } from "@/utils/date";

function ContactUsDetailModal({ modal, setModal }) {
    const queryClient = useQueryClient();
    const contact = modal.data;

    const closeModal = () => {
        setModal({ ...modal, state: false, data: null });
    };

    const statusMutation = useMutation({
        mutationFn: async (status) => {
            return await UPDATE_CONTACT_REQUEST_STATUS(contact._id, status);
        },
        onSuccess: () => {
            toast.success("Status updated successfully");
            queryClient.invalidateQueries("contactRequests");
            setModal(prev => ({ ...prev, data: { ...prev.data, status: statusMutation.variables } }));
        },
        onError: (error) => {
            toast.error(error?.response?.data?.message || "Failed to update status");
        },
    });

    const getStatusColor = (status) => {
        switch (status) {
            case "PENDING": return "orange";
            case "REVIEWED": return "blue";
            case "RESOLVED": return "green";
            default: return "default";
        }
    };

    return (
        <Modal
            title={
                <div className="flex items-center gap-3 px-2">
                    <div className="w-10 h-10 rounded bg-teal-50 dark:bg-teal-900/20 flex items-center justify-center text-[#006666] dark:text-teal-400 transition-colors duration-300">
                        <InfoCircleOutlined className="text-xl" />
                    </div>
                    <div>
                        <span className="text-lg font-bold text-[#006666] dark:text-teal-500 block transition-colors duration-300">Contact Request Details</span>
                        <div className="flex items-center gap-1.5 mt-0.5 transition-colors duration-300">
                            <span className="font-mono font-black text-[#006666] dark:text-teal-500 text-[10px] tracking-wider bg-[#006666]/5 dark:bg-teal-500/10 px-2 py-0.5 rounded border border-[#006666]/10 dark:border-teal-500/20 transition-colors duration-300">#{contact?.requestId}</span>
                            <span className="text-[11px] text-slate-400 dark:text-slate-500 font-normal italic">reviewing user message</span>
                        </div>
                    </div>
                </div>
            }
            open={modal.state && modal.name === "ViewDetails"}
            onCancel={closeModal}
            footer={null}
            width={800}
            centered
            className="modern-modal"
        >
            <div className="bg-slate-50/50 dark:bg-slate-900/40 p-4 rounded border border-slate-100/50 dark:border-slate-800/50 mt-4 max-h-[80vh] overflow-y-auto custom-scrollbar transition-colors duration-300">
                {/* Status & Source Bar */}
                <div className="bg-white dark:bg-[#1E293B] rounded p-4 mb-4 shadow-sm flex items-center justify-between border border-slate-100 dark:border-slate-800 transition-colors duration-300">
                    <div className="flex items-center gap-3">
                        <Tag color={getStatusColor(contact?.status)} className="m-0 font-bold px-2 py-0.5 rounded-full uppercase text-[10px]">
                            {contact?.status}
                        </Tag>
                        <Tag color={contact?.source === "app" ? "purple" : "cyan"} className="m-0 font-bold px-2 py-0.5 rounded-full uppercase text-[10px]">
                            {contact?.source} source
                        </Tag>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Update Status:</span>
                        <SelectBox
                            value={contact?.status}
                            handleChange={(val) => statusMutation.mutate(val)}
                            className="w-32 modern-select-box [&>div]:!h-[32px] [&>div]:!text-xs"
                            options={[
                                { value: "PENDING", label: "Pending" },
                                { value: "REVIEWED", label: "Reviewed" },
                                { value: "RESOLVED", label: "Resolved" },
                            ]}
                        />
                    </div>
                </div>

                {/* Sender Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="bg-white dark:bg-[#1E293B] rounded p-4 shadow-sm border border-slate-100 dark:border-slate-800 transition-colors duration-300">
                        <label className="text-slate-400 dark:text-slate-500 font-bold text-[9px] uppercase tracking-widest mb-1.5 block">Sender Name</label>
                        <div className="flex items-center gap-2">
                            <UserOutlined className="text-slate-400 dark:text-slate-500" />
                            <span className="text-slate-900 dark:text-slate-100 font-bold text-sm truncate">{contact?.name}</span>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-[#1E293B] rounded-xl p-4 shadow-sm border border-slate-100 dark:border-slate-800 transition-colors duration-300">
                        <label className="text-slate-400 dark:text-slate-500 font-bold text-[9px] uppercase tracking-widest mb-1.5 block">Email Address</label>
                        <div className="flex items-center gap-2">
                            <MailOutlined className="text-slate-400 dark:text-slate-500" />
                            <span className="text-slate-900 dark:text-slate-100 font-bold text-sm truncate">{contact?.email}</span>
                        </div>
                    </div>
                </div>

                {/* Message Content */}
                <div className="bg-white dark:bg-[#1E293B] rounded p-4 mb-4 shadow-sm border border-slate-100 dark:border-slate-800 transition-colors duration-300">
                    <label className="text-slate-400 dark:text-slate-500 font-bold text-[9px] uppercase tracking-widest mb-2 block transition-colors duration-300">Message Description</label>
                    <div className="text-slate-600 dark:text-slate-400 text-[13px] leading-relaxed whitespace-pre-wrap bg-slate-50/50 dark:bg-slate-900/30 p-4 rounded border border-slate-100/50 dark:border-slate-800/50 italic font-medium min-h-[120px] transition-colors duration-300">
                        "{contact?.description}"
                    </div>
                </div>

                {/* Footer Metadata */}
                <div className="flex items-center justify-center gap-4 text-slate-400 text-[11px] font-medium">
                    <div className="flex items-center gap-1.5">
                        <ClockCircleOutlined />
                        <span>Received on {timestampToDate(contact?.createdAt)}</span>
                    </div>
                </div>
            </div>

            <div className="flex justify-end pt-5 mt-2">
                <CustomButton
                    label="Close"
                    type="secondary"
                    onClick={closeModal}
                    className="!h-[36px] !px-6"
                />
            </div>
        </Modal>
    );
}

export default ContactUsDetailModal;
