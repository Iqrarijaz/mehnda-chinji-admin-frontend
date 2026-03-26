import { Modal, List, Avatar, Popconfirm, Tooltip, Button } from "antd";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { FaTrash, FaCommentDots } from "react-icons/fa";
import { toast } from "react-toastify";
import Loading from "@/animations/homePageLoader";
import { FormSkeleton } from "@/components/shared/Skeletons";
import { GET_POST_COMMENTS, DELETE_POST_COMMENT } from "@/app/api/admin/posts";
import { timestampToDateWithTime } from "@/utils/date";
import CustomButton from "@/components/shared/CustomButton";

function CommentsModal({ isOpen, onClose, postId }) {
    const queryClient = useQueryClient();
    const { data, isLoading, error } = useQuery({
        queryKey: ["postComments", postId],
        queryFn: () => GET_POST_COMMENTS({ _id: postId }),
        enabled: !!postId && isOpen,
    });

    const deleteMutation = useMutation({
        mutationFn: (commentId) => DELETE_POST_COMMENT({ commentId, postId }),
        onSuccess: (res) => {
            toast.success(res?.message || "Comment deleted successfully");
            queryClient.invalidateQueries(["postComments", postId]);
            queryClient.invalidateQueries("postsList");
            queryClient.invalidateQueries("postsListInfinite");
        },
        onError: (err) => {
            toast.error(err?.response?.data?.message || "Failed to delete comment");
        }
    });

    return (
        <Modal
            title={
                <div className="flex items-center gap-2 px-0 py-1">
                    <div className="w-8 h-8 rounded bg-teal-50 flex items-center justify-center text-[#006666]">
                        <FaCommentDots size={16} />
                    </div>
                    <div>
                        <span className="text-lg font-bold text-[#006666] block mt-1">Post Comments</span>
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
            width={680}
            className="modern-modal"
            destroyOnClose
        >
            <div className="p-1">
                <div className="max-h-[550px] overflow-y-auto pr-2 custom-scrollbar">
                    {isLoading ? (
                        <div className="py-4">
                            <FormSkeleton fields={5} />
                        </div>
                    ) : error ? (
                        <div className="py-20 text-center text-red-500 bg-red-50 rounded-2xl border border-red-100 p-8">
                            <FaCommentDots size={40} className="mx-auto mb-4 opacity-20" />
                            <p className="font-bold">Failed to load comments</p>
                            <span className="text-xs opacity-70">There was an issue fetching the comment list.</span>
                        </div>
                    ) : (
                        <List
                            itemLayout="horizontal"
                            dataSource={data?.data || []}
                            locale={{
                                emptyText: (
                                    <div className="py-20 text-center text-slate-400">
                                        <FaCommentDots size={48} className="mx-auto mb-4 opacity-10" />
                                        <p className="text-lg font-medium">No comments yet</p>
                                        <span className="text-sm">This post hasn't received any comments.</span>
                                    </div>
                                )
                            }}
                            renderItem={(item) => (
                                <List.Item
                                    className="group hover:bg-slate-50/50 p-2.5 rounded-lg transition-all duration-200 border-none mb-1"
                                    actions={[
                                        <Popconfirm
                                            key="delete"
                                            title="Delete this comment?"
                                            description="This action cannot be undone."
                                            onConfirm={() => deleteMutation.mutate(item._id)}
                                            okText="Delete"
                                            cancelText="Keep"
                                            okButtonProps={{ danger: true, loading: deleteMutation.isLoading, className: "!rounded-lg" }}
                                            cancelButtonProps={{ className: "!rounded-lg" }}
                                        >
                                            <Tooltip title="Delete Comment">
                                                <Button
                                                    type="text"
                                                    danger
                                                    icon={<FaTrash size={12} />}
                                                    className="opacity-0 group-hover:opacity-100 transition-opacity bg-white hover:bg-red-50 border border-slate-100 shadow-sm !rounded-md !w-8 !h-8 flex items-center justify-center p-0"
                                                />
                                            </Tooltip>
                                        </Popconfirm>
                                    ]}
                                >
                                    <List.Item.Meta
                                        avatar={
                                            <Avatar
                                                src={item.user?.profileImage}
                                                size={32}
                                                className="bg-slate-100 border border-slate-200 shadow-sm"
                                            >
                                                {item.user?.name?.charAt(0)}
                                            </Avatar>
                                        }
                                        title={
                                            <div className="flex items-center justify-between">
                                                <span className="font-bold text-[13px] text-slate-800 capitalize leading-tight">
                                                    {item.user?.name || "Anonymous User"}
                                                </span>
                                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                                                    {timestampToDateWithTime(item.createdAt)}
                                                </span>
                                            </div>
                                        }
                                        description={
                                            <div className="mt-1 text-slate-600 text-xs leading-relaxed whitespace-pre-wrap bg-white/50 p-2 rounded-lg border border-slate-100/50 italic">
                                                "{item.text}"
                                            </div>
                                        }
                                    />
                                </List.Item>
                            )}
                        />
                    )}
                </div>
            </div>
        </Modal>
    );
}

export default CommentsModal;
