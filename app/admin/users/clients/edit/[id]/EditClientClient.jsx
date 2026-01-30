"use client";
import { useEffect, useRef, useState } from "react";
import { Button } from "antd";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useParams, useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Link from "next/link";
import { useMutation, useQuery } from "react-query";
import Loading from "@/animations/homePageLoader";
import FormField from "@/components/InnerPage/FormField";
import ColorPickerFormField from "@/components/InnerPage/ColorPickerFormField";
import ColorPickerModal from "../../components/ColorPickerModal";
import UploadImage from "@/components/upload/UploadImage";
import DescriptionField from "@/components/InnerPage/DescriptionField";
import { GET_CLIENT, UPDATE_CLIENT } from "@/app/api/admin/clients";

const validationSchema = Yup.object().shape({
    firstName: Yup.string().required("Required"),
    lastName: Yup.string().required("Required"),
    companyName: Yup.string().required("Required"),
    email: Yup.string().email("Invalid email address").required("Required"),
    phone: Yup.string().required("Required"),
    publicPhone: Yup.string().required("Required"),
    publicEmail: Yup.string().email("Invalid email address").required("Required"),
    description: Yup.string().required("Required"),
});

const initialValues = {
    firstName: "",
    companyName: "",
    lastName: "",
    description: "",
    email: "",
    phone: "",
    publicPhone: "",
    publicEmail: "",
};

function EditClientClient() {
    const formikRef = useRef(null);
    const params = useParams();
    const { id } = params;
    const router = useRouter();
    //  create primary and secondary color for modal open and close
    const [primaryColorModal, setPrimaryColorModal] = useState({
        type: null,
        state: false,
        colorCode: null,
    });
    const [secondaryColorModal, setSecondaryColorModal] = useState({
        type: null,
        state: false,
        colorCode: null,
    });

    // Get client details from API
    const getClient = useQuery({
        queryKey: ["getClient", JSON.stringify(id)],
        enabled: !!id,
        queryFn: async () => {
            return await GET_CLIENT(id);
        },
        onError: (error) => {
            console.error("Error fetching data:", error);
            toast.error("Something went wrong. Please try again later.");
        },
    });

    // Setting initial values for form
    useEffect(() => {
        if (!getClient.isLoading && getClient.data) {
            const {
                _id,
                firstName,
                lastName,
                companyName,
                email,
                phone,
                publicPhone,
                publicEmail,
                description,
            } = getClient.data.data;

            formikRef.current.setValues({
                _id,
                firstName,
                lastName,
                companyName,
                email,
                phone,
                publicPhone,
                publicEmail,
                description,
            });
        }
        // Setting primary and secondary color values for fields
        setPrimaryColorModal((prev) => ({
            ...prev,
            colorCode: getClient?.data?.data?.primaryColor,
        }));

        setSecondaryColorModal((prev) => ({
            ...prev,
            colorCode: getClient?.data?.data?.secondaryColor,
        }));
    }, [getClient.data, getClient.isLoading]);

    // Mutation for updating client
    const updateClient = useMutation({
        mutationKey: ["updateClient"],
        mutationFn: async (values) => {
            return await UPDATE_CLIENT(values);
        },
        onSuccess: (data) => {
            router.push("/admin/users/clients");
            toast.success(data?.message);
        },
        onError: (error) => {
            console.log(error);
            toast.error(error?.response?.data?.error);
        },
    });

    // Function to handle submit form for update client request
    function handleUpdateClient(values) {
        try {
            updateClient.mutate(values);
        } catch (error) {
            console.error("Error submitting form:", error);
        }
    }

    return (
        <div >
            <div className="mb-4 flex justify-between">
                <h1 className="inner-page-title text-3xl text-black p-0">
                    Edit Client
                </h1>
            </div>
            <Formik
                innerRef={formikRef}
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleUpdateClient}
            >
                {({ errors, touched }) => (
                    <div className=" ">
                        <Form>
                            <div className="form-class mx-auto gap-6 relative  bg-gray-100 p-6 rounded">
                                {/* Setting loader on first get request and then on update client request */}
                                {getClient.isLoading && <Loading />}{" "}
                                {updateClient?.status === "loading" && <Loading />}
                                <div className=" bg-white w-full p-6 rounded">
                                    <div className="upload-image-div">
                                        <UploadImage />
                                    </div>
                                    <FormField label="First Name" name="firstName" />
                                    <FormField label="Last Name" name="lastName" />
                                    <FormField label="Contact Email" name="email" />
                                </div>
                                <div className="">
                                    <FormField label="Contact Phone" name="phone" />
                                    <FormField label="Company Name" name="companyName" />
                                    <FormField label="Public Email" name="publicEmail" />
                                    <FormField label="Public Phone" name="publicPhone" />
                                    <DescriptionField
                                        label="Description"
                                        name="description"
                                        type="textarea"
                                    />
                                </div>
                                <div className="">
                                    <ColorPickerFormField
                                        label="Primary Color"
                                        name="primaryColor"
                                        disabled={true}
                                        onClick={() =>
                                            setPrimaryColorModal({ type: "primary", state: true })
                                        }
                                        colorModal={primaryColorModal}
                                    />
                                    <ColorPickerFormField
                                        label="Secondary Color"
                                        name="secondaryColor"
                                        disabled={true}
                                        onClick={() =>
                                            setSecondaryColorModal({ type: "secondary", state: true })
                                        }
                                        colorModal={secondaryColorModal}
                                    />
                                </div>{" "}
                            </div>
                            <div className="flex justify-end mt-8 gap-6">
                                <Link
                                    href="/admin/users/clients"
                                    className="bg-lightBlue h-9 flex items-center  hover:bg-white border-lightBlue hover:text-red-500 hover:border-red-500 text-white font-bold py-2 px-10 rounded"
                                >
                                    Cancel
                                </Link>
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    className="bg-lightBlue hover:bg-white border-lightBlue hover:text-black !hover:border-black text-white font-bold py-4 px-10 rounded"
                                >
                                    Update
                                </Button>
                            </div>
                        </Form>
                    </div>
                )}
            </Formik>
            <ColorPickerModal
                isModalOpen={primaryColorModal}
                setIsModalOpen={setPrimaryColorModal}
                handlePrimaryColorChange={(color) => {
                    formikRef.current.setFieldValue("primaryColor", color);
                }}
            />
            <ColorPickerModal
                isModalOpen={secondaryColorModal}
                setIsModalOpen={setSecondaryColorModal}
                handleSecondaryColorChange={(color) => {
                    formikRef.current.setFieldValue("secondaryColor", color);
                }}
            />
        </div>
    );
}

export default EditClientClient;
