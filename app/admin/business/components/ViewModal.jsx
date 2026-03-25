import React from "react";
import { Modal, Descriptions, Tag, Divider, Avatar } from "antd";
import { 
    ShopOutlined, 
    EnvironmentOutlined, 
    PhoneOutlined, 
    CalendarOutlined,
    TagOutlined
} from "@ant-design/icons";
import { timestampToDate } from "@/utils/date";

function ViewModal({ open, onCancel, data }) {
    if (!data) return null;

    const statusColors = {
        APPROVED: "green",
        PENDING: "orange",
        REJECTED: "red",
    };

    return (
        <Modal
            title={<span className="text-xl font-bold text-[#006666]">Business Details</span>}
            open={open}
            onCancel={onCancel}
            footer={null}
            width={700}
            className="modern-modal"
        >
            <div className="flex flex-col gap-6">
                {/* Header Section */}
                <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <Avatar 
                        size={64} 
                        icon={<ShopOutlined />} 
                        className="bg-[#006666] flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                            <h2 className="text-lg font-bold text-slate-800 truncate m-0">{data.name}</h2>
                            <Tag color={statusColors[data.status]} className="m-0 font-bold px-3 py-0.5 rounded-full uppercase text-[10px]">
                                {data.status}
                            </Tag>
                        </div>
                        <p className="text-slate-500 text-sm flex items-center gap-1.5 mt-1 m-0">
                            <TagOutlined className="text-[#006666]" /> {data.categoryEn || "No Category"}
                        </p>
                    </div>
                </div>

                {/* Details Grid */}
                <Descriptions 
                    bordered 
                    column={1} 
                    size="small" 
                    className="details-description"
                    labelStyle={{ width: '150px', fontWeight: '600', color: '#64748b' }}
                >
                    <Descriptions.Item label="Contact Number">
                        <span className="flex items-center gap-2 text-slate-700">
                            <PhoneOutlined className="text-emerald-500" /> {data.phone || "N/A"}
                        </span>
                    </Descriptions.Item>
                    <Descriptions.Item label="Address">
                        <span className="flex items-start gap-2 text-slate-700 leading-relaxed">
                            <EnvironmentOutlined className="text-blue-500 mt-1" /> {data.address || "N/A"}
                        </span>
                    </Descriptions.Item>
                    <Descriptions.Item label="Registered Date">
                        <span className="flex items-center gap-2 text-slate-600">
                            <CalendarOutlined className="text-orange-500" /> {timestampToDate(data.createdAt)}
                        </span>
                    </Descriptions.Item>
                </Descriptions>

                {/* Additional Info if needed */}
                <div className="p-4 bg-teal-50/50 rounded-lg border border-teal-100/50">
                    <h3 className="text-xs font-bold text-[#006666] uppercase tracking-wider mb-2">Internal Information</h3>
                    <div className="grid grid-cols-2 gap-4 text-xs">
                        <div>
                            <span className="text-slate-400 block mb-0.5">Business ID</span>
                            <span className="text-slate-600 font-mono font-medium">{data._id}</span>
                        </div>
                        <div>
                            <span className="text-slate-400 block mb-0.5">Admin Email</span>
                            <span className="text-slate-600 font-medium">{data.adminEmail || "N/A"}</span>
                        </div>
                    </div>
                </div>
            </div>
        </Modal>
    );
}

export default ViewModal;
