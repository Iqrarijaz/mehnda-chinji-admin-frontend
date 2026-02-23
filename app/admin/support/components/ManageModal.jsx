"use client";
import React, { useState, useEffect, useRef } from "react";
import { Modal, Tag, Button, Input, Upload, Divider, Select } from "antd";
import { FaReply, FaPaperPlane, FaPaperclip, FaClock, FaUser, FaUserTie } from "react-icons/fa";
import { useMutation, useQueryClient } from "react-query";
import { toast } from "react-toastify";
import { GET_SUPPORT_TICKET_BY_ID, REPLY_TO_TICKET, UPDATE_TICKET_STATUS } from "@/app/api/admin/support";
import { timestampToDate } from "@/utils/date";

const { TextArea } = Input;

function ManageTicketModal({ modal, setModal }) {
    const queryClient = useQueryClient();
    const [ticket, setTicket] = useState(null);
    const [loading, setLoading] = useState(false);
    const [reply, setReply] = useState("");
    const [fileList, setFileList] = useState([]);
    const scrollRef = useRef(null);

    const closeModal = () => {
        setModal({ ...modal, state: false });
        setTicket(null);
        setReply("");
        setFileList([]);
    };

    const fetchTicket = async () => {
        if (modal.data?._id) {
            setLoading(true);
            try {
                const res = await GET_SUPPORT_TICKET_BY_ID(modal.data._id);
                setTicket(res.data);
            } catch (error) {
                toast.error("Failed to fetch ticket details.");
            } finally {
                setLoading(false);
            }
        }
    };

    useEffect(() => {
        if (modal.state && modal.name === "Manage") {
            fetchTicket();
        }
    }, [modal.state, modal.name]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [ticket]);

    const replyMutation = useMutation({
        mutationFn: async (formData) => {
            return await REPLY_TO_TICKET(ticket._id, formData);
        },
        onSuccess: (data) => {
            toast.success("Reply sent successfully");
            setReply("");
            setFileList([]);
            fetchTicket();
            queryClient.invalidateQueries("ticketsList");
        },
        onError: (error) => {
            toast.error(error?.response?.data?.message || "Failed to send reply");
        },
    });

    const statusMutation = useMutation({
        mutationFn: async (status) => {
            return await UPDATE_TICKET_STATUS(ticket._id, status);
        },
        onSuccess: (data) => {
            toast.success("Status updated successfully");
            fetchTicket();
            queryClient.invalidateQueries("ticketsList");
        },
        onError: (error) => {
            toast.error(error?.response?.data?.message || "Failed to update status");
        },
    });

    const handleSend = () => {
        if (!reply.trim() && fileList.length === 0) return;

        const formData = new FormData();
        formData.append("message", reply);
        fileList.forEach((file) => {
            formData.append("attachments", file.originFileObj);
        });

        replyMutation.mutate(formData);
    };

    const getStatusTag = (status) => {
        const colors = {
            "open": "#f97316", // orange-500
            "in-progress": "#3b82f6", // blue-500
            "closed": "#22c55e", // green-500
        };
        return (
            <span
                className="mr-0 text-[10px] px-2 py-1 rounded capitalize font-semibold text-white inline-block"
                style={{ backgroundColor: colors[status] || "#94a3b8" }}
            >
                {status?.replace("-", " ")}
            </span>
        );
    };

    return (
        <Modal
            title={<div className="flex items-center gap-2"><span>Ticket Management</span> <span className="text-primary font-mono text-sm underline">{ticket?.ticketId}</span></div>}
            open={modal.state && modal.name === "Manage"}
            onCancel={closeModal}
            footer={null}
            width={800}
            centered
            className="!rounded"
        >
            <div className="bg-gray-100 p-4 rounded max-h-[80vh] overflow-y-auto custom-scrollbar">
                {/* Info & Status Bar */}
                <div className="bg-white rounded-lg p-4 mb-4 shadow-sm flex justify-between items-center border border-gray-200">
                    <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2 font-semibold text-gray-800">
                            <span>{ticket?.userId?.name}</span>
                            {ticket?.status && getStatusTag(ticket.status)}
                        </div>
                        <span className="text-xs text-gray-500 font-medium">{ticket?.userId?.email} | {ticket?.userId?.phoneNumber}</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Status:</span>
                        <Select
                            value={ticket?.status}
                            onChange={(val) => statusMutation.mutate(val)}
                            className="w-32 border-primary"
                            options={[
                                { value: "open", label: "Open" },
                                { value: "in-progress", label: "In Progress" },
                                { value: "closed", label: "Closed" },
                            ]}
                        />
                    </div>
                </div>

                {/* Subject & Description - NEW SECTION */}
                <div className="bg-white rounded-lg p-4 mb-4 shadow-sm border border-gray-200">
                    <div className="mb-3">
                        <label className="text-black font-bold text-xs uppercase tracking-widest mb-1 block">Subject</label>
                        <div className="text-gray-800 font-semibold text-lg">{ticket?.subject}</div>
                    </div>
                    <div>
                        <label className="text-black font-bold text-xs uppercase tracking-widest mb-1 block">Description</label>
                        <div className="text-gray-600 text-sm whitespace-pre-wrap bg-gray-50 p-3 rounded border border-gray-100">
                            {ticket?.description}
                        </div>
                    </div>
                </div>

                {/* Chat Area */}
                <div className="mb-4">
                    <label className="text-black font-bold text-xs uppercase tracking-widest mb-2 block px-2">Conversation History</label>
                    <div
                        ref={scrollRef}
                        className="space-y-4 max-h-[40vh] overflow-y-auto p-2 scroll-smooth"
                    >
                        {!ticket ? (
                            <div className="flex justify-center items-center py-10 text-gray-400 italic">Loading thread...</div>
                        ) : (
                            ticket.messages?.map((msg, i) => (
                                <div key={i} className={`flex ${msg.sender === 'admin' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[85%] rounded-2xl p-4 shadow-sm ${msg.sender === 'admin' ? 'bg-[#0F172A] text-white' : 'bg-white border text-gray-800'}`}>
                                        <div className="flex items-center gap-2 mb-2 border-b border-white/10 pb-1">
                                            {msg.sender === 'admin' ? <FaUserTie size={12} className="text-blue-400" /> : <FaUser size={12} className="text-primary" />}
                                            <span className="text-[10px] uppercase font-black tracking-tighter opacity-70">{msg.sender}</span>
                                            <span className="text-[10px] opacity-50 ml-auto flex items-center gap-1"><FaClock size={8} /> {timestampToDate(msg.createdAt)}</span>
                                        </div>
                                        <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.message}</p>

                                        {msg.attachments?.length > 0 && (
                                            <div className="mt-3 flex flex-wrap gap-2">
                                                {msg.attachments.map((url, j) => (
                                                    <a key={j} href={url} target="_blank" rel="noreferrer" className="block relative group">
                                                        <img src={url} alt="attachment" className="w-20 h-20 object-cover rounded-lg border-2 border-white/20 hover:scale-105 transition-transform" />
                                                    </a>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Input Area */}
                {ticket?.status !== "closed" && (
                    <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                        <label className="text-black font-bold text-xs uppercase tracking-widest mb-2 block">Your Response</label>
                        <TextArea
                            value={reply}
                            onChange={(e) => setReply(e.target.value)}
                            placeholder="Type a message to the user..."
                            autoSize={{ minRows: 2, maxRows: 4 }}
                            className="mb-3 border-gray-200 focus:border-primary !rounded"
                        />
                        <div className="flex justify-between items-center">
                            <Upload
                                fileList={fileList}
                                onChange={({ fileList }) => setFileList(fileList)}
                                beforeUpload={() => false}
                                multiple
                            >
                                <Button icon={<FaPaperclip />} className="reset-button text-xs">Attach Files</Button>
                            </Upload>
                            <Button
                                type="primary"
                                icon={<FaPaperPlane />}
                                onClick={handleSend}
                                loading={replyMutation.isLoading}
                                className="!h-10 px-6 bg-primary hover:bg-slate-800 border-none rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex items-center gap-2 font-semibold text-sm"
                                disabled={!reply.trim() && fileList.length === 0}
                            >
                                Send Response
                            </Button>
                        </div>
                    </div>
                )}
            </div>

            {/* Modal Footer (matching roles style cancel button) */}
            <div className="flex justify-end mt-4">
                <Button onClick={closeModal} className="modal-cancel-button">
                    Close
                </Button>
            </div>
        </Modal>
    );
}

export default ManageTicketModal;
