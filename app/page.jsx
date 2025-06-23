"use client";

import { Formik } from "formik";
import { message } from "antd";
import React, { useEffect, useState } from "react";
import * as Yup from "yup";
import { useRouter } from "next/navigation";
import UseMount from "@/hooks/useMount";
import Loading from "@/animations/homePageLoader";
import { useMutation } from "react-query";
import { LOGIN } from "./api/login";

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
      <div className="flex items-center justify-center h-screen">
        <Loading />
      </div>
    );
  }

  return (
    isMounted && (
      <div className="flex items-center justify-center w-full h-[100vh]">
        {/* Left Section */}
        <div className="hidden md:flex w-1/2 h-full items-center justify-center bg-gradient-to-br from-purple-700 to-gray-900 p-8 relative">
          <div className="text-white text-center">
            <h2 className="text-4xl font-bold mb-4">
              Welcome Back to Mehnda Chinji
            </h2>
            <p className="text-lg">Please log in to continue</p>
          </div>
        </div>

        {/* Right Section */}
        <div className="w-full md:w-1/2 h-full p-12 flex flex-col justify-center bg-white">
          <div className="bg-white rounded-lg shadow-lg p-8 border border-gray-200">
            <h2 className="text-2xl text-gray-800 font-bold mb-6">Login</h2>
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
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.email}
                    className="w-full p-3 rounded-md border border-gray-300 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  <p className="text-red-500 text-sm">
                    {errors.email && touched.email && errors.email}
                  </p>

                  <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.password}
                    className="w-full p-3 rounded-md border border-gray-300 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  <p className="text-red-500 text-sm">
                    {errors.password && touched.password && errors.password}
                  </p>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-purple-500 text-white p-3 rounded-md hover:bg-purple-600 transition-all"
                  >
                    Login
                  </button>
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