"use client";
import { Formik } from "formik";
import { message, Input, Button, Form as AntForm } from "antd";
import React, { useEffect, useState } from "react";
import * as Yup from "yup";
import { useRouter } from "next/navigation";
import UseMount from "@/hooks/useMount";
import Loading from "@/animations/homePageLoader";
import { useMutation } from "react-query";
import { LOGIN } from "./api/login";
import { UserOutlined, LockOutlined } from "@ant-design/icons";

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
        message.success("Login successfully");
      },
      onError: (error) => {
        setSubmitting(false);
        message.error("Invalid email or password");
      },
    });
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#0F172A]">
        <Loading />
      </div>
    );
  }

  return (
    isMounted && (
      <div className="flex min-h-screen w-full bg-[#F8FAFC]">
        {/* Left Section - Branded Brand Identity */}
        <div className="hidden lg:flex w-1/2 bg-[#0F172A] relative flex-col items-center justify-center p-12 overflow-hidden">
          {/* Decorative Elements */}
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-white/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-3xl"></div>

          <div className="relative z-10 text-center flex flex-col items-center max-w-md">
            <img
              src="/logo.png"
              alt="Mehnda Chinji"
              className="h-48 w-auto mb-8 drop-shadow-2xl brightness-110"
            />
            <h1 className="text-4xl font-bold text-white mb-4 tracking-tight">
              Mehnda Chinji Admin
            </h1>
            <p className="text-gray-400 text-lg leading-relaxed font-light">
              Elevating management through intelligent design and seamless control.
            </p>
          </div>

          <div className="absolute bottom-10 left-10 text-gray-500 text-sm font-medium tracking-widest uppercase">
            © 2026 Admin Portal
          </div>
        </div>

        {/* Right Section - Functional Login Flow */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 lg:p-24">
          <div className="w-full max-w-md space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="text-center lg:text-left mb-10">
              <h2 className="text-3xl font-bold text-[#0F172A] tracking-tight mb-2">
                Admin Login
              </h2>
              <p className="text-gray-500">
                Please enter your credentials to access your account.
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
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-4">
                    <AntForm.Item
                      validateStatus={errors.email && touched.email ? "error" : ""}
                      help={errors.email && touched.email ? errors.email : ""}
                      className="mb-0"
                    >
                      <label className="block text-sm font-semibold text-gray-700 mb-2 ml-1">
                        Email Address
                      </label>
                      <Input
                        size="large"
                        prefix={<UserOutlined className="text-gray-400 mr-2" />}
                        placeholder="admin@example.com"
                        name="email"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.email}
                        className="h-12 rounded border-gray-200 hover:border-[#0F172A] focus:border-[#0F172A] shadow-sm transition-all"
                      />
                    </AntForm.Item>

                    <AntForm.Item
                      validateStatus={errors.password && touched.password ? "error" : ""}
                      help={errors.password && touched.password ? errors.password : ""}
                      className="mb-0"
                    >
                      {/* <div className="flex justify-between items-center mb-2 ml-1">
                        <label className="text-sm font-semibold text-gray-700">
                          Account Password
                        </label>
                        <a href="#" className="text-xs font-semibold text-[#0F172A] hover:underline decoration-2 underline-offset-4">
                          Lost password?
                        </a>
                      </div> */}
                      <Input.Password
                        size="large"
                        prefix={<LockOutlined className="text-gray-400 mr-2" />}
                        placeholder="••••••••"
                        name="password"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.password}
                        className="h-12 rounded border-gray-200 hover:border-[#0F172A] focus:border-[#0F172A] shadow-sm transition-all"
                      />
                    </AntForm.Item>
                  </div>

                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={isSubmitting}
                    className="w-full h-12 bg-[#0F172A] hover:bg-[#1E293B] border-none text-white font-bold rounded shadow-lg shadow-blue-900/10 transition-all transform active:scale-[0.98] mt-4"
                  >
                    Login
                  </Button>

                  <div className="relative py-4">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-100"></div>
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-[#F8FAFC] px-4 text-gray-400 font-medium">Secure Admin Access</span>
                    </div>
                  </div>
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