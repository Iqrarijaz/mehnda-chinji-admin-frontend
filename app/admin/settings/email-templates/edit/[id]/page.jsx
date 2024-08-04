"use client";
import React, { useRef, useState } from "react";
import { useQuery, useMutation } from "react-query";
import { useParams, useRouter } from "next/navigation";
import EmailEditor from "react-email-editor";
import { toast } from "react-toastify";
import { Button } from "antd";
import Link from "next/link";
import Loading from "@/animations/homePageLoader";
import {
  GET_EMAIL_TEMPLATE,
  UPDATE_EMAIL_TEMPLATE,
} from "@/app/api/admin/settings/emailTemplates";

function EditEmailTemplate() {
  const router = useRouter();
  const emailEditorRef = useRef(null);
  const [emailTemplateData, setEmailTemplateData] = useState(null);
  const { id } = useParams();

  const getEmailTemplate = useQuery({
    queryKey: ["getEmailTemplate", JSON.stringify(id)],
    queryFn: async () => {
      return await GET_EMAIL_TEMPLATE(id);
    },
    enabled: !!id,
    onSuccess: (data) => {
      setEmailTemplateData(data?.data);
    },
    onError: (error) => {
      console.error("Error fetching data:", error);
      toast.error("Something went wrong. Please try again later.");
    },
  });

  function exportHtml() {
    const editor = emailEditorRef.current?.editor;
    return new Promise((resolve, reject) => {
      editor?.exportHtml((data) => {
        const { design, html } = data;
        resolve({ html, design });
      });
    });
  }
  function onReady(unlayer) {
    emailEditorRef.current = { editor: unlayer };
    const json = getEmailTemplate?.data?.data?.template?.body_json ?? "";
    unlayer.loadDesign(json);
  }

  const updateEmailTemplateMutation = useMutation({
    mutationFn: async (data) => {
      return await UPDATE_EMAIL_TEMPLATE(data);
    },
    onSuccess: (data) => {
      toast.success("Email template updated successfully");
      router.push("/admin/settings/email-templates");
    },
    onError: (error) => {
      console.log(error);
      toast.error(
        error?.response?.data?.error ??
          "Something went wrong. Please try again later."
      );
    },
  });

  async function handleOnUpdate() {
    try {
      const { html, design } = await exportHtml();
      setEmailTemplateData((prevData) => ({
        ...prevData,
        template: {
          ...prevData?.template,
          body_json: html,
        },
      }));
      updateEmailTemplateMutation.mutate({
        ...emailTemplateData,
        template: {
          ...emailTemplateData.template,
          body: html,
          body_json: design,
        },
      });
    } catch (error) {
      console.error("Error exporting HTML:", error);
    }
  }

  async function handleOnUpdate() {
    try {
      const { html, design } = await exportHtml();
      updateEmailTemplateMutation.mutate({
        ...emailTemplateData,
        body: html,
        body_json: design,
      });
    } catch (error) {
      console.error("Error exporting HTML:", error);
    }
  }

  return (
    <div>
      <div className="mb-4 flex justify-between">
        <h1 className="inner-page-title text-3xl text-black p-0">
          Edit Email Template
        </h1>
      </div>
      {getEmailTemplate.isLoading && <Loading />}{" "}
      {updateEmailTemplateMutation.isLoading && <Loading />}
      <div className="bg-gray-100 p-6 rounded-xl w-full overflow-x-auto">
        <div className="form-class mx-auto lg:flex lg:gap-6 ">
          <div className="flex flex-col gap-4 flex-1 lg:w-70">
            <div className="flex flex-wrap">
              <p className="text-black font-[500] mb-1">Template Name</p>
              <input
                type="text"
                value={emailTemplateData?.templateName || ""}
                disabled
                className="formit-input border-2 border-lightBlue focus:outline-none"
                name="name"
              />
            </div>

            <div className="flex flex-wrap">
              <p className="text-black font-[500] mb-1">Template Subject</p>
              <input
                type="text"
                className="formit-input border-2 border-lightBlue focus:outline-none mb-3"
                name="subject"
                value={emailTemplateData?.template?.subject || ""}
                onChange={(e) => {
                  setEmailTemplateData((prevData) => ({
                    ...prevData,
                    template: {
                      ...prevData?.template,
                      subject: e.target.value,
                    },
                  }));
                }}
              />
            </div>
          </div>
          <div className="lg:w-1/3">
            {emailTemplateData?.template?.field?.length > 0 && (
              <>
                <p className="text-black font-[500] mb-1">PlaceHolders</p>
                <table className="table-auto w-full place-holder-table">
                  <tbody>
                    {emailTemplateData?.template?.field.map((item, index) => (
                      <tr key={index}>
                        <td className="px-2 py-2">{item}</td>
                        <td className="px-2 py-2">
                          {emailTemplateData?.template.field[index + 1] || ""}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
            )}
          </div>
        </div>
        <div className="mt-6">
          {
            <EmailEditor
              ref={emailEditorRef}
              onReady={onReady}
              onLoad={onReady}
            />
          }
        </div>
      </div>
      <div className="flex justify-end mt-8 gap-6">
        <Link
          href="/admin/settings/email-templates"
          className="bg-lightBlue h-9 flex items-center  hover:bg-white border-lightBlue hover:text-red-500 hover:border-red-500 text-white font-bold py-2 px-10 rounded-xl"
        >
          Cancel
        </Link>
        <Button
          type="primary"
          onClick={handleOnUpdate}
          className="bg-lightBlue hover:bg-white border-lightBlue hover:text-black !hover:border-black text-white font-bold py-4 px-10 rounded-xl"
        >
          Update
        </Button>
      </div>
    </div>
  );
}

export default EditEmailTemplate;
