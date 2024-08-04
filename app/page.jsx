"use client";
import LoginCard from "@/components/login/card";
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
    if (isLogged && isLogged?.adminData) {
      router.push("/admin/dashboard/home");
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
        console.error("Invalid email or password", error); // Handle error
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
    <>
      {isMounted && (
        <div className="" style={{ height: "100vh" }}>
        {/* <AnimationFunction animationData={backgroundAnimation} height={"100vh"} width={"100%"} /> */}
          <div className="relative flex items-center justify-center h-full p-6">
            {loginMutation?.status === "loading" && <Loading />}
            <LoginCard>
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
                  <form onSubmit={handleSubmit} className="flex flex-col">
                    <label htmlFor="email" className="mb-2 custom-label">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.email}
                      className="min-h-8 p-2 rounded-lg border-none"
                    />
                    <p className="!text-red-500">
                      {errors.email && touched.email && errors.email}
                    </p>
                    <label
                      htmlFor="password"
                      className="mt-4 mb-2 custom-label"
                    >
                      Password
                    </label>
                    <input
                      type="password"
                      name="password"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.password}
                      className="mb-1 min-h-8 p-2 rounded-lg border-none"
                    />
                    <p className="!text-red-500">
                      {errors.password && touched.password && errors.password}
                    </p>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="mt-4 p-2 rounded-lg bg-secondary text-white font-sans font-semibold border-2 hover:bg-transparent hover:!text-secondary hover:!border-2 hover:!border-secondary"
                    >
                      Login
                    </button>
                  </form>
                )}
              </Formik>
            </LoginCard>
          </div>
        </div>
      )}
    </>
  );
}

export default Page;