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
            <div className="w-16 h-16 bg-white rounded shadow-sm flex items-center justify-center mb-4 p-2">
              <img
                src="/icon.png"
                alt="Rehbar"
                className="w-full h-full object-contain"
              />
            </div>
            <h1 className="text-2xl font-bold text-[#006666]">
              Rehbar Admin
            </h1>
          </div>

          {/* Login Card */}
          <div className="bg-white rounded border border-gray-100 p-6 sm:p-8 shadow-sm">
            <div className="mb-6 text-center">
              <h2 className="text-xl font-bold text-[#006666]">
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
              }) => {
                const isLoading = isSubmitting || loginMutation.isLoading;
                
                return (
                <form onSubmit={handleSubmit} className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-[#006666] uppercase tracking-tight ml-1">
                      Email
                    </label>
                    <Input
                      prefix={<UserOutlined className="text-gray-400 mr-1 text-[10px]" />}
                      placeholder="admin@example.com"
                      name="email"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.email}
                      className="!h-[32px] !text-xs !rounded !border-slate-200 focus:!border-[#006666] hover:!border-[#006666] !shadow-none"
                    />
                    {errors.email && touched.email && (
                      <div className="text-red-500 text-[10px] font-medium ml-1">{errors.email}</div>
                    )}
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-[#006666] uppercase tracking-tight ml-1">
                      Password
                    </label>
                    <Input.Password
                      prefix={<LockOutlined className="text-gray-400 mr-1 text-[10px]" />}
                      placeholder="••••••••"
                      name="password"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.password}
                      className="!h-[32px] !text-xs !rounded !border-slate-200 focus:!border-[#006666] hover:!border-[#006666] !shadow-none"
                    />
                    {errors.password && touched.password && (
                      <div className="text-red-500 text-[10px] font-medium ml-1">{errors.password}</div>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full mt-5 !h-[32px] bg-[#006666] text-white !text-xs font-bold uppercase tracking-widest !rounded hover:bg-[#006666] focus:outline-none focus:ring-0 transition-none flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Signing In...</span>
                      </>
                    ) : (
                      "Sign In"
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