"use client";
import React, { useRef } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { Select, Switch } from "antd";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { FaStore, FaMapMarkerAlt, FaPhoneAlt, FaTag, FaRegSave } from "react-icons/fa";

import { useStoreContext } from "@/hooks/useStoreContext";
import BusinessTabs from "../components/BusinessTabs";
import InnerPageCard from "@/components/layout/InnerPageCard";
import Loading from "@/animations/homePageLoader";
import FormField from "@/components/InnerPage/FormField";
import professions from "@/data/professions.json";
import CustomButton from "@/components/shared/CustomButton";
import { GET_BUSINESS, UPDATE_BUSINESS } from "@/app/api/admin/business";
import { ADMIN_KEYS } from "@/constants/queryKeys";

const { Option } = Select;

const validationSchema = Yup.object().shape({
    name: Yup.string().required("Business name is required"),
    categoryEn: Yup.string().required("Category is required"),
    phone: Yup.string().required("Phone number is required"),
    address: Yup.string().required("Address is required"),
});

const StoreSettingsPage = () => {
    const { selectedStoreId } = useStoreContext();
    const queryClient = useQueryClient();
    const formikRef = useRef(null);
    const [isRefreshing, setIsRefreshing] = React.useState(false);

    const { data: businessData, isLoading, refetch } = useQuery({
        queryKey: [ADMIN_KEYS.BUSINESS.GET, selectedStoreId],
        queryFn: () => GET_BUSINESS(selectedStoreId),
        enabled: !!selectedStoreId
    });

    const updateMutation = useMutation({
        mutationFn: UPDATE_BUSINESS,
        onSuccess: (res) => {
            toast.success(res?.message || "Store settings updated successfully.");
            queryClient.invalidateQueries({ queryKey: [ADMIN_KEYS.BUSINESS.GET, selectedStoreId] });
            queryClient.invalidateQueries({ queryKey: [ADMIN_KEYS.BUSINESS.LIST] });
        },
        onError: (err) => {
            toast.error(err?.response?.data?.message || "Failed to update store settings.");
        }
    });

    const business = businessData?.data;

    const initialValues = {
        name: business?.name || "",
        categoryEn: business?.categoryEn || "",
        phone: business?.phone || "",
        address: business?.address || "",
        hasStore: business?.hasStore || false,
    };

    const handleRefresh = async () => {
        setIsRefreshing(true);
        await refetch();
        setIsRefreshing(false);
    };

    const handleSubmit = (values) => {
        updateMutation.mutate({ _id: selectedStoreId, ...values });
    };

    return (
        <InnerPageCard>
            <BusinessTabs handleRefresh={handleRefresh} isRefreshing={isRefreshing} />

            {!selectedStoreId ? (
                <div className="flex flex-col items-center justify-center p-8 bg-slate-50 dark:bg-slate-900 border border-dashed border-slate-200 dark:border-slate-800 rounded-lg">
                    <p className="text-sm font-semibold text-slate-500">Please select an active store from the dropdown above to view settings.</p>
                </div>
            ) : (
                <div className="max-w-2xl mt-4">
                    {isLoading ? (
                        <Loading />
                    ) : (
                        <Formik
                            innerRef={formikRef}
                            initialValues={initialValues}
                            validationSchema={validationSchema}
                            onSubmit={handleSubmit}
                            enableReinitialize
                        >
                            {({ values, setFieldValue, errors, touched }) => (
                                <Form className="flex flex-col gap-5">
                                    {/* Row 1: Name and Category */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                        <FormField
                                            label="Store Name"
                                            name="name"
                                            icon={<FaStore className="text-slate-400" />}
                                            placeholder="e.g. Acme Inc."
                                        />

                                        <div className="flex flex-col gap-1.5 relative">
                                            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Category</label>
                                            <div className="relative flex items-center">
                                                <div className="absolute left-3 z-10 flex items-center justify-center">
                                                    <FaTag className="text-slate-400" />
                                                </div>
                                                <Select
                                                    showSearch
                                                    placeholder="Select a category"
                                                    className="w-full formit-input custom-selectbox selectbox-rounded-none !pl-8"
                                                    value={values.categoryEn || undefined}
                                                    onChange={(value) => setFieldValue("categoryEn", value)}
                                                    filterOption={(input, option) =>
                                                        option?.children?.toLowerCase().includes(input.toLowerCase())
                                                    }
                                                    status={touched.categoryEn && errors.categoryEn ? "error" : ""}
                                                >
                                                    {professions.map((prof, index) => (
                                                        <Option key={index} value={prof.en}>
                                                            {prof.en}
                                                        </Option>
                                                    ))}
                                                </Select>
                                            </div>
                                            {touched.categoryEn && errors.categoryEn && (
                                                <div className="text-red-500 text-xs mt-1">{errors.categoryEn}</div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Row 2: Phone and Address */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                        <FormField
                                            label="Phone Number"
                                            name="phone"
                                            icon={<FaPhoneAlt className="text-slate-400" />}
                                            placeholder="e.g. +1 234 567 890"
                                        />

                                        <FormField
                                            label="Address"
                                            name="address"
                                            type="textarea"
                                            icon={<FaMapMarkerAlt className="text-slate-400 mt-2" />}
                                            placeholder="Store address..."
                                        />
                                    </div>

                                    <div className="flex flex-col gap-1.5 mt-2">
                                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Store Features</label>
                                        <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800/50 p-4 rounded border border-slate-200 dark:border-slate-700">
                                            <Switch
                                                checked={values.hasStore}
                                                onChange={(val) => setFieldValue("hasStore", val)}
                                            />
                                            <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                                                Enable e-commerce / online store for this business
                                            </span>
                                        </div>
                                    </div>

                                    <div className="mt-6 flex justify-end">
                                        <CustomButton
                                            title="Save Settings"
                                            icon={<FaRegSave />}
                                            loading={updateMutation.isPending}
                                            onClick={() => formikRef.current?.submitForm()}
                                        />
                                    </div>
                                </Form>
                            )}
                        </Formik>
                    )}
                </div>
            )}
        </InnerPageCard>
    );
};

export default StoreSettingsPage;
