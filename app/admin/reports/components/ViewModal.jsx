import { Modal, Tag, Divider } from "antd";
import { FaFlag, FaUser, FaBullseye, FaInfoCircle, FaCalendarAlt, FaShieldAlt } from "react-icons/fa";
import CustomButton from "@/components/shared/CustomButton";

function ViewModal({ viewModal, setViewModal }) {
    const { open, data } = viewModal;

    const handleClose = () => {
        setViewModal({ open: false, data: null });
    };

    return (
        <Modal
            title={
                <div className="flex items-center gap-3 px-2">
                    <div className="w-10 h-10 rounded bg-red-50 flex items-center justify-center text-red-600">
                        <FaFlag size={18} />
                    </div>
                    <div>
                        <span className="text-lg font-bold text-slate-900 block">Report Investigation</span>
                        <span className="text-xs text-slate-500 font-normal">Review user-submitted report details</span>
                    </div>
                </div>
            }
            open={open}
            onCancel={handleClose}
            footer={null}
            width={600}
            centered
            className="modern-modal"
        >
            <div className="p-1">
                {data && (
                    <div className="space-y-4">
                        {/* Status Card */}
                        <div className="flex items-center justify-between p-3 bg-slate-50/50 rounded border border-slate-100/50">
                            <div className="flex items-center gap-2">
                                <FaShieldAlt className="text-slate-400" size={14} />
                                <span className="text-[10px] font-bold text-slate-600 uppercase tracking-tight">Resolution Status</span>
                            </div>
                            <Tag
                                color={data.status === 'RESOLVED' ? 'green' : data.status === 'REVIEWED' ? 'blue' : 'orange'}
                                className="rounded-full px-4 py-0 border-none font-bold text-[9px] uppercase tracking-widest m-0 shadow-sm"
                            >
                                {data.status || "PENDING"}
                            </Tag>
                        </div>

                        {/* Reason & Content Section */}
                        <div className="bg-white p-4 rounded border border-slate-100 space-y-3">
                            <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Primary Violation</p>
                                <h3 className="text-base font-bold text-slate-900">{data.reason}</h3>
                            </div>

                            {data.description && (
                                <div className="pt-2 border-t border-slate-50">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Detailed Description</p>
                                    <p className="text-slate-700 text-xs leading-relaxed whitespace-pre-wrap bg-slate-50/50 p-3 rounded border border-slate-100/50 italic">
                                        "{data.description}"
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Entities Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {/* Reporter Card */}
                            <div className="p-4 bg-white rounded border border-slate-100">
                                <div className="flex items-center gap-2 mb-3 text-emerald-600">
                                    <FaUser size={10} />
                                    <span className="text-[9px] font-bold uppercase tracking-widest">Reporter Info</span>
                                </div>
                                <div className="space-y-0.5">
                                    <p className="text-sm font-bold text-slate-900">
                                        {data.reporter ? `${data.reporter.firstName} ${data.reporter.lastName}` : "Anonymous User"}
                                    </p>
                                    <p className="text-[11px] text-slate-500 font-medium">{data.reporter?.phone || "Phone unavailable"}</p>
                                    <p className="text-[11px] text-slate-400 truncate">{data.reporter?.email || "Email unavailable"}</p>
                                </div>
                            </div>

                            {/* Target Card */}
                            <div className="p-4 bg-white rounded border border-slate-100">
                                <div className="flex items-center gap-2 mb-3 text-blue-600">
                                    <FaBullseye size={10} />
                                    <span className="text-[9px] font-bold uppercase tracking-widest">Target Content</span>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <p className="text-[9px] font-bold text-slate-400 uppercase">Type</p>
                                        <Tag color={data.targetType === 'BUSINESS' ? 'blue' : 'green'} className="rounded font-bold border-none m-0 text-[9px] px-2 shadow-sm">
                                            {data.targetType}
                                        </Tag>
                                    </div>
                                    <div>
                                        <p className="text-[9px] font-bold text-slate-400 uppercase mb-1">Target ID</p>
                                        <p className="text-[10px] font-mono text-slate-500 break-all bg-slate-50 p-2 rounded border border-slate-100">
                                            {data.targetId}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Metadata Footer */}
                        <div className="flex items-center justify-between px-1 pt-2 text-[9px] font-bold text-slate-400 uppercase tracking-tight opacity-70">
                            <div className="flex items-center gap-1.5">
                                <FaCalendarAlt size={9} />
                                Filed: {new Date(data.createdAt).toLocaleString()}
                            </div>
                            <div className="flex items-center gap-1.5">
                                <FaInfoCircle size={9} />
                                Ref: {data._id}
                            </div>
                        </div>
                    </div>
                )}
            </div>
            <div className="flex justify-end pt-4 mt-4 border-t border-slate-100">
                <CustomButton
                    label="Close"
                    type="secondary"
                    onClick={handleClose}
                    className="!h-[32px]"
                />
            </div>
        </Modal>
    );
}

export default ViewModal;
