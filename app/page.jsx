"use client";
import LoginCard from "@/components/login/card";
import TopAnimation from "@/components/login/topAnimation";
import { Formik } from "formik";
import React from "react";

function Page() {
  return (
    <div className="bg-image" style={{ height: "100vh" }}>
      <div className="flex items-center justify-center h-full m-4">
        <LoginCard>
          <Formik
            initialValues={{ email: "", password: "" }}
            validate={(values) => {
              const errors = {};
              if (!values.email) {
                errors.email = "Required";
              } else if (
                !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
              ) {
                errors.email = "Invalid email address";
              }
              return errors;
            }}
            onSubmit={(values, { setSubmitting }) => {
              setTimeout(() => {
                alert(JSON.stringify(values, null, 2));
                setSubmitting(false);
              }, 400);
            }}
          >
            {({
              values,
              errors,
              touched,
              handleChange,
              handleBlur,
              handleSubmit,
              isSubmitting,
              /* and other goodies */
            }) => (
              <form onSubmit={handleSubmit} className="flex flex-col">
                <label
                  htmlFor="email"
                  className="mb-2 font-sans text-lg font-semibold"
                >
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
                  {" "}
                  {errors.email && touched.email && errors.email}
                </p>
                <label
                  htmlFor="password"
                  className="mt-4 mb-2 font-sans text-lg font-semibold"
                >
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.password}
                  className="mb-4 min-h-8 p-2 rounded-lg border-none"
                />
                {errors.password && touched.password && errors.password}
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
