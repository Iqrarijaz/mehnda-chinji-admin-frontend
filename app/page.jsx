"use client";
import { Formik } from "formik";
import { Input } from "antd";
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

import { getFirstAuthorizedRoute } from "@/utils/permissions";

function Page() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const isMounted = UseMount();

  useEffect(() => {
    const isLogged = localStorage.getItem("userData");
    if (isLogged) {
      const destination = getFirstAuthorizedRoute();
      router.push(destination);
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
        const destination = getFirstAuthorizedRoute();
        router.push(destination);
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
      <div className="flex items-center justify-center h-screen bg-gray-50 dark:bg-slate-950 transition-colors duration-500">
        <Loading />
      </div>
    );
  }

  return (
    isMounted && (
      <div className="min-h-screen w-full bg-gray-50 dark:bg-slate-950 flex items-center justify-center p-4 transition-colors duration-500">
        <div className="w-full max-w-sm animate-in fade-in zoom-in duration-700">
          {/* Logo Section */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-white dark:bg-slate-900 rounded shadow-sm dark:shadow-teal-500/10 flex items-center justify-center mb-4 p-2 border border-transparent dark:border-slate-800 transition-all duration-300">
              <img
                src="/icon.png"
                alt="Rehbar"
                className="w-full h-full object-contain"
              />
            </div>
            <h1 className="text-2xl font-black text-[#006666] dark:text-teal-500 tracking-tight transition-colors duration-300">
              Rehbar Admin
            </h1>
          </div>

          {/* Login Card */}
          <div className="bg-white dark:bg-slate-900/50 backdrop-blur-sm rounded border border-gray-100 dark:border-slate-800 p-6 sm:p-8 shadow-sm dark:shadow-xl transition-all duration-300">
            <div className="mb-6 text-center">
              <h2 className="text-xl font-bold text-[#006666] dark:text-teal-500 transition-colors duration-300">
                Welcome Back
              </h2>
              <p className="text-gray-500 dark:text-slate-400 text-xs font-medium mt-1 transition-colors duration-300">
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
              }) => {
                const isLoading = isSubmitting || loginMutation.isLoading;
                
                return (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-[#006666] dark:text-teal-500 uppercase tracking-widest ml-1 transition-colors duration-300">
                      Email Address
                    </label>
                    <Input
                      prefix={<UserOutlined className="text-gray-400 dark:text-slate-500 mr-1 text-[10px]" />}
                      placeholder="admin@rehbar.com"
                      name="email"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.email}
                      className="!h-[36px] !text-xs !rounded !border-slate-200 dark:!border-slate-800 dark:!bg-slate-900/50 dark:!text-slate-200 focus:!border-[#006666] dark:focus:!border-teal-500 hover:!border-[#006666] dark:hover:!border-teal-500 !shadow-none transition-all duration-300"
                    />
                    {errors.email && touched.email && (
                      <div className="text-red-500 dark:text-red-400 text-[10px] font-bold mt-1 ml-1 animate-in fade-in slide-in-from-top-1">{errors.email}</div>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-[#006666] dark:text-teal-500 uppercase tracking-widest ml-1 transition-colors duration-300">
                      Security Password
                    </label>
                    <Input.Password
                      prefix={<LockOutlined className="text-gray-400 dark:text-slate-500 mr-1 text-[10px]" />}
                      placeholder="••••••••"
                      name="password"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.password}
                      className="!h-[36px] !text-xs !rounded !border-slate-200 dark:!border-slate-800 dark:!bg-slate-900/50 dark:!text-slate-200 focus:!border-[#006666] dark:focus:!border-teal-500 hover:!border-[#006666] dark:hover:!border-teal-500 !shadow-none transition-all duration-300"
                    />
                    {errors.password && touched.password && (
                      <div className="text-red-500 dark:text-red-400 text-[10px] font-bold mt-1 ml-1 animate-in fade-in slide-in-from-top-1">{errors.password}</div>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full mt-6 !h-[36px] bg-[#006666] dark:bg-teal-600 text-white !text-[11px] font-black uppercase tracking-[0.15em] !rounded hover:bg-[#005555] dark:hover:bg-teal-500 focus:outline-none focus:ring-0 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-teal-900/20 active:scale-[0.98]"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span className="animate-pulse">Authenticating...</span>
                      </>
                    ) : (
                      "Sign In Account"
                    )}
                  </button>
                </form>
              )}}
            </Formik>
          </div>
        </div>
      </div>
    )
  );
}

export default Page;