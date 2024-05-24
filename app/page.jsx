"use client";
import LoginCard from "@/components/login/card";
import { Formik } from "formik";
import React from "react";
import * as Yup from "yup";

const initialValues = {
  email: "",
  password: "",
};

const validationSchema = Yup.object({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
});

function Page() {
  function handleLoginSubmit(values, { setSubmitting }) {
    console.log("login", values);
    localStorage.setItem("login", "true");
    setSubmitting(false); // Set submitting to false after login process
    window.location.href = "/admin/dashboard/home";
  }

  return (
    <div className="bg-image" style={{ height: "100vh" }}>
      <div className="flex items-center justify-center h-full p-6">
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
                <label htmlFor="password" className="mt-4 mb-2 custom-label">
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
                  className="mt-4 p-2 rounded-lg bg-primary text-white font-sans font-semibold border-2 hover:bg-transparent hover:!text-primary hover:!border-2 hover:!border-primary"
                >
                  Login
                </button>
              </form>
            )}
          </Formik>
        </LoginCard>
      </div>
    </div>
  );
}

export default Page;
