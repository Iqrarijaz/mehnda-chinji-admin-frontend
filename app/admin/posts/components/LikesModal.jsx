import { Modal, Table, Avatar } from "antd";
import { useQuery } from "react-query";
import { FaHeart } from "react-icons/fa";
import Loading from "@/animations/homePageLoader";
import { FormSkeleton } from "@/components/shared/Skeletons";
import { GET_POST_LIKES } from "@/app/api/admin/posts";
import { timestampToDateWithTime } from "@/utils/date";
import CustomButton from "@/components/shared/CustomButton";

function LikesModal({ isOpen, onClose, postId }) {
    const { data, isLoading, error } = useQuery({
        queryKey: ["postLikes", postId],
        queryFn: () => GET_POST_LIKES({ _id: postId }),
        enabled: !!postId && isOpen,
    });

    const columns = [
        {
            title: "User",
            key: "user",
            render: (record) => (
                <div className="flex items-center gap-2">
                    <Avatar
                        src={record.user?.profileImage}
                        size={32}
                        className="bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-colors"
                    >
                        {record.user?.name?.charAt(0)}
                    </Avatar>
                    <div className="flex flex-col">
                        <span className="font-bold text-[12px] text-slate-800 dark:text-slate-200 capitalize leading-tight transition-colors">
                            {record.user?.name || "Unknown User"}
                        </span>
                        <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium transition-colors">{record.user?.phone || "No phone"}</span>
                    </div>
                </div>
            )
        },
        {
            title: "Liked At",
            dataIndex: "createdAt",
            key: "createdAt",
            width: 180,
            align: 'right',
            render: (date) => (
                <div className="text-[10px] text-slate-500 dark:text-slate-400 font-medium transition-colors">
                    {timestampToDateWithTime(date)}
                </div>
            )
        }
    ];

    return (
        <Modal
            title={
                <div className="flex items-center gap-2 px-0 py-1">
                    <div className="w-8 h-8 rounded bg-red-50 dark:bg-red-900/20 flex items-center justify-center text-red-500 dark:text-red-400 transition-colors duration-300">
                        <FaHeart size={16} />
                    </div>
                    <div>
                        <span className="text-lg font-bold text-red-700 dark:text-red-400 block mt-1 transition-colors duration-300">Post Likes</span>
                    </div>
                </div>
            }
            open={isOpen}
            onCancel={onClose}
            footer={
                <CustomButton
                    label="Back to Posts"
                    type="secondary"
                    onClick={onClose}
                    className="w-full"
                />
            }
            width={520}
            className="modern-modal"
            destroyOnClose
        >
            <div className="p-2">
                {isLoading ? (
                    <div className="py-4">
                        <FormSkeleton fields={5} />
                    </div>
                ) : error ? (
                    <div className="py-20 text-center flex flex-col items-center gap-2">
                        <div className="text-red-500 font-bold">Failed to load likes</div>
                        <p className="text-slate-400 text-sm">Please check your connection and try again.</p>
                    </div>
                ) : (
                    <Table
                        dataSource={data?.data || []}
                        columns={columns}
                        rowKey="_id"
                        size="middle"
                        pagination={{
                            pageSize: 6,
                            hideOnSinglePage: true,
                            className: "!mt-6"
                        }}
                        className="antd-table-custom !border-none !shadow-none"
                    />
                )}
            </div>
        </Modal>
    );
}

export default LikesModal;
