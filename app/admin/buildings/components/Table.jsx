"use client";
import { Pagination, Table } from "antd";
import React, { useState } from "react";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { FaEdit } from "react-icons/fa";
import Loading from "@/animations/homePageLoader";
import { Switch } from "antd";
import { useRouter } from "next/navigation";
import { timestampToDate } from "@/utils/date";
import { useMutation, useQueryClient } from "react-query";
import { toast } from "react-toastify";
import { CustomPopover } from "@/components/popHover";
import { popoverContent } from "@/components/popHover/popHoverContent";
import DeleteClientModal from "./DeleteModal";
import { useBuildingContext } from "@/context/admin/buildings/BuildingContext";
import { PATH_ROUTER } from "@/routes";
import { MANAGE_BUILDING_STATUS } from "@/app/api/admin/buildings";

function BuildingTable() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { buildingsList, onChange, setFilters } = useBuildingContext();

  const [isModalOpen, setIsModalOpen] = useState({
    name: null,
    state: false,
    record: null,
  });

  // React Query mutation for managing building status
  const manageStatusMutation = useMutation({
    mutationFn: async (data) => {
      return await MANAGE_BUILDING_STATUS(data);
    },
    onSuccess: (data) => {
      // Invalidate buildings list query to refetch data
      queryClient.invalidateQueries(["buildingsList"]);
      toast.success(data?.message);
    },
    onError: (error) => {
      console.error("Error:", error);
      toast.error(error?.response?.data?.error);
    },
  });

  // Function to handle status change of a building
  function handleStatus(data) {
    try {
      manageStatusMutation.mutate({ _id: data?._id });
    } catch (error) {
      console.log(error);
    }
  }

  // Function to handle sorting of table columns
  function handleSorting(pagination, filters, sorter) {
    const sortingKey = sorter.field;
    const sortOrder = sorter.order === "ascend" ? 1 : -1;

    // Update filters context state with sorting options
    setFilters((prevFilters) => ({
      ...prevFilters,
      sortingKey,
      sortOrder,
    }));
  }

  // Action menu items for the table row popover
  const actionMenu = [
    {
      heading: "View",
      icon: <HiOutlineDotsHorizontal size={16} />,
      handleFunction: (record) => {
        router.push(`${PATH_ROUTER?.VIEW_BUILDING}/${record._id}`);
      },
    },
    {
      heading: "Edit",
      icon: <FaEdit size={16} />,
      handleFunction: (record) => {
        router.push(`${PATH_ROUTER?.EDIT_BUILDING}/${record._id}`);
      },
    },
    {
      heading: "Delete",
      icon: <FaEdit size={16} />,
      handleFunction: (record) => {
        setIsModalOpen({ name: "delete", state: true, record });
      },
    },
  ];

  // Columns configuration for the Ant Design Table
  const columns = [
    {
      title: "Building Name",
      dataIndex: "name",
      key: "name",
      sorter: {
        multiple: 1, // Enable multiple column sorting
      },
      width: 200,
      render: (text) => (
        <div className="capitalize overflow-hidden whitespace-nowrap">
          {text}
        </div>
      ),
    },
    {
      title: "Company Name",
      dataIndex: "companyName",
      key: "companyName",
      width: 200,
      render: (text) => (
        <div className="capitalize overflow-hidden whitespace-nowrap">
          {text}
        </div>
      ),
    },
    {
      title: "Building Contact",
      dataIndex: "phone",
      key: "phone",
      width: 160,
      render: (text) => {
        const formattedPhone = text?.replace(
          /(\d{3})(\d{3})(\d{4})/,
          "$1-$2-$3"
        );
        return (
          <div className="overflow-hidden whitespace-nowrap">
            {formattedPhone}
          </div>
        );
      },
    },
    {
      title: "City",
      dataIndex: "city",
      key: "city",
      width: 160,
      render: (text) => (
        <div className="capitalize overflow-hidden whitespace-nowrap">
          {text}
        </div>
      ),
    },
    {
      title: "Country",
      dataIndex: "country",
      key: "country",
      width: 160,
      render: (text) => (
        <div className="capitalize overflow-hidden whitespace-nowrap">
          {text}
        </div>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      align: "center",
      key: "status",
      width: 160,
      render: (text, record) => (
        <div className="flex justify-center">
          {text === "ACTIVE" ? (
            <Switch checked={true} onClick={() => handleStatus(record)} />
          ) : (
            <Switch
              onClick={() => handleStatus(record)}
              checked={false}
              style={{ backgroundColor: "red" }}
            />
          )}
        </div>
      ),
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 120,
      render: (text) => (
        <div className="overflow-hidden whitespace-nowrap">
          {timestampToDate(text)}
        </div>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      fixed: "right",
      width: 100,
      align: "center",
      render: (record) => (
        <CustomPopover
          triggerContent={
            <HiOutlineDotsHorizontal
              size={34}
              className="hover:text-lightBlue"
            />
          }
          popoverContent={() => popoverContent(actionMenu, record)} // Pass record to popoverContent
        />
      ),
    },
  ];

  return (
    <>
      {/* Ant Design Table */}
      <Table
        responsive
        rowClassName={(record, index) =>
          index % 2 === 0 ? "table-row-light" : "table-row-dark"
        }
        className="antd-table-custom rounded-xl"
        size="small"
        tableLayout="fixed"
        bordered
        scroll={{ x: 1200 }}
        loading={{
          spinning:
            buildingsList?.status === "loading" ||
            manageStatusMutation?.status === "loading",
          indicator: <Loading />,
        }}
        columns={columns}
        dataSource={buildingsList?.data?.data}
        pagination={false}
        onChange={handleSorting} // Handle sorting changes
      />
      {/* Pagination component */}
      <Pagination
        className="flex justify-end mt-4"
        pageSize={buildingsList?.data?.pagination?.itemsPerPag}
        total={buildingsList?.data?.pagination?.totalItems}
        current={buildingsList?.data?.pagination?.currentPage}
        onChange={(e) => {
          console.log("e", e);
          onChange({
            currentPage: Number(e),
          });
        }}
      />
      {/* DeleteClientModal component */}
      <DeleteClientModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
      />
    </>
  );
}

export default BuildingTable;
