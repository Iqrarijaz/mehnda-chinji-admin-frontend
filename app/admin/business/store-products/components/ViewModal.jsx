import React from "react";
import { Modal, Descriptions, Tag, Avatar } from "antd";
import { FaInfoCircle, FaTag, FaBoxOpen } from "react-icons/fa";
import CustomButton from "@/components/shared/CustomButton";

const ViewProductModal = React.memo(({ open, onCancel, data }) => {
    if (!data) return null;

    const colors = {
        ACTIVE: "success",
        OUT_OF_STOCK: "error",
        DRAFT: "default",
        ARCHIVED: "warning",
    };

    const primaryImg = data.images?.find(img => img.isPrimary)?.url || "";
    const remainingImgs = data.images?.filter(img => !img.isPrimary) || [];

    return (
        <Modal
            title={
                <div className="flex items-center gap-2 px-0 py-1">
                    <div className="w-8 h-8 rounded bg-teal-50 flex items-center justify-center text-teal-600">
                        <FaInfoCircle size={16} />
                    </div>
                    <div>
                        <span className="text-lg font-bold text-teal-700 block mt-1">Product Details</span>
                    </div>
                </div>
            }
            open={open}
            onCancel={onCancel}
            footer={
                <CustomButton label="Close" type="secondary" onClick={onCancel} className="!h-[32px] !text-xs" />
            }
            width={650}
            className="modern-modal"
        >
            <div className="flex flex-col gap-4">
                {/* Header Section */}
                <div className="flex items-center gap-3 p-2 bg-slate-50/50 rounded border border-slate-100">
                    <Avatar
                        shape="square"
                        size={50}
                        src={primaryImg}
                        icon={!primaryImg && "🏪"}
                        className="bg-teal-600 border border-slate-100 flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                            <h2 className="text-[13px] font-bold text-slate-800 truncate m-0 capitalize">{data.name}</h2>
                            <Tag color={colors[data.status] || "default"} className="m-0 font-bold px-1.5 py-0.5 rounded uppercase text-[8px] border-none">
                                {data.status}
                            </Tag>
                        </div>
                        <p className="text-slate-400 text-[9px] font-bold flex items-center gap-1 mt-0.5 m-0 uppercase tracking-widest">
                             Category: {data.categoryId?.name || "Uncategorized"}
                        </p>
                    </div>
                </div>

                {/* Details Grid */}
                <Descriptions 
                    bordered 
                    column={1} 
                    size="small" 
                    className="details-description compact-descriptions"
                    labelStyle={{ width: '150px', fontWeight: 'bold', color: '#64748b', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.025em' }}
                    contentStyle={{ fontSize: '12px', color: '#334155', fontWeight: '500' }}
                >
                    <Descriptions.Item label="Base Price">
                        Rs. {data.price}
                    </Descriptions.Item>
                    <Descriptions.Item label="Discounted Price">
                        <span className="font-bold text-slate-800">Rs. {data.discountedPrice}</span>
                        {data.discount && data.discount.value > 0 && (
                            <span className="text-[10px] text-red-500 bg-red-50 px-1 rounded font-bold ml-2">
                                -{data.discount.value}{data.discount.type === "percentage" ? "%" : " Rs"}
                            </span>
                        )}
                    </Descriptions.Item>
                    <Descriptions.Item label="Inventory Tracking">
                        {data.trackInventory ? (
                            <Tag color="success" className="m-0 font-bold px-1.5 py-0 rounded text-[9px] border-none">ENABLED</Tag>
                        ) : (
                            <Tag color="default" className="m-0 font-bold px-1.5 py-0 rounded text-[9px] border-none">DISABLED</Tag>
                        )}
                    </Descriptions.Item>
                    {data.trackInventory && (
                        <Descriptions.Item label="Stock Count">
                            <span className={data.stock <= 5 ? "text-red-500 font-bold" : ""}>{data.stock} items remaining</span>
                        </Descriptions.Item>
                    )}
                    <Descriptions.Item label="Description">
                        <p className="text-xs text-slate-600 m-0 leading-relaxed whitespace-pre-line">{data.description || "No description provided."}</p>
                    </Descriptions.Item>
                </Descriptions>

                {/* Image Gallery Section */}
                <div className="p-2.5 bg-slate-50/50 rounded border border-slate-100/50">
                    <h3 className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2">Product Images</h3>
                    <div className="flex flex-wrap gap-2">
                        {data.images && data.images.length > 0 ? (
                            data.images.map((img, i) => (
                                <div key={i} className="relative w-16 h-16 rounded border border-slate-200 overflow-hidden bg-white shadow-sm flex items-center justify-center">
                                    <img src={img.url} alt="product" className="max-w-full max-h-full object-cover" />
                                    {img.isPrimary && (
                                        <span className="absolute bottom-0 left-0 right-0 text-center bg-teal-600 text-white font-bold text-[7px] py-0.5 uppercase tracking-wide">Primary</span>
                                    )}
                                </div>
                            ))
                        ) : (
                            <span className="text-[10px] text-slate-400 font-medium italic">No images uploaded.</span>
                        )}
                    </div>
                </div>
            </div>
        </Modal>
    );
});

ViewProductModal.displayName = "ViewProductModal";

export default ViewProductModal;
