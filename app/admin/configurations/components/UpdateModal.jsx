"use client";
import React, { useRef } from "react";
import { Modal, Button, Input, Select } from "antd";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useMutation, useQueryClient } from "react-query";
import { toast } from "react-toastify";
import { FaCogs, FaCode, FaEdit, FaChevronRight } from "react-icons/fa";

import Loading from "@/animations/homePageLoader";
import { UPDATE_CONFIGURATION } from "@/app/api/admin/configurations";

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
                <div className="flex items-center gap-3 px-2 pt-1">
                    <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center text-teal-600">
                        <FaEdit size={18} />
                    </div>
                    <div>
                        <span className="text-xl font-bold text-slate-900 block">Update Configuration</span>
                        <span className="text-xs text-slate-500 font-normal">Modify existing system parameters</span>
                    </div>
                </div>
            }
            open={modal.name === "Update" && modal.state}
            onCancel={handleClose}
            footer={null}
            centered
            width={720}
            className="modern-modal"
        >
            <div className="p-2 pt-4">
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
                        <Form className="space-y-6">
                            {updateConfig.status === "loading" && <Loading />}

                            <div className="modal-section">
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Core Definition</p>
                                <div className="flex flex-col gap-2">
                                    <label className="text-slate-700 font-semibold text-sm">Config Type (Namespace) <span className="text-red-500">*</span></label>
                                    <div className="relative">
                                        <FaChevronRight className="absolute top-1/2 -translate-y-1/2 left-4 text-slate-300 pointer-events-none" />
                                        <Input
                                            value={values.type}
                                            placeholder="Namespace identifier"
                                            className="!pl-11 !h-[44px] !rounded-xl !border-2 !border-slate-100 focus:!border-teal-500"
                                            onChange={(e) => setFieldValue("type", e.target.value.toUpperCase())}
                                        />
                                    </div>
                                    {errors.type && touched.type && <div className="text-red-500 text-xs font-medium">{errors.type}</div>}
                                </div>
                            </div>

                            <div className="modal-section !mb-0">
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Payload Structure</p>
                                <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 shadow-xl overflow-hidden">
                                    <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
                                        <div className="flex items-center gap-2">
                                            <FaCode className="text-teal-400" size={14} />
                                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">JSON Schema Editor</span>
                                        </div>
                                    </div>
                                    <TextArea
                                        rows={12}
                                        value={values.dataString}
                                        onChange={(e) => setFieldValue("dataString", e.target.value)}
                                        placeholder='{ "key": "value" }'
                                        className="!bg-transparent !text-teal-50 !border-none !ring-0 !outline-none font-mono text-xs custom-scrollbar"
                                        style={{ resize: 'none' }}
                                    />
                                    {errors.dataString && touched.dataString && (
                                        <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl">
                                            <p className="text-red-400 text-[10px] font-bold uppercase tracking-widest leading-none mb-1">Syntax Error</p>
                                            <p className="text-red-200 text-xs">{errors.dataString}</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 pt-6 mt-6 border-t border-slate-100">
                                <Button
                                    onClick={handleClose}
                                    className="modal-footer-btn-secondary flex-1"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    loading={isSubmitting || updateConfig.isLoading}
                                    className="modal-footer-btn-primary flex-1"
                                >
                                    Save Changes
                                </Button>
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </Modal>
    );
}

export default UpdateConfigurationModal;
