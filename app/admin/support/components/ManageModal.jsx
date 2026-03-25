import { Modal, Tag, Input, Upload, Divider } from "antd";
import { MessageOutlined } from "@ant-design/icons";
import { FaReply, FaPaperPlane, FaPaperclip, FaClock, FaUser, FaUserTie } from "react-icons/fa";
import { useMutation, useQueryClient } from "react-query";
import { toast } from "react-toastify";
import Loading from "@/animations/homePageLoader";
import SelectBox from "@/components/SelectBox";
import CustomButton from "@/components/shared/CustomButton";
import { FormSkeleton } from "@/components/shared/Skeletons";
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
            title={
                <div className="flex items-center gap-3 px-2">
                    <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center text-[#006666]">
                        <MessageOutlined className="text-lg" />
                    </div>
                    <div>
                        <span className="text-lg font-bold text-slate-900 block">Ticket Management</span>
                        <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="font-mono font-black text-[#006666] text-[10px] tracking-wider bg-[#006666]/5 px-2 py-0.5 rounded border border-[#006666]/10">#{ticket?.ticketId}</span>
                            <span className="text-[11px] text-slate-400 font-normal italic">investigating support request</span>
                        </div>
                    </div>
                </div>
            }
            open={modal.state && modal.name === "Manage"}
            onCancel={closeModal}
            footer={null}
            width={720}
            centered
            className="modern-modal"
        >
            <div className="bg-slate-50/50 p-3 rounded-2xl max-h-[85vh] overflow-y-auto custom-scrollbar border border-slate-100/50 mt-4">
                {/* Info & Status Bar */}
                <div className="bg-white rounded-xl p-3 mb-3 shadow-sm flex items-center justify-between border border-slate-100">
                    <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-800 text-sm capitalize leading-tight">{ticket?.userId?.name}</span>
                            {ticket?.status && getStatusTag(ticket.status)}
                        </div>
                        <span className="text-[10px] text-slate-400 font-medium mt-0.5">{ticket?.userId?.email} | {ticket?.userId?.phoneNumber}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Mark Status:</span>
                        <SelectBox
                            value={ticket?.status}
                            handleChange={(val) => statusMutation.mutate(val)}
                            className="w-32 modern-select-box [&>div]:!h-[32px] [&>div]:!text-xs"
                            options={[
                                { value: "open", label: "Open" },
                                { value: "in-progress", label: "In Progress" },
                                { value: "closed", label: "Closed" },
                            ]}
                        />
                    </div>
                </div>

                {/* Subject & Description */}
                <div className="bg-white rounded-xl p-4 mb-3 shadow-sm border border-slate-100 space-y-2.5">
                    <div>
                        <label className="text-slate-400 font-bold text-[9px] uppercase tracking-widest mb-1 block">Subject Line</label>
                        <div className="text-slate-900 font-bold text-sm leading-tight">{ticket?.subject}</div>
                    </div>
                    <div className="pt-2 border-t border-slate-50">
                        <label className="text-slate-400 font-bold text-[9px] uppercase tracking-widest mb-1 block">Issue Description</label>
                        <div className="text-slate-600 text-[11px] leading-relaxed whitespace-pre-wrap bg-slate-50/50 p-3 rounded-lg border border-slate-100/50 italic font-medium">
                            "{ticket?.description}"
                        </div>
                    </div>
                </div>

                {/* Chat Area */}
                <div className="mb-3 px-1">
                    <label className="text-slate-400 font-bold text-[9px] uppercase tracking-widest mb-2 block">Conversation Log</label>
                    <div
                        ref={scrollRef}
                        className="space-y-3 max-h-[35vh] overflow-y-auto p-1 scroll-smooth"
                    >
                        {!ticket ? (
                            <div className="bg-white rounded-xl p-6 border border-slate-100">
                                <FormSkeleton fields={4} />
                            </div>
                        ) : (
                            ticket.messages?.map((msg, i) => (
                                <div key={i} className={`flex ${msg.sender === 'admin' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[85%] rounded-2xl p-3 shadow-sm ${msg.sender === 'admin' ? 'bg-[#006666] text-white' : 'bg-white border border-slate-100 text-slate-700'}`}>
                                        <div className={`flex items-center gap-2 mb-1.5 border-b pb-1 ${msg.sender === 'admin' ? 'border-white/10' : 'border-slate-50'}`}>
                                            {msg.sender === 'admin' ? <FaUserTie size={10} className="text-teal-200" /> : <FaUser size={10} className="text-emerald-500" />}
                                            <span className={`text-[9px] uppercase font-black tracking-tight ${msg.sender === 'admin' ? 'text-teal-50' : 'text-slate-400'}`}>
                                                {msg.sender === 'admin' ? 'Support Agent' : 'User'}
                                            </span>
                                            <span className={`text-[9px] ml-auto flex items-center gap-1 opacity-60 ${msg.sender === 'admin' ? 'text-teal-50' : 'text-slate-300'}`}>
                                                <FaClock size={8} /> {timestampToDate(msg.createdAt)}
                                            </span>
                                        </div>
                                        <p className="text-[11px] leading-relaxed whitespace-pre-wrap font-medium">{msg.message}</p>

                                        {msg.attachments?.length > 0 && (
                                            <div className="mt-2 flex flex-wrap gap-1.5">
                                                {msg.attachments.map((url, j) => (
                                                    <a key={j} href={url} target="_blank" rel="noreferrer" className="block relative group">
                                                        <img src={url} alt="attachment" className="w-16 h-16 object-cover rounded-lg border border-white/20 hover:scale-105 transition-transform" />
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
                    <div className="bg-white rounded-xl p-3 shadow-sm border border-slate-100">
                        <label className="text-slate-400 font-bold text-[9px] uppercase tracking-widest mb-1.5 block">Compose Response</label>
                        <TextArea
                            value={reply}
                            onChange={(e) => setReply(e.target.value)}
                            placeholder="Type a message to the user..."
                            autoSize={{ minRows: 2, maxRows: 4 }}
                            className="mb-2 !text-xs !bg-slate-50/50 !border-slate-100 focus:!border-[#006666] !rounded-lg"
                        />
                        <div className="flex justify-between items-center">
                            <Upload
                                fileList={fileList}
                                onChange={({ fileList }) => setFileList(fileList)}
                                beforeUpload={() => false}
                                multiple
                            >
                                <CustomButton
                                    label="Attach"
                                    type="secondary"
                                    icon={<FaPaperclip size={10} />}
                                    className="!h-[32px] !text-[11px] !px-3"
                                />
                            </Upload>
                            <CustomButton
                                label="Send Response"
                                icon={<FaPaperPlane size={10} />}
                                onClick={handleSend}
                                loading={replyMutation.isLoading}
                                className="!h-[32px] !px-5"
                                disabled={!reply.trim() && fileList.length === 0}
                            />
                        </div>
                    </div>
                )}
            </div>

            <div className="flex justify-end pt-4 mt-1">
                <CustomButton
                    label="Close"
                    type="secondary"
                    onClick={closeModal}
                    className="!h-[32px]"
                />
            </div>
        </Modal>
    );
}

export default ManageTicketModal;
