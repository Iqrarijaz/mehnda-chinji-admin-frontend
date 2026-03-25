"use client";
import { Formik } from "formik";
import { Input, Button, Form as AntForm } from "antd";
import React, { useEffect, useState } from "react";
import * as Yup from "yup";
import { useRouter } from "next/navigation";
import UseMount from "@/hooks/useMount";
import Loading from "@/animations/homePageLoader";
import { useMutation } from "react-query";
import { LOGIN } from "./api/login";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { toast } from "react-toastify";

const initialValues = {
  email: "",
  password: "",
};

const validationSchema = Yup.object({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

function Page() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const isMounted = UseMount();

  useEffect(() => {
    const isLogged = localStorage.getItem("userData");
    if (isLogged) {
      router.push("/admin/dashboard");
    } else {
      setLoading(false);
    }
  }, [router]);

  const loginMutation = useMutation({
    mutationFn: LOGIN,
  });

  function handleLoginSubmit(values, { setSubmitting }) {
    loginMutation.mutate(values, {
      onSuccess: (data) => {
        localStorage.setItem("userData", JSON.stringify(data?.data));
        router.push("/admin/dashboard");
        toast.success("Login successfully");
      },
      onError: (error) => {
        setSubmitting(false);
        toast.error("Invalid email or password");
      },
    });
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <Loading />
      </div>
    );
  }

  return (
    isMounted && (
      <div className="min-h-screen w-full bg-gray-50 flex items-center justify-center p-4">
        <div className="w-full max-w-sm">
          {/* Logo Section */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-white rounded-xl shadow-sm flex items-center justify-center mb-4 p-2">
              <img
                src="/icon.png"
                alt="Rehbar"
                className="w-full h-full object-contain"
              />
            </div>
            <h1 className="text-2xl font-semibold text-gray-800">
              Rehbar Admin
            </h1>
          </div>

          {/* Login Card */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 sm:p-8">
            <div className="mb-6 text-center">
              <h2 className="text-xl font-medium text-gray-800">
                Welcome Back
              </h2>
              <p className="text-gray-500 text-sm mt-1">
                Please enter your details to sign in
              </p>
            </div>

            <Formik
              validationSchema={validationSchema}
              initialValues={initialValues}
              onSubmit={handleLoginSubmit}
            >
              {({
                values,
                errors,
                touched,
                handleChange,
                handleBlur,
                handleSubmit,
                isSubmitting,
              }) => (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <AntForm.Item
                      validateStatus={errors.email && touched.email ? "error" : ""}
                      help={errors.email && touched.email ? errors.email : ""}
                      className="mb-0"
                    >
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                      </label>
                      <Input
                        size="large"
                        prefix={<UserOutlined className="text-gray-400 mr-2" />}
                        placeholder="admin@example.com"
                        name="email"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.email}
                      />
                    </AntForm.Item>
                  </div>

                  <div>
                    <AntForm.Item
                      validateStatus={errors.password && touched.password ? "error" : ""}
                      help={errors.password && touched.password ? errors.password : ""}
                      className="mb-0"
                    >
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Password
                      </label>
                      <Input.Password
                        size="large"
                        prefix={<LockOutlined className="text-gray-400 mr-2" />}
                        placeholder="••••••••"
                        name="password"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.password}
                      />
                    </AntForm.Item>
                  </div>

                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={isSubmitting || loginMutation.status === "loading"}
                    className="w-full mt-4 bg-teal-600 hover:bg-teal-700"
                    size="large"
                  >
                    Sign in
                  </Button>
                </form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    )
  );
}

export default Page;