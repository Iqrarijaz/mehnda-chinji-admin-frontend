import React, { useState } from "react";
import { Modal, Descriptions, Tag, Button, Select, Input, Table, Avatar, Divider } from "antd";
import { FaInfoCircle, FaPhoneAlt, FaMapMarkerAlt, FaCashRegister, FaUser } from "react-icons/fa";
import { toast } from "react-toastify";
import { timestampToDate } from "@/utils/date";
import { hasPermission } from "@/utils/permissions";
import { PERMISSIONS } from "@/config/permissions";
import { useUpdateStoreOrderStatus } from "../../hooks/useStore";

const { Option } = Select;
const { TextArea } = Input;

const ViewOrderModal = React.memo(({ open, onCancel, data, businessId }) => {
    const [status, setStatus] = useState(data?.status || "");
    const [note, setNote] = useState("");

    if (!data) return null;

    const statusMutation = useUpdateStoreOrderStatus(onCancel);

    const handleStatusUpdate = () => {
        if (!status) return;
        statusMutation.mutate({
            id: data._id,
            status,
            note
        });
    };

    const colors = {
        PENDING: "orange",
        CONFIRMED: "blue",
        PREPARING: "cyan",
        OUT_FOR_DELIVERY: "purple",
        DELIVERED: "green",
        CANCELLED: "red",
        REJECTED: "error",
    };

    const itemsColumns = [
        {
            title: "Product Info",
            key: "product",
            render: (record) => {
                const imageUrl = record.productId?.images?.find(img => img.isPrimary)?.url || record.productId?.images?.[0]?.url || "";
                return (
                    <div className="flex items-center gap-2">
                        <Avatar
                            shape="square"
                            size={32}
                            src={imageUrl}
                            icon={!imageUrl && "🏪"}
                            className="bg-slate-50 border border-slate-100 flex-shrink-0"
                        />
                        <span className="text-xs font-semibold capitalize text-slate-700 truncate block max-w-[200px]">
                            {record.name}
                        </span>
                    </div>
                );
            }
        },
        {
            title: "Unit Price",
            dataIndex: "price",
            key: "price",
            width: 100,
            render: (val) => <span className="text-xs font-semibold text-slate-600">Rs. {val}</span>
        },
        {
            title: "Qty",
            dataIndex: "quantity",
            key: "quantity",
            width: 70,
            align: "center",
            render: (val) => <span className="text-xs font-bold text-slate-700">{val}</span>
        },
        {
            title: "Total",
            key: "total",
            width: 100,
            render: (record) => <span className="text-xs font-bold text-[#006666]">Rs. {record.price * record.quantity}</span>
        }
    ];

    return (
        <Modal
            title={
                <div className="flex items-center justify-between px-0 py-1 w-[95%]">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded bg-teal-50 flex items-center justify-center text-teal-600">
                            <FaInfoCircle size={16} />
                        </div>
                        <div>
                            <span className="text-base font-bold text-teal-700 block mt-1">Order # {data.orderNumber}</span>
                        </div>
                    </div>
                    <Tag color={colors[data.status] || "default"} className="m-0 font-bold px-2 py-0.5 rounded text-[10px] uppercase border-none">
                        {data.status.replace(/_/g, " ")}
                    </Tag>
                </div>
            }
            open={open}
            onCancel={onCancel}
            footer={null}
            width={700}
            className="modern-modal"
        >
            <div className="flex flex-col gap-4 max-h-[80vh] overflow-y-auto pr-1">
                {/* Details Section */}
                <Descriptions 
                    bordered 
                    column={2} 
                    size="small" 
                    className="compact-descriptions"
                    labelStyle={{ width: '130px', fontweight: 'bold', color: '#64748b', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.025em' }}
                    contentStyle={{ fontSize: '11px', color: '#334155', fontWeight: '500' }}
                >
                    <Descriptions.Item label="Customer">
                        <span className="flex items-center gap-1.5 capitalize font-bold">
                            <FaUser size={10} className="text-slate-400" /> {data.customerId?.name || "Anonymous"}
                        </span>
                    </Descriptions.Item>
                    <Descriptions.Item label="Contact Phone">
                        <span className="flex items-center gap-1.5">
                            <FaPhoneAlt size={10} className="text-slate-400" /> {data.deliveryAddress?.phone || data.customerId?.phone || "N/A"}
                        </span>
                    </Descriptions.Item>
                    <Descriptions.Item label="Date & Time">
                        {timestampToDate(data.createdAt)}
                    </Descriptions.Item>
                    <Descriptions.Item label="Payment Info">
                        <span className="flex items-center gap-1.5 uppercase font-bold text-[9px] text-[#006666]">
                            <FaCashRegister size={10} /> {data.paymentMethod || "COD"}
                        </span>
                    </Descriptions.Item>
                    <Descriptions.Item label="Delivery Address" span={2}>
                        <span className="flex items-start gap-1.5 leading-relaxed">
                            <FaMapMarkerAlt size={10} className="text-red-400 mt-0.5 flex-shrink-0" />
                            <div className="flex flex-col">
                                <span className="font-bold text-slate-700">{data.deliveryAddress?.name}</span>
                                <span>{data.deliveryAddress?.addressLine}</span>
                                <span className="text-[10px] text-slate-400 mt-0.5">Landmark: {data.deliveryAddress?.landmark || "None"}</span>
                            </div>
                        </span>
                    </Descriptions.Item>
                </Descriptions>

                {/* Items Section */}
                <div className="border border-slate-100 rounded overflow-hidden">
                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest pl-3 py-2 bg-slate-50/50 border-b border-slate-100 m-0">Order Items</p>
                    <Table
                        rowKey="productId"
                        columns={itemsColumns}
                        dataSource={data.items || []}
                        pagination={false}
                        size="small"
                        className="custom-ant-table"
                    />
                    <div className="flex justify-end p-3 bg-slate-50/30 gap-6 border-t border-slate-100">
                        <div className="text-right">
                            <span className="text-[10px] text-slate-400 block font-semibold uppercase">Total Quantity</span>
                            <span className="text-xs font-bold text-slate-700">{data.items?.reduce((sum, item) => sum + item.quantity, 0)} Items</span>
                        </div>
                        <div className="text-right">
                            <span className="text-[10px] text-[#006666] block font-semibold uppercase">Final Payable</span>
                            <span className="text-base font-extrabold text-[#006666]">Rs. {data.total}</span>
                        </div>
                    </div>
                </div>

                {/* Status Timeline History */}
                {data.statusHistory && data.statusHistory.length > 0 && (
                    <div className="p-3 bg-slate-50/50 rounded border border-slate-100/50">
                        <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2 m-0">Status Timeline</p>
                        <div className="space-y-2 mt-2 max-h-32 overflow-y-auto pr-1">
                            {data.statusHistory.map((history, i) => (
                                <div key={i} className="flex justify-between items-start text-[10px] pb-2 border-b border-slate-200/30 last:border-0 last:pb-0">
                                    <div className="flex flex-col">
                                        <Tag color={colors[history.status] || "default"} className="m-0 font-bold px-1 py-0 rounded text-[7px] uppercase border-none w-max">
                                            {history.status.replace(/_/g, " ")}
                                        </Tag>
                                        <span className="text-slate-500 mt-1 pl-1 leading-normal font-medium">{history.note}</span>
                                    </div>
                                    <span className="text-slate-400 font-bold text-[8px] tracking-tight">{timestampToDate(history.timestamp)}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Status Update Form */}
                {hasPermission(PERMISSIONS.STORE.ORDERS.UPDATE) && (
                    <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
                        <p className="text-[10px] font-bold text-[#006666] uppercase tracking-widest pl-1">Update Order Status</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div className="mb-1.5 grid">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-tight ml-1 mb-1 block">New Status</label>
                                <Select
                                    value={status}
                                    onChange={setStatus}
                                    className="w-full modern-select-box"
                                >
                                    <Option value="PENDING">PENDING</Option>
                                    <Option value="CONFIRMED">CONFIRMED</Option>
                                    <Option value="PREPARING">PREPARING</Option>
                                    <Option value="OUT_FOR_DELIVERY">OUT FOR DELIVERY</Option>
                                    <Option value="DELIVERED">DELIVERED</Option>
                                    <Option value="CANCELLED">CANCELLED (Restore Stock)</Option>
                                    <Option value="REJECTED">REJECTED (Restore Stock)</Option>
                                </Select>
                            </div>
                            <div className="mb-1.5 grid">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-tight ml-1 mb-1 block">Activity Note (Optional)</label>
                                <Input
                                    value={note}
                                    onChange={(e) => setNote(e.target.value)}
                                    placeholder="e.g. Preparing fresh batch..."
                                    className="!h-[32px] !text-xs !rounded border-slate-200"
                                />
                            </div>
                        </div>
                        <div className="flex justify-end gap-2 mt-1">
                            <Button onClick={onCancel} size="small" className="!text-xs !rounded">Cancel</Button>
                            <Button
                                type="primary"
                                size="small"
                                onClick={handleStatusUpdate}
                                loading={statusMutation.isPending}
                                className="!bg-[#006666] hover:!bg-[#005555] !text-xs !rounded border-none"
                            >
                                Update Status
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </Modal>
    );
});

ViewOrderModal.displayName = "ViewOrderModal";

export default ViewOrderModal;
