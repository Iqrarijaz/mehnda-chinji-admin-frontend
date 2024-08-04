"use client";
import { GET_BUILDING_DETAILS } from "@/app/api/admin/buildings";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

function ViewBuilding() {
  const { id } = useParams();

  const [loading, setLoading] = useState(true);
  const [record, setRecord] = useState(null);

  useEffect(() => {
    const fetchBuildingDetails = async () => {
      try {
        const record = await GET_BUILDING_DETAILS(id);
        setRecord(record?.data);
      } catch (error) {
        console.error("Failed to fetch building details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBuildingDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="h-screen flex justify-center items-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="building_detail">
      <div className="flex building-detail-cover   flex-col w-full items-center rounded-xl overflow-hidden">
        <div className="relative w-full">
        <div className="banner_img">  
          <BuildingBannerImage record={record} />
        </div> 

          <div className="mb-3 mt-6">
            <label className="text-black font-[500] mb-1">Client Name</label>
            <p className="capitalize">{record?.clientDetail?.fullName}</p>
          </div>
          <div className="mb-3">
            <label className="text-black font-[500] mb-1">Client Email</label>
            <p className="capitalize">{record?.clientDetail?.email}</p>
          </div>
          <div className="mb-3">
            <label className="text-black font-[500] mb-1">Client Contact</label>
            <p className="capitalize">{record?.clientDetail?.phone}</p>
          </div>
          <div className="mb-3">
            <label className="text-black font-[500] mb-1">Primary Color</label>
            <p className="capitalize">{record?.clientDetail?.primaryColor}</p>
          </div>
        </div>
      </div>
      <div className="relative flex building-detail-cover flex-col mr-4 gap-4">
        <div className="building_logo_img">
          {record?.clientDetail?.logo && (
            <img
              src={record?.clientDetail?.logo}
              style={{ zIndex: 100000 }}
              width={100}
              height={100}
              className="rounded-full border-4 border-white"
              alt="Client Logo"
            />
          )}
          <div
            className="building_label"
            style={{ opacity: 1 }}
          >
            {record?.clientDetail?.companyName}
          </div>
        </div>

        <div className="mb-1">
          <label className="text-black font-[500] mb-1">Building Name</label>
          <p className="capitalize">{record?.name}</p>
        </div>
        <div className="mb-1">
          <label className="text-black font-[500] mb-1">
            Number of Apartment
          </label>
          <p className="">{record?.numberOfApartments}</p>
        </div>
        <div className="mb-1">
          <label className="text-black font-[500] mb-1">
            Building Contact Number
          </label>
          <p className="">
            {record?.phone
              ? record?.phone?.replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3")
              : " ---- "}
          </p>
        </div>
        {/* <div className="mb-3 flex flex-col">
          <label className="text-black font-[500] mb-1">Status</label>
          <span
            className={`${
              record?.status === "ACTIVE" ? "bg-green-500" : "bg-red-400"
            } max-w-[100px] flex justify-center items-center text-white p-1 rounded-[5px]`}
          >
            {record?.status}
          </span>
        </div> */}

        <div className="mb-3">
          <label className="text-black font-[500] mb-1">Building Address</label>
          <p className="capitalize">
            {record?.streetAddress +
              ", " +
              record?.city +
              ", " +
              record?.province +
              ", " +
              record?.country}
          </p>
        </div>

        <div className="mb-3">
          <label className="text-black font-[500] mb-1">
            Building Description
          </label>
          <p className="">{record?.description}</p>
        </div>
      </div>
    </div>
  );
}

export default ViewBuilding;

function BuildingBannerImage({ record }) {
  return (
    <>
      {record?.clientDetail?.backgroundImage && (
        <img
          src={record?.clientDetail?.backgroundImage}
          alt="Background Image"
          className="w-full h-full object-cover rounded-xl relative"
        />
      )}
      <div className="absolute flex flex-col status_btn">
        <span
          className={`${
            record?.status === "ACTIVE" ? "bg-green-500" : "bg-red-400"
          } max-w-[100px] flex justify-center items-center text-white p-1 rounded-[5px]`}
        >
          {record?.status}
        </span>
      </div>

    </>
  );
}
