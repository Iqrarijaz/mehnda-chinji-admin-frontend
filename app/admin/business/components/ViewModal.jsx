import React from "react";
import { Modal, Descriptions, Tag, Divider, Avatar } from "antd";
import { 
    FaInfoCircle, 
    FaMapMarkerAlt, 
    FaPhoneAlt, 
    FaCalendarAlt,
    FaTag,
    FaStore
} from "react-icons/fa";
import { timestampToDate } from "@/utils/date";
import CustomButton from "@/components/shared/CustomButton";

function ViewModal({ open, onCancel, data }) {
    if (!data) return null;

    const statusColors = {
        APPROVED: "green",
        PENDING: "orange",
        REJECTED: "red",
    };

    return (
        <Modal
            title={
                <div className="flex items-center gap-2 px-0 py-1">
                    <div className="w-8 h-8 rounded-lg bg-teal-50 flex items-center justify-center text-teal-600">
                        <FaInfoCircle size={16} />
                    </div>
                    <div>
                        <span className="text-lg font-bold text-teal-700 block mt-1">Business Details</span>
                    </div>
                </div>
            }
            open={open}
            onCancel={onCancel}
            footer={
                <CustomButton label="Close" type="secondary" onClick={onCancel} className="!h-[32px] !text-xs" />
            }
            width={700}
            className="modern-modal"
        >
            <div className="flex flex-col gap-4">
                {/* Header Section */}
                <div className="flex items-center gap-3 p-2 bg-slate-50/50 rounded-lg border border-slate-100">
                    <div className="w-9 h-9 rounded-lg bg-teal-600 flex items-center justify-center text-white flex-shrink-0">
                        <FaStore size={16} />
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                            <h2 className="text-[13px] font-bold text-slate-800 truncate m-0">{data.name}</h2>
                            <Tag color={data.status === "APPROVED" || data.status === "ACTIVE" ? "success" : data.status === "PENDING" ? "warning" : "error"} className="m-0 font-bold px-1.5 py-0 rounded-md uppercase text-[8px] border-none">
                                {data.status}
                            </Tag>
                        </div>
                        <p className="text-slate-400 text-[9px] font-bold flex items-center gap-1 mt-0.5 m-0 uppercase tracking-widest">
                             {data.categoryEn || "No Category"}
                        </p>
                    </div>
                </div>

                {/* Details Grid */}
                <Descriptions 
                    bordered 
                    column={1} 
                    size="small" 
                    className="details-description compact-descriptions"
                    labelStyle={{ width: '130px', fontWeight: 'bold', color: '#64748b', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.025em' }}
                    contentStyle={{ fontSize: '12px', color: '#334155', fontWeight: '500' }}
                >
                    <Descriptions.Item label="Contact Phone">
                        <span className="flex items-center gap-2">
                            <FaPhoneAlt size={10} className="text-teal-500" /> {data.phone || "N/A"}
                        </span>
                    </Descriptions.Item>
                    <Descriptions.Item label="Address">
                        <span className="flex items-start gap-2">
                            <FaMapMarkerAlt size={10} className="text-[#006666] mt-0.5" /> {data.address || "N/A"}
                        </span>
                    </Descriptions.Item>
                    <Descriptions.Item label="Registered">
                        <span className="flex items-center gap-2">
                            <FaCalendarAlt size={10} className="text-orange-500" /> {timestampToDate(data.createdAt)}
                        </span>
                    </Descriptions.Item>
                </Descriptions>

                {/* Additional Info */}
                <div className="p-2.5 bg-teal-50/50 rounded-lg border border-teal-100/30">
                    <h3 className="text-[9px] font-black text-teal-700 uppercase tracking-widest mb-2">Technical Registry</h3>
                    <div className="grid grid-cols-2 gap-3 text-[10px]">
                        <div>
                            <span className="text-slate-400 font-bold uppercase text-[8px] block mb-0.5">Record ID</span>
                            <span className="text-slate-600 font-mono tracking-tighter">{data._id}</span>
                        </div>
                        <div>
                            <span className="text-slate-400 font-bold uppercase text-[8px] block mb-0.5">Admin Email</span>
                            <span className="text-slate-600 truncate block">{data.adminEmail || "N/A"}</span>
                        </div>
                    </div>
                </div>
            </div>
        </Modal>
    );
}

export default ViewModal;
