"use client";
import { useParams } from "next/navigation";
import React from "react";

function ViewClientClient() {
    const params = useParams();
    const { id } = params;

    return (
        <div >
            <div className="mb-4 flex justify-between">
                <h1 className="inner-page-title text-3xl text-black p-0">
                    Client Details
                </h1>
            </div>
        </div>
    );
}

export default ViewClientClient;
