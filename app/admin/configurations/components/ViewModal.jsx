import { Modal, Tag, Divider } from "antd";
import { FaCogs, FaCode, FaCalendarAlt, FaShieldAlt, FaInfoCircle, FaFileCode } from "react-icons/fa";
import CustomButton from "@/components/shared/CustomButton";

function ViewConfigurationModal({ modal, setModal }) {
    const data = modal.data || {};

    const handleClose = () => {
        setModal({ name: null, state: false, data: null });
    };

    const isOpen = modal.name === "View" && modal.state;

    return (
        <Modal
            title={
                <div className="flex items-center gap-2 px-0 py-1">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                        <FaFileCode size={16} />
                    </div>
                    <div>
                        <span className="text-lg font-bold text-blue-700 block mt-1">Configuration Detail</span>
                    </div>
                </div>
            }
            open={isOpen}
            onCancel={handleClose}
            footer={
                <CustomButton label="Close Details" type="secondary" onClick={handleClose} className="w-full" />
            }
            centered
            width={720}
            >
            <div className="p-1">
                <div className="space-y-4">
                    {/* Status & Metadata Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="p-3 bg-slate-50/50 rounded-lg border border-slate-100 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <FaShieldAlt className="text-slate-400" size={14} />
                                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-tight">System Status</span>
                            </div>
                            <Tag
                                color={data.isActive ? "success" : "error"}
                                className="rounded-md px-2 py-0 border-none font-black text-[9px] uppercase tracking-widest m-0"
                            >
                                {data.isActive ? "ACTIVE" : "INACTIVE"}
                            </Tag>
                        </div>

                        <div className="p-3 bg-white rounded-lg border border-slate-100 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <FaCogs className="text-slate-400" size={14} />
                                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-tight">Config Type</span>
                            </div>
                            <Tag color="blue" className="rounded font-bold border-none m-0 text-[10px]">
                                {data.type || "GENERIC"}
                            </Tag>
                        </div>
                    </div>

                    {/* Timeline Data */}
                    <div className="bg-white p-3 rounded-lg border border-slate-100 grid grid-cols-2 gap-3">
                        <div className="text-center">
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1 leading-none">Creation Date</p>
                            <div className="flex items-center justify-center gap-1.5 text-slate-600 font-medium text-[11px]">
                                <FaCalendarAlt size={9} className="text-teal-500" />
                                {data.createdAt ? new Date(data.createdAt).toLocaleString() : "N/A"}
                            </div>
                        </div>
                        <div className="border-l border-slate-100 text-center">
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1 leading-none">Last Modified</p>
                            <div className="flex items-center justify-center gap-1.5 text-slate-600 font-medium text-[11px]">
                                <FaCalendarAlt size={9} className="text-orange-500" />
                                {data.updatedAt ? new Date(data.updatedAt).toLocaleString() : "N/A"}
                            </div>
                        </div>
                    </div>

                    {/* JSON Payload Display */}
                    <div className="bg-slate-900 rounded-lg p-4 border border-slate-800 shadow-sm overflow-hidden">
                        <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-800/50">
                            <FaCode className="text-teal-400" size={12} />
                            <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Active JSON Payload</span>
                        </div>
                        <div className="max-h-[300px] overflow-y-auto custom-scrollbar">
                            <pre className="text-teal-50 font-mono text-[11px] leading-relaxed">
                                {JSON.stringify(data.data, null, 2)}
                            </pre>
                        </div>
                    </div>

                    {/* Footer Info */}
                    <div className="flex items-center justify-center gap-2 text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                        <FaInfoCircle size={9} />
                        Object Hash: {data._id}
                    </div>
                </div>
            </div>
        </Modal>
    );
}

export default ViewConfigurationModal;
