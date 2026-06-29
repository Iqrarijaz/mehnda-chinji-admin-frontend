"use client";
import React, { useRef, useEffect } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { Modal, Upload, DatePicker } from "antd";
import { PlusOutlined, FileTextOutlined } from "@ant-design/icons";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { toast } from "react-toastify";
import FormField from "@/components/InnerPage/FormField";
import SelectBox from "@/components/SelectBox";
import CustomButton from "@/components/shared/CustomButton";
import { CREATE_ANNOUNCEMENT } from "@/app/api/admin/announcements";
import { GET_ESSENTIALS } from "@/app/api/admin/essentials";
import { ADMIN_KEYS } from "@/constants/queryKeys";

const validationSchema = Yup.object().shape({
    title: Yup.string().required("Title is required"),
    message: Yup.string().required("Message is required"),
    type: Yup.string().required("Type is required"),
});

const initialValues = {
    title: "",
    message: "",
    type: "public",
    essentialId: "",
    eventDate: null,
    files: []
};

const AddAnnouncementModal = React.memo(({ modal, setModal }) => {
    const formikRef = useRef(null);
    const queryClient = useQueryClient();

    // Fetch essentials for dropdown selector
    const { data: essentialsData } = useQuery(
        ["essentialsForAnnouncements"],
        () => GET_ESSENTIALS({ limit: 100 }),
        { keepPreviousData: true }
    );

    const essentialsOptions = React.useMemo(() => {
        const list = essentialsData?.data || [];
        return [
            { value: "", label: "Public Announcement (None)" },
            ...list.map(item => ({ value: item._id, label: `${item.name} (${item.category})` }))
        ];
    }, [essentialsData]);

    const createAnnouncement = useMutation({
        mutationKey: ["createAnnouncement"],
        mutationFn: CREATE_ANNOUNCEMENT,
        onSuccess: (data) => {
            toast.success(data?.message || "Announcement created successfully");
            queryClient.invalidateQueries([ADMIN_KEYS.ANNOUNCEMENTS.LIST]);
            handleCloseModal(true);
        },
        onError: (error) => {
            toast.error(error.errorMessage || "Something went wrong");
        },
    });

    const handleSubmit = React.useCallback((values) => {
        const formData = new FormData();
        formData.append("title", values.title);
        formData.append("message", values.message);
        formData.append("type", values.type);
        if (values.essentialId) {
            formData.append("essentialId", values.essentialId);
        }
        if (values.eventDate) {
            formData.append("eventDate", values.eventDate.toISOString());
        }
        if (values.files && values.files.length > 0) {
            values.files.forEach(file => {
                if (file.originFileObj) {
                    formData.append("images", file.originFileObj);
                }
            });
        }
        createAnnouncement.mutate(formData);
    }, [createAnnouncement]);

    const handleCloseModal = React.useCallback((force = false) => {
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
    }, [setModal]);

    useEffect(() => {
        if (!modal.state) {
            formikRef.current?.resetForm();
        }
    }, [modal.state]);

    return (
        <Modal
            title={
                <div className="flex items-center gap-2 px-0 py-1">
                    <div className="w-8 h-8 rounded bg-teal-50 flex items-center justify-center text-[#006666]">
                        <FileTextOutlined style={{ fontSize: '16px' }} />
                    </div>
                    <div>
                        <span className="text-lg font-bold text-[#006666] block mt-1">Create Announcement</span>
                    </div>
                </div>
            }
            centered
            width={800}
            open={modal?.name === "Add" && modal?.state}
            onCancel={() => handleCloseModal(false)}
            footer={null}
        >
            <div className="p-1">
                <Formik
                    innerRef={formikRef}
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                >
                    {({ values, errors, touched, handleChange, handleBlur, setFieldValue }) => (
                        <Form className="space-y-4">
                            <FormField
                                label="Title"
                                name="title"
                                value={values.title}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                error={errors.title && touched.title ? errors.title : null}
                            />

                            <div className="flex flex-col">
                                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Message</label>
                                <textarea
                                    name="message"
                                    rows={4}
                                    value={values.message}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    className="border border-slate-300 dark:border-slate-700 rounded p-2 focus:ring-2 focus:ring-teal-500 bg-transparent dark:text-white"
                                />
                                {errors.message && touched.message && (
                                    <span className="text-red-500 text-xs mt-1">{errors.message}</span>
                                )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <SelectBox
                                    label="Type"
                                    name="type"
                                    value={values.type}
                                    onChange={(val) => setFieldValue("type", val)}
                                    options={[
                                        { value: "public", label: "Public" },
                                        { value: "health", label: "Health" },
                                        { value: "education", label: "Education" },
                                        { value: "emergency", label: "Emergency" },
                                        { value: "banks", label: "Banks" },
                                        { value: "travel", label: "Travel" },
                                        { value: "religious", label: "Religious" },
                                        { value: "govt", label: "Government" },
                                        { value: "lost_found", label: "Lost & Found" }
                                    ]}
                                    error={errors.type && touched.type ? errors.type : null}
                                />

                                <SelectBox
                                    label="Essential Place"
                                    name="essentialId"
                                    value={values.essentialId}
                                    onChange={(val) => setFieldValue("essentialId", val)}
                                    options={essentialsOptions}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex flex-col">
                                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Event Date (Optional)</label>
                                    <DatePicker
                                        className="h-10 dark:bg-slate-800 dark:border-slate-700 dark:text-white w-full"
                                        onChange={(date) => setFieldValue("eventDate", date)}
                                        value={values.eventDate}
                                    />
                                </div>

                                <div className="flex flex-col">
                                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Upload Images (Max 5)</label>
                                    <Upload
                                        listType="picture-card"
                                        fileList={values.files}
                                        onChange={({ fileList }) => setFieldValue("files", fileList)}
                                        beforeUpload={() => false}
                                        maxCount={5}
                                    >
                                        {values.files.length < 5 && (
                                            <div>
                                                <PlusOutlined />
                                                <div style={{ marginTop: 8 }}>Upload</div>
                                            </div>
                                        )}
                                    </Upload>
                                </div>
                            </div>

                            <div className="flex justify-end gap-2 pt-4">
                                <CustomButton
                                    variant="outlined"
                                    onClick={() => handleCloseModal(false)}
                                    disabled={createAnnouncement.isLoading}
                                >
                                    Cancel
                                </CustomButton>
                                <CustomButton
                                    type="submit"
                                    variant="primary"
                                    loading={createAnnouncement.isLoading}
                                >
                                    Submit
                                </CustomButton>
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </Modal>
    );
});

AddAnnouncementModal.displayName = "AddAnnouncementModal";

export default AddAnnouncementModal;
