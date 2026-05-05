import React, { useRef } from "react";
import { Modal, Input, Select } from "antd";
import * as Yup from "yup";
import { useMutation, useQueryClient } from "react-query";
import { toast } from "react-toastify";
import { FaCogs, FaCode, FaEdit, FaChevronRight, FaInfoCircle } from "react-icons/fa";
import CustomButton from "@/components/shared/CustomButton";

import Loading from "@/animations/homePageLoader";
import { FormSkeleton } from "@/components/shared/Skeletons";
import { UPDATE_CONFIGURATION } from "@/app/api/admin/configurations";
import { ADMIN_KEYS } from "@/constants/queryKeys";
import { Formik, Form } from "formik";

const { TextArea } = Input;
const { Option } = Select;

const validationSchema = Yup.object().shape({
    type: Yup.string().required("Configuration type is required"),
    dataString: Yup.string()
        .required("JSON payload is required")
        .test("is-json", "Invalid JSON format", (value) => {
            try {
                JSON.parse(value);
                return true;
            } catch (e) {
                return false;
            }
        }),
});

function UpdateConfigurationModal({ modal, setModal }) {
    const formikRef = useRef(null);
    const queryClient = useQueryClient();

    const updateConfig = useMutation({
        mutationFn: (values) => {
            const payload = {
                _id: modal.data._id,
                type: values.type,
                data: JSON.parse(values.dataString),
                isActive: values.isActive,
                isDeleted: values.isDeleted,
            };
            return UPDATE_CONFIGURATION(payload);
        },
        onSuccess: (data) => {
            toast.success(data?.message || "Configuration updated successfully");
            queryClient.invalidateQueries([ADMIN_KEYS.CONFIGURATIONS.LIST]);
            handleClose(true);
        },
        onError: (error) => {
            toast.error(error.errorMessage || "Something went wrong");
        },
    });

    const handleClose = (forceClose = false) => {
        const force = forceClose === true;
        if (!force && formikRef.current?.dirty) {
            Modal.confirm({
                title: "Unsaved Changes",
                content: "You have unsaved changes. Are you sure you want to discard them and exit?",
                okText: "Discard",
                okType: "danger",
                cancelText: "Stay",
                onOk: () => {
                    formikRef.current?.resetForm();
                    setModal({ name: null, state: false, data: null });
                },
            });
        } else {
            formikRef.current?.resetForm();
            setModal({ name: null, state: false, data: null });
        }
    };

    const initialValues = {
        type: modal.data?.type || "",
        dataString: modal.data?.data ? JSON.stringify(modal.data.data, null, 2) : "",
        isActive: modal.data?.isActive ?? true,
        isDeleted: modal.data?.isDeleted ?? false,
    };

    return (
        <Modal
            title={
                <div className="flex items-center gap-2 px-0 py-1">
                    <div className="w-8 h-8 rounded bg-teal-50 dark:bg-teal-900/30 flex items-center justify-center text-[#006666] dark:text-teal-400 transition-colors duration-300">
                        <FaEdit size={16} />
                    </div>
                    <div>
                        <span className="text-lg font-bold text-[#006666] dark:text-teal-400 block mt-1 transition-colors duration-300">Update Configuration</span>
                    </div>
                </div>
            }
            open={modal.name === "Update" && modal.state}
            onCancel={handleClose}
            footer={null}
            centered
            width={1200}
            style={{ top: 20 }}
            bodyStyle={{ maxHeight: 'calc(100vh - 150px)', overflowY: 'auto' }}
            className="modern-modal"
        >
            <div className="p-1">
                <Formik
                    enableReinitialize
                    innerRef={formikRef}
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={(values, { setSubmitting }) => {
                        updateConfig.mutate(values);
                        setSubmitting(false);
                    }}
                >
                    {({ values, errors, touched, setFieldValue, isSubmitting }) => (
                        <Form className="space-y-4">
                            {updateConfig.status === "loading" ? (
                                <FormSkeleton fields={3} />
                            ) : (
                                <>
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                        {/* Editor Side */}
                                        <div className="space-y-4">
                                            <div className="modal-section space-y-2">
                                                <div className="flex flex-col gap-1.5 ">
                                                    <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-tight ml-1 transition-colors duration-300">Config Type (Namespace) <span className="text-red-500">*</span></label>
                                                    <div className="relative">
                                                        <Input
                                                            value={values.type}
                                                            placeholder="Namespace"
                                                            className="!pl-3 !h-[36px] !text-xs !rounded !border-slate-100 dark:!border-slate-800 !bg-white dark:!bg-slate-900 !text-slate-700 dark:!text-slate-200 focus:!border-[#006666] transition-all duration-300"
                                                            onChange={(e) => setFieldValue("type", e.target.value.toUpperCase())}
                                                        />
                                                    </div>
                                                    {errors.type && touched.type && <div className="text-red-500 text-[10px] font-medium ml-1 mt-1 transition-colors duration-300">{errors.type}</div>}
                                                </div>
                                            </div>

                                            <div className="modal-section !mb-0 space-y-2">
                                                <div className="bg-slate-900 rounded-xl p-4 border border-slate-800 shadow-sm overflow-hidden h-full">
                                                    <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-800/50">
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-6 h-6 rounded bg-slate-800 flex items-center justify-center">
                                                                <FaCode className="text-teal-400" size={10} />
                                                            </div>
                                                            <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">JSON Schema Editor</span>
                                                        </div>
                                                    </div>
                                                    <TextArea
                                                        rows={20}
                                                        value={values.dataString}
                                                        onChange={(e) => setFieldValue("dataString", e.target.value)}
                                                        placeholder='{ "key": "value" }'
                                                        className="!bg-transparent !text-teal-400 !border-none !ring-0 !outline-none font-mono text-[11px] custom-scrollbar"
                                                        style={{ resize: 'none' }}
                                                    />
                                                    {errors.dataString && touched.dataString && (
                                                        <div className="mt-2 p-2 bg-red-500/10 border border-red-500/20 rounded">
                                                            <p className="text-red-400 text-[9px] font-bold uppercase tracking-widest leading-none mb-1">Syntax Error</p>
                                                            <p className="text-red-200 text-[11px]">{errors.dataString}</p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Visual Preview Side */}
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-2 mb-1 px-1">
                                                <div className="w-5 h-5 rounded-full bg-teal-500/10 flex items-center justify-center text-teal-600">
                                                    <FaChevronRight size={8} />
                                                </div>
                                                <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Live Visual Preview</span>
                                            </div>
                                            
                                            <div className="max-h-[600px] overflow-y-auto custom-scrollbar pr-2">
                                                {(() => {
                                                    try {
                                                        const previewData = JSON.parse(values.dataString);
                                                        if (Array.isArray(previewData) && previewData[0]?.category) {
                                                            return (
                                                                <div className="space-y-4">
                                                                    {previewData.map((cat, idx) => (
                                                                        <div key={idx} className="bg-white dark:bg-slate-900/40 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm transition-all">
                                                                            <div className="px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                                                                                <div className="flex items-center gap-2">
                                                                                    <FaInfoCircle className="text-teal-500" size={14} />
                                                                                    <h3 className="text-[11px] font-black text-slate-800 dark:text-slate-100 uppercase tracking-wider m-0">
                                                                                        {cat.category}
                                                                                    </h3>
                                                                                </div>
                                                                            </div>
                                                                            <div className="p-4">
                                                                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                                                                    {cat.types?.map((type, tIdx) => (
                                                                                        <div 
                                                                                            key={tIdx} 
                                                                                            className="group flex flex-col items-center p-3 rounded-xl transition-all hover:bg-teal-50/30 dark:hover:bg-teal-900/10 cursor-pointer"
                                                                                            onClick={() => {
                                                                                                if (type.icon) {
                                                                                                    navigator.clipboard.writeText(type.icon);
                                                                                                    toast.success("Link copied to clipboard");
                                                                                                }
                                                                                            }}
                                                                                        >
                                                                                            <div className="w-[68px] h-[68px] flex items-center justify-center mb-2 transition-transform group-hover:scale-110 duration-300">
                                                                                                {type.icon ? (
                                                                                                    <img 
                                                                                                        src={type.icon} 
                                                                                                        alt={type.label} 
                                                                                                        className="w-full h-full object-contain"
                                                                                                        onError={(e) => {
                                                                                                            e.target.src = "https://via.placeholder.com/68?text=NA";
                                                                                                        }}
                                                                                                    />
                                                                                                ) : (
                                                                                                    <div className="w-full h-full flex items-center justify-center text-slate-300 dark:text-slate-600">
                                                                                                        <FaCode size={20} />
                                                                                                    </div>
                                                                                                )}
                                                                                            </div>
                                                                                            <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300 text-center line-clamp-1 group-hover:text-teal-600 dark:group-hover:text-teal-400">
                                                                                                {type.label}
                                                                                            </span>
                                                                                        </div>
                                                                                    ))}
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            );
                                                        }
                                                        return (
                                                            <div className="flex flex-col items-center justify-center h-[300px] border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50/50 dark:bg-slate-900/20">
                                                                <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
                                                                    <FaCode className="text-slate-300 dark:text-slate-600" size={24} />
                                                                </div>
                                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center px-6">
                                                                    No category data pattern detected to visualize
                                                                </p>
                                                            </div>
                                                        );
                                                    } catch (e) {
                                                        return (
                                                            <div className="flex flex-col items-center justify-center h-[300px] border-2 border-dashed border-red-500/20 rounded-xl bg-red-50/50 dark:bg-red-900/10">
                                                                <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center mb-4">
                                                                    <FaCode className="text-red-400" size={24} />
                                                                </div>
                                                                <p className="text-[10px] font-bold text-red-400 uppercase tracking-widest text-center px-6">
                                                                    Invalid JSON payload structure
                                                                </p>
                                                            </div>
                                                        );
                                                    }
                                                })()}
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}

                            <div className="flex justify-end gap-2 pt-3 mt-3 border-t border-slate-100 dark:border-slate-800 transition-colors duration-300">
                                <CustomButton
                                    label="Cancel"
                                    type="secondary"
                                    onClick={handleClose}
                                />
                                <CustomButton
                                    label="Save Changes"
                                    htmlType="submit"
                                    loading={isSubmitting || updateConfig.isLoading}
                                />
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </Modal>
    );
}

export default UpdateConfigurationModal;
