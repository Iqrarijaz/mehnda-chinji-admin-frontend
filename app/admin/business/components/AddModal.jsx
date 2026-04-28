"use client";
import React, { useRef, useEffect } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { Modal, Select, Avatar, Space } from "antd";
import { useMutation, useQueryClient } from "react-query";
import { toast } from "react-toastify";
import { FaStore, FaMapMarkerAlt, FaPhoneAlt, FaTag, FaUser } from "react-icons/fa";

import Loading from "@/animations/homePageLoader";
import { FormSkeleton } from "@/components/shared/Skeletons";
import FormField from "@/components/InnerPage/FormField";
import { CREATE_BUSINESS } from "@/app/api/admin/business";
import { SEARCH_USERS } from "@/app/api/admin/users";
import TimingPicker from "@/components/TimingPicker";
import professions from "@/data/professions.json";
import CustomButton from "@/components/shared/CustomButton";
import { ADMIN_KEYS } from "@/constants/queryKeys";

const { Option } = Select;

const validationSchema = Yup.object().shape({
    name: Yup.string().required("Business name is required"),
    userId: Yup.string().required("Owner User ID is required"),
    categoryEn: Yup.string().required("English category is required"),
    phone: Yup.string().required("Phone number is required"),
    address: Yup.string().required("Address is required"),
});

const initialValues = {
    name: "",
    userId: "",
    categoryEn: "",
    categoryUr: "",
    description: "",
    phone: "",
    address: "",
    timing: "",
    isDeleted: false,
};

function AddBusinessModal({ modal, setModal }) {
    const formikRef = useRef(null);
    const queryClient = useQueryClient();
    const [users, setUsers] = React.useState([]);
    const [fetching, setFetching] = React.useState(false);
    const debounceTimeoutRef = useRef(null);

    const handleSearch = async (value) => {
        if (!value || value.length < 2) {
            setUsers([]);
            return;
        }

        if (debounceTimeoutRef.current) {
            clearTimeout(debounceTimeoutRef.current);
        }

        debounceTimeoutRef.current = setTimeout(async () => {
            setFetching(true);
            try {
                const response = await SEARCH_USERS({ search: value });
                setUsers(response.data || []);
            } catch (error) {
                console.error("Search users error:", error);
            } finally {
                setFetching(false);
            }
        }, 800);
    };

    const createBusiness = useMutation({
        mutationFn: CREATE_BUSINESS,
        onSuccess: (data) => {
            toast.success(data?.message || "Business created successfully");
            queryClient.invalidateQueries([ADMIN_KEYS.BUSINESS.LIST]);
            queryClient.invalidateQueries([ADMIN_KEYS.BUSINESS.COUNTS]);
            handleCloseModal(true);
        },
        onError: (error) => {
            toast.error(error.errorMessage || "Something went wrong");
        },
    });

    const handleSubmit = (values, { setSubmitting }) => {
        createBusiness.mutate(values, {
            onError: () => setSubmitting(false),
            onSuccess: () => setSubmitting(false),
        });
    };

    const handleCloseModal = (force = false) => {
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
                        <FaStore size={16} />
                    </div>
                    <div>
                        <span className="text-lg font-bold text-[#006666] block mt-1">Register Business</span>
                    </div>
                </div>
            }
            centered
            width={800}
            open={modal?.name === "Add" && modal?.state}
            onCancel={() => handleCloseModal(false)}
            footer={null}
            className="modern-modal"
        >
            <div className="p-1">
                <Formik
                    innerRef={formikRef}
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                >
                    {({ values, setFieldValue, errors, touched, isSubmitting }) => (
                        <Form className="space-y-3">
                            {createBusiness.status === "loading" ? (
                                <FormSkeleton fields={5} />
                            ) : (
                                <>
                                    {/* Basic Info Section */}
                                    <div className="bg-slate-50/50 p-3 rounded border border-slate-100/50 space-y-3">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Identity & Ownership</p>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            <div className="md:col-span-2">
                                                <FormField
                                                    label="Business Name"
                                                    name="name"
                                                    placeholder="Name"
                                                    required
                                                    className="!h-[32px] !text-xs !rounded"
                                                    labelClassName="!text-[11px] !font-bold !text-slate-500 !uppercase !tracking-tight !ml-1"
                                                />
                                            </div>
                                            <div className="md:col-span-2">
                                                <div className="mb-1.5 grid">
                                                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-tight ml-1 mb-1">
                                                        Owner User <span className="text-red-500">*</span>
                                                    </label>
                                                    <Select
                                                        showSearch
                                                        placeholder="Search user by name..."
                                                        filterOption={false}
                                                        onSearch={handleSearch}
                                                        onChange={(value) => {
                                                            setFieldValue("userId", value);
                                                            const selectedUser = users.find(u => u._id === value);
                                                            if (selectedUser && selectedUser.phone) {
                                                                setFieldValue("phone", selectedUser.phone);
                                                            }
                                                        }}
                                                        notFoundContent={fetching ? <Loading /> : null}
                                                        loading={fetching}
                                                        className="w-full modern-select-box"
                                                        value={values.userId || undefined}
                                                    >
                                                        {users.map((user) => (
                                                            <Option key={user._id} value={user._id} label={user.name}>
                                                                <Space>
                                                                    <Avatar
                                                                        size="small"
                                                                        src={user.profileImage}
                                                                        icon={!user.profileImage && <FaUser />}
                                                                    />
                                                                    <div className="flex items-center gap-1.5">
                                                                        <span className="text-xs font-bold capitalize">{user.name}</span>
                                                                        <span className="text-[10px] text-slate-400">({user.email || "No Email"})</span>
                                                                    </div>
                                                                </Space>
                                                            </Option>
                                                        ))}
                                                    </Select>
                                                    {errors.userId && touched.userId && (
                                                        <div className="text-red-500 text-[10px] mt-0.5 ml-1">{errors.userId}</div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Details Section */}
                                    <div className="p-3 rounded border border-slate-100 space-y-3">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Categorization & Contact</p>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            <div className="md:col-span-2">
                                                <div className="mb-1.5 grid">
                                                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-tight ml-1 mb-1">
                                                        Profession <span className="text-red-500">*</span>
                                                    </label>
                                                    <Select
                                                        showSearch
                                                        placeholder="Select profession..."
                                                        optionLabelProp="label"
                                                        filterOption={(input, option) =>
                                                            option?.value?.toLowerCase().includes(input.toLowerCase())
                                                        }
                                                        onChange={(value) => {
                                                            const profession = professions.find(p => p.name_eng === value);
                                                            if (profession) {
                                                                setFieldValue("categoryEn", profession.name_eng);
                                                                setFieldValue("categoryUr", profession.name_ur);
                                                            }
                                                        }}
                                                        className="w-full modern-select-box"
                                                        value={values.categoryEn || undefined}
                                                    >
                                                        {[...professions]
                                                            .sort((a, b) => a.name_eng.localeCompare(b.name_eng))
                                                            .map((prof, index) => (
                                                                <Option key={index} value={prof.name_eng} label={`${prof.name_eng.charAt(0).toUpperCase() + prof.name_eng.slice(1)} - ${prof.name_ur}`}>
                                                                    <div className="flex items-center gap-2 w-full truncate">
                                                                        <span className="text-xs font-bold capitalize whitespace-nowrap">{prof.name_eng}</span>
                                                                        <span className="text-slate-300 text-[10px]">—</span>
                                                                        <span className="text-[11px] font-notoUrdu text-slate-400 truncate">{prof.name_ur}</span>
                                                                    </div>
                                                                </Option>
                                                            ))}
                                                    </Select>
                                                    {errors.categoryEn && touched.categoryEn && (
                                                        <div className="text-red-500 text-[10px] mt-0.5 ml-1">{errors.categoryEn}</div>
                                                    )}
                                                </div>
                                            </div>
                                            <FormField
                                                label="Phone"
                                                name="phone"
                                                placeholder="+92..."
                                                required
                                                className="!h-[32px] !text-xs !rounded"
                                                labelClassName="!text-[11px] !font-bold !text-slate-500 !uppercase !tracking-tight !ml-1"
                                            />
                                            <FormField
                                                label="Address"
                                                name="address"
                                                placeholder="Full Address"
                                                required
                                                className="!h-[32px] !text-xs !rounded"
                                                labelClassName="!text-[11px] !font-bold !text-slate-500 !uppercase !tracking-tight !ml-1"
                                            />
                                        </div>
                                    </div>

                                    {/* Operation Data Section */}
                                    <div className="bg-slate-50/50 p-3 rounded border border-slate-100/50 space-y-3">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Operation Data</p>
                                        <div className="grid grid-cols-1 gap-3">
                                            <TimingPicker
                                                value={values.timing}
                                                onChange={(val) => setFieldValue("timing", val)}
                                            />
                                        </div>
                                    </div>

                                    {/* Description Section */}
                                    <div className="px-1 mt-1">
                                        <FormField
                                            label="Description"
                                            name="description"
                                            placeholder="Brief description..."
                                            type="textarea"
                                            className="!text-xs !rounded !h-16"
                                            labelClassName="!text-[11px] !font-bold !text-slate-500 !uppercase !tracking-tight !ml-1"
                                        />
                                    </div>
                                </>
                            )}

                            {/* Modal Footer Actions */}
                            <div className="flex justify-end gap-2 pt-3 mt-3 border-t border-slate-100">
                                <CustomButton
                                    label="Cancel"
                                    type="secondary"
                                    onClick={() => handleCloseModal(false)}
                                />
                                <CustomButton
                                    label="Register Business"
                                    htmlType="submit"
                                    loading={createBusiness.isLoading || isSubmitting}
                                />
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </Modal>
    );
}

export default AddBusinessModal;
