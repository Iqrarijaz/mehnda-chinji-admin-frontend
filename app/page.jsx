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
import { UserOutlined, LockOutlined, SafetyCertificateOutlined } from "@ant-design/icons";

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
      <div className="flex items-center justify-center h-screen bg-slate-50">
        <Loading />
      </div>
    );
  }

  return (
    isMounted && (
      <div className="min-h-screen w-full bg-[#F8FAFC] flex items-center justify-center p-4 relative overflow-hidden">
        {/* Background Decorative Elements */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-teal-500/5 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-teal-600/10 rounded-full blur-[120px]"></div>

        <div className="w-full max-w-[450px] relative z-10">
          {/* Logo Section */}
          <div className="flex flex-col items-center mb-10 animate-in fade-in slide-in-from-top-4 duration-1000">
            <div className="w-20 h-20 bg-white rounded-2xl shadow-xl shadow-teal-900/5 flex items-center justify-center mb-6 p-4">
              <img
                src="/logo.png"
                alt="Rehbar"
                className="w-full h-auto object-contain"
              />
            </div>
            <h1 className="text-3xl font-black text-slate-800 tracking-tight">
              Rehbar Admin
            </h1>
            <p className="text-slate-400 font-medium mt-1 tracking-wide uppercase text-[10px]">
              Central Command Center
            </p>
          </div>

          {/* Login Card */}
          <div className="bg-white rounded-[32px] shadow-2xl shadow-teal-900/5 border border-white p-8 sm:p-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="mb-8 overflow-hidden">
              <h2 className="text-2xl font-bold text-slate-800 tracking-tight">
                Welcome Back
              </h2>
              <p className="text-slate-400 text-sm mt-1">
                Enter your secure credentials to continue
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
                  <div className="space-y-5">
                    <AntForm.Item
                      validateStatus={errors.email && touched.email ? "error" : ""}
                      help={errors.email && touched.email ? errors.email : ""}
                      className="mb-0"
                    >
                      <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">
                        Admin Email
                      </label>
                      <Input
                        size="large"
                        prefix={<UserOutlined className="text-teal-600 mr-2" />}
                        placeholder="admin@example.com"
                        name="email"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.email}
                        className="!h-[52px] !rounded-xl !border-2 !border-slate-50 focus:!border-teal-500 !bg-slate-50/50 hover:!bg-slate-50 focus:!shadow-none transition-all font-medium text-slate-700 placeholder:text-slate-300"
                      />
                    </AntForm.Item>

                    <AntForm.Item
                      validateStatus={errors.password && touched.password ? "error" : ""}
                      help={errors.password && touched.password ? errors.password : ""}
                      className="mb-0"
                    >
                      <div className="flex justify-between items-center mb-2 ml-1">
                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
                          Access Key
                        </label>
                      </div>
                      <Input.Password
                        size="large"
                        prefix={<LockOutlined className="text-teal-600 mr-2" />}
                        placeholder="••••••••"
                        name="password"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.password}
                        className="!h-[52px] !rounded-xl !border-2 !border-slate-50 focus:!border-teal-500 !bg-slate-50/50 hover:!bg-slate-50 focus:!shadow-none transition-all font-medium text-slate-700 placeholder:text-slate-300"
                      />
                    </AntForm.Item>
                  </div>

                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={isSubmitting || loginMutation.status === "loading"}
                    className="w-full !h-[54px] !bg-[#006666] hover:!bg-[#004d4d] !border-none !text-white !font-bold !rounded-xl !shadow-xl !shadow-teal-900/10 transition-all transform active:scale-[0.98] mt-4 flex items-center justify-center gap-2 group"
                  >
                    <span>Authorize Access</span>
                    <SafetyCertificateOutlined className="group-hover:rotate-12 transition-transform" />
                  </Button>

                  <div className="pt-4 flex items-center justify-center gap-2 opacity-40">
                    <div className="w-1.5 h-1.5 rounded-full bg-teal-600"></div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Secure Encryption Active</span>
                  </div>
                </form>
              )}
            </Formik>
          </div>

          {/* Footer Copyright */}
          <div className="mt-12 text-center">
            <p className="text-slate-400 text-xs font-medium tracking-wide">
              © 2026 Admin Portal • All Rights Reserved
            </p>
          </div>
        </div>
      </div>
    )
  );
}

export default Page;