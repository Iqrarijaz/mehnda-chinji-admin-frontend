"use client";
import React, { useState } from "react";
import { Upload, Button, Input, message, Card } from "antd";
import { InboxOutlined, CopyOutlined, CheckOutlined } from "@ant-design/icons";
import { UPLOAD_PUBLIC_IMAGE } from "@/app/api/admin/public";
import { toast } from "react-toastify";

const { Dragger } = Upload;

export default function ImageUploadPage() {
    const [imageUrl, setImageUrl] = useState("");
    const [isUploading, setIsUploading] = useState(false);
    const [copied, setCopied] = useState(false);

    const handleUpload = async (options) => {
        const { file, onSuccess, onError } = options;
        const formData = new FormData();
        formData.append("image", file);

        setIsUploading(true);
        try {
            const response = await UPLOAD_PUBLIC_IMAGE(formData);
            if (response.success) {
                const url = response.data.imageUrl;
                setImageUrl(url);
                onSuccess(response.data);
                toast.success("Image uploaded successfully!");
            } else {
                throw new Error(response.message || "Upload failed");
            }
        } catch (error) {
            console.error("Upload error:", error);
            onError(error);
            toast.error(error.message || "Failed to upload image.");
        } finally {
            setIsUploading(false);
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(imageUrl);
        setCopied(true);
        message.success("URL copied to clipboard!");
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="max-w-3xl mx-auto py-8">
            <Card className="shadow-sm border-gray-100 dark:border-slate-800 dark:bg-slate-900">
                <div className="mb-8 text-center">
                    <h2 className="text-xl font-semibold mb-2 text-slate-800 dark:text-slate-100">
                        Quick Image Upload
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Upload icons or images to get a direct URL for use in configurations.
                    </p>
                </div>

                <Dragger
                    customRequest={handleUpload}
                    showUploadList={false}
                    disabled={isUploading}
                    className="mb-8 !border-dashed !border-2 hover:!border-primary dark:!bg-slate-800/50"
                >
                    <p className="ant-upload-drag-icon">
                        <InboxOutlined className="text-primary" />
                    </p>
                    <p className="ant-upload-text dark:text-slate-200">
                        Click or drag file to this area to upload
                    </p>
                    <p className="ant-upload-hint dark:text-slate-400 px-4">
                        Support for a single image upload. Once uploaded, the URL will appear below.
                    </p>
                </Dragger>

                {imageUrl && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
                        <div className="p-4 bg-gray-50 dark:bg-slate-800 rounded-lg border border-gray-100 dark:border-slate-700">
                            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wider">
                                Image Preview
                            </label>
                            <div className="flex justify-center bg-white dark:bg-slate-900 p-4 rounded border border-gray-200 dark:border-slate-700">
                                <img 
                                    src={imageUrl} 
                                    alt="Uploaded" 
                                    className="max-h-48 object-contain"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                Image URL
                            </label>
                            <div className="flex gap-2">
                                <Input
                                    value={imageUrl}
                                    readOnly
                                    className="!bg-gray-50 dark:!bg-slate-800 dark:!text-slate-200 dark:!border-slate-700"
                                />
                                <Button
                                    type="primary"
                                    onClick={copyToClipboard}
                                    icon={copied ? <CheckOutlined /> : <CopyOutlined />}
                                    className="bg-primary hover:bg-primary/90"
                                >
                                    {copied ? "Copied" : "Copy URL"}
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </Card>
        </div>
    );
}
