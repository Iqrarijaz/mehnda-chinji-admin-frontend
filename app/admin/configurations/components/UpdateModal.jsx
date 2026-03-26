import React, { useRef } from "react";
import { Modal, Input, Select } from "antd";
import * as Yup from "yup";
import { useMutation, useQueryClient } from "react-query";
import { toast } from "react-toastify";
import { FaCogs, FaCode, FaEdit, FaChevronRight } from "react-icons/fa";
import CustomButton from "@/components/shared/CustomButton";

import Loading from "@/animations/homePageLoader";
import { FormSkeleton } from "@/components/shared/Skeletons";
import { UPDATE_CONFIGURATION } from "@/app/api/admin/configurations";
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
            };
            return UPDATE_CONFIGURATION(payload);
        },
        onSuccess: (data) => {
            toast.success(data?.message || "Configuration updated successfully");
            queryClient.invalidateQueries("configurationsList");
            handleClose();
        },
        onError: (error) => {
            toast.error(error?.response?.data?.message || "Something went wrong");
        },
    });

    const handleClose = () => {
        setModal({ name: null, state: false, data: null });
    };

    const initialValues = {
        type: modal.data?.type || "",
        dataString: modal.data?.data ? JSON.stringify(modal.data.data, null, 2) : "",
        isActive: modal.data?.isActive ?? true,
    };

    return (
        <Modal
            title={
                <div className="flex items-center gap-2 px-0 py-1">
                    <div className="w-8 h-8 rounded bg-teal-50 flex items-center justify-center text-[#006666]">
                        <FaEdit size={16} />
                    </div>
                    <div>
                        <span className="text-lg font-bold text-[#006666] block mt-1">Update Configuration</span>
                    </div>
                </div>
            }
            open={modal.name === "Update" && modal.state}
            onCancel={handleClose}
            footer={null}
            centered
            width={600}
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
                                    <div className="modal-section space-y-2">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Core Definition</p>
                                        <div className="flex flex-col gap-1.5">
                                            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-tight ml-1">Config Type (Namespace) <span className="text-red-500">*</span></label>
                                            <div className="relative">

                                                <Input
                                                    value={values.type}
                                                    placeholder="Namespace"
                                                    className="!pl-3 !h-[32px] !text-xs !rounded !border-slate-200 focus:!border-[#006666]"
                                                    onChange={(e) => setFieldValue("type", e.target.value.toUpperCase())}
                                                />
                                            </div>
                                            {errors.type && touched.type && <div className="text-red-500 text-[10px] font-medium ml-1">{errors.type}</div>}
                                        </div>
                                    </div>

                                    <div className="modal-section !mb-0 space-y-2">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Payload Structure</p>
                                        <div className="bg-slate-900 rounded p-3 border border-slate-800 shadow-sm overflow-hidden">
                                            <div className="flex items-center justify-between mb-2 pb-2 border-b border-slate-800/50">
                                                <div className="flex items-center gap-2">
                                                    <FaCode className="text-teal-400" size={10} />
                                                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">JSON Schema Editor</span>
                                                </div>
                                            </div>
                                            <TextArea
                                                rows={8}
                                                value={values.dataString}
                                                onChange={(e) => setFieldValue("dataString", e.target.value)}
                                                placeholder='{ "key": "value" }'
                                                className="!bg-transparent !text-teal-50 !border-none !ring-0 !outline-none font-mono text-[11px] custom-scrollbar"
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
                                </>
                            )}

                            <div className="flex justify-end gap-2 pt-3 mt-3 border-t border-slate-100">
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
