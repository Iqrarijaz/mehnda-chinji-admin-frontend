"use client";
import React, { useRef, useEffect, useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { Modal, Select, Avatar, Space, Spin, Switch } from "antd";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { FaStore, FaUser } from "react-icons/fa";

import { FormSkeleton } from "@/components/shared/Skeletons";
import FormField from "@/components/InnerPage/FormField";
import SelectField from "@/components/InnerPage/SelectField";
import { SEARCH_USERS } from "@/app/api/admin/users";
import TimingPicker from "@/components/TimingPicker";
import professions from "@/data/professions.json";
import CustomButton from "@/components/shared/CustomButton";
import { useCreateBusiness } from "../hooks/useBusiness";

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
    hasStore: false,
    storeSettings: {
        deliveryAreas: [],
        minOrderAmount: 0,
        isStoreActive: true,
    },
    isDeleted: false,
};

const AddBusinessModal = React.memo(({ modal, setModal }) => {
    const formikRef = useRef(null);
    const queryClient = useQueryClient();
    const [users, setUsers] = useState([]);
    const [fetching, setFetching] = useState(false);
    const debounceTimeoutRef = useRef(null);

    useEffect(() => {
        return () => {
            if (debounceTimeoutRef.current) {
                clearTimeout(debounceTimeoutRef.current);
            }
        };
    }, []);

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
                setUsers(response?.data || []);
            } catch (error) {
                console.error("Search users error:", error);
            } finally {
                setFetching(false);
            }
        }, 800);
    };

    const createBusiness = useCreateBusiness(() => handleCloseModal(true));

    const onSubmit = (values) => {
        createBusiness.mutate(values);
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
        if (!modal?.state) {
            formikRef.current?.resetForm();
            setUsers([]);
        }
    }, [modal?.state]);

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
            maskStyle={{ backdropFilter: "blur(4px)" }}
            destroyOnClose
        >
            <div className="p-1">
                <Formik
                    innerRef={formikRef}
                    enableReinitialize
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={onSubmit}
                >
                    {({ values, errors, touched, setFieldValue, isSubmitting }) => (
                        <Form className="space-y-3">
                            {createBusiness.isPending ? (
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
                                                    placeholder="Enter business name"
                                                    required
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
                                                        notFoundContent={fetching ? <Spin size="small" /> : "No users found"}
                                                        loading={fetching}
                                                        className="w-full modern-select-box"
                                                        value={values.userId || undefined}
                                                    >
                                                        {users.map((user) => (
                                                            <Option key={user._id} value={user._id}>
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
                                                            setFieldValue("categoryEn", value);
                                                            const profession = professions.find(p => p.name_eng === value);
                                                            if (profession) {
                                                                setFieldValue("categoryUr", profession.name_ur);
                                                            }
                                                        }}
                                                        className="w-full modern-select-box"
                                                        value={values.categoryEn || undefined}
                                                    >
                                                        {[...professions]
                                                            .sort((a, b) => a.name_eng.localeCompare(b.name_eng))
                                                            .map((prof, index) => {
                                                                const displayName = prof.name_eng.charAt(0).toUpperCase() + prof.name_eng.slice(1);
                                                                return (
                                                                    <Option
                                                                        key={index}
                                                                        value={prof.name_eng}
                                                                        label={`${displayName} - ${prof.name_ur}`}
                                                                    >
                                                                        <div className="flex items-center gap-2 w-full truncate">
                                                                            <span className="text-xs font-bold capitalize whitespace-nowrap">{displayName}</span>
                                                                            <span className="text-slate-300 text-[10px]">•</span>
                                                                            <span className="text-[11px] font-notoUrdu text-slate-400 truncate">{prof.name_ur}</span>
                                                                        </div>
                                                                    </Option>
                                                                );
                                                            })}
                                                    </Select>
                                                    {errors.categoryEn && touched.categoryEn && (
                                                        <div className="text-red-500 text-[10px] mt-0.5 ml-1">{errors.categoryEn}</div>
                                                    )}
                                                </div>
                                            </div>
                                            <FormField
                                                label="Phone"
                                                name="phone"
                                                placeholder="+92 300 1234567"
                                                required
                                            />
                                            <FormField
                                                label="Address"
                                                name="address"
                                                placeholder="Full Address"
                                                required
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

                                    {/* Online Store Section */}
                                    <div className="bg-slate-50/50 p-3 rounded border border-slate-100/50 space-y-3">
                                        <div className="flex items-center justify-between px-1">
                                            <div>
                                                <span className="text-xs font-bold text-[#006666] block">Enable Online Store</span>
                                                <span className="text-[10px] text-slate-400 block">Allow this business to have a digital catalog and receive COD orders.</span>
                                            </div>
                                            <Switch
                                                checked={values.hasStore}
                                                onChange={(checked) => setFieldValue("hasStore", checked)}
                                                className="custom-switch"
                                            />
                                        </div>

                                        {values.hasStore && (
                                            <div className="pt-3 border-t border-slate-200/50 grid grid-cols-1 md:grid-cols-2 gap-3">
                                                <div className="md:col-span-2">
                                                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-tight ml-1 mb-1 block">
                                                        Delivery Areas
                                                    </label>
                                                    <Select
                                                        mode="tags"
                                                        placeholder="Type area and press Enter..."
                                                        className="w-full modern-select-box"
                                                        value={values.storeSettings.deliveryAreas}
                                                        onChange={(val) => setFieldValue("storeSettings.deliveryAreas", val)}
                                                    />
                                                    <span className="text-[10px] text-slate-400 pl-1">Enter specific areas or sectors this store delivers to.</span>
                                                    {errors.storeSettings?.deliveryAreas && touched.storeSettings?.deliveryAreas && (
                                                        <div className="text-red-500 text-[10px] mt-0.5 ml-1">{errors.storeSettings.deliveryAreas}</div>
                                                    )}
                                                </div>
                                                <div>
                                                    <FormField
                                                        label="Minimum Order Amount"
                                                        name="storeSettings.minOrderAmount"
                                                        placeholder="0"
                                                        type="number"
                                                    />
                                                </div>
                                                <div className="flex items-center justify-between px-1 self-center mt-2">
                                                    <div>
                                                        <span className="text-xs font-bold text-slate-600 block">Store Status</span>
                                                        <span className="text-[10px] text-slate-400 block">Temporarily close/open the store frontend.</span>
                                                    </div>
                                                    <Switch
                                                        checked={values.storeSettings.isStoreActive}
                                                        onChange={(checked) => setFieldValue("storeSettings.isStoreActive", checked)}
                                                        className="custom-switch"
                                                    />
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Description Section */}
                                    <div className="px-1 mt-1">
                                        <FormField
                                            label="Description"
                                            name="description"
                                            placeholder="Brief description..."
                                            type="textarea"
                                        />
                                    </div>
                                </>
                            )}

                            {/* Modal Footer Actions */}
                            <div className="flex justify-end gap-2 pt-3 mt-3 border-t border-slate-100">
                                <CustomButton
                                    text="Cancel"
                                    variant="outlined"
                                    onClick={() => handleCloseModal(false)}
                                    disabled={createBusiness.isPending || isSubmitting}
                                />
                                <CustomButton
                                    text={createBusiness.isPending ? "Registering..." : "Register Business"}
                                    variant="primary"
                                    htmlType="submit"
                                    loading={createBusiness.isPending || isSubmitting}
                                />
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </Modal>
    );
});

AddBusinessModal.displayName = "AddBusinessModal";

export default AddBusinessModal;
