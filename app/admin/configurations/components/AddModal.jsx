import React, { useRef } from "react";
import { Modal, Input, Select } from "antd";
import * as Yup from "yup";
import { useMutation, useQueryClient } from "react-query";
import { toast } from "react-toastify";
import { FaCogs, FaCode, FaPlus, FaChevronRight } from "react-icons/fa";
import CustomButton from "@/components/shared/CustomButton";

import Loading from "@/animations/homePageLoader";
import { FormSkeleton } from "@/components/shared/Skeletons";
import { CREATE_CONFIGURATION } from "@/app/api/admin/configurations";
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

function AddConfigurationModal({ modal, setModal }) {
    const formikRef = useRef(null);
    const queryClient = useQueryClient();

    const createConfig = useMutation({
        mutationFn: (values) => {
            const payload = {
                type: values.type,
                data: JSON.parse(values.dataString),
                isActive: values.isActive,
                isDeleted: values.isDeleted,
            };
            return CREATE_CONFIGURATION(payload);
        },
        onSuccess: (data) => {
            toast.success(data?.message || "Configuration added successfully");
            queryClient.invalidateQueries([ADMIN_KEYS.CONFIGURATIONS.LIST]);
            handleClose(true);
        },
        onError: (error) => {
            toast.error(error.errorMessage || "Something went wrong");
        },
    });

    const handleClose = () => {
        const force = arguments[0] === true;
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
        type: "CITIES",
        dataString: JSON.stringify({ name: "", code: "" }, null, 2),
        isActive: true,
        isDeleted: false,
    };

    return (
        <Modal
            title={
                <div className="flex items-center gap-2 px-0 py-1">
                    <div className="w-8 h-8 rounded bg-teal-50 dark:bg-teal-900/30 flex items-center justify-center text-[#006666] dark:text-teal-400 transition-colors duration-300">
                        <FaCogs size={16} />
                    </div>
                    <div>
                        <span className="text-lg font-bold text-[#006666] dark:text-teal-400 block mt-1 transition-colors duration-300">New System Config</span>
                    </div>
                </div>
            }
            open={modal.name === "Add" && modal.state}
            onCancel={handleClose}
            footer={null}
            centered
            width={600}
            className="modern-modal"
        >
            <div className="p-1">
                <Formik
                    innerRef={formikRef}
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={(values, { setSubmitting }) => {
                        createConfig.mutate(values);
                        setSubmitting(false);
                    }}
                >
                    {({ values, errors, touched, setFieldValue, isSubmitting }) => (
                        <Form className="space-y-4">
                            {createConfig.status === "loading" ? (
                                <FormSkeleton fields={3} />
                            ) : (
                                <>
                                    <div className="modal-section space-y-2">
                                        <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest pl-1 mt-2">Core Definition</p>
                                        <div className="flex flex-col gap-1.5 transition-colors duration-300">
                                            <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-tight ml-1 transition-colors duration-300">Config Type (Namespace) <span className="text-red-500">*</span></label>
                                            <div className="relative">
                                                <Input
                                                    value={values.type}
                                                    placeholder="CITIES, PROFESSIONS..."
                                                    className="!pl-3 !h-[32px] !text-xs !rounded !border-slate-100 dark:!border-slate-800 !bg-white dark:!bg-slate-900 !text-slate-700 dark:!text-slate-200 focus:!border-[#006666] transition-all duration-300"
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

                            <div className="flex justify-end gap-2 pt-3 mt-3 border-t border-slate-100 dark:border-slate-800 transition-colors duration-300">
                                <CustomButton
                                    label="Cancel"
                                    type="secondary"
                                    onClick={handleClose}
                                />
                                <CustomButton
                                    label="Activate Configuration"
                                    htmlType="submit"
                                    loading={isSubmitting || createConfig.isLoading}
                                />
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </Modal>
    );
}

export default AddConfigurationModal;
