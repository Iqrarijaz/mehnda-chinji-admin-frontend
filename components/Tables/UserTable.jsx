" use client";
import { Select, Table } from "antd";
import React from "react";
import { FaEllipsisVertical } from "react-icons/fa6";
import { HiOutlineDotsHorizontal } from "react-icons/hi";

function UserTable() {
  const dataSource = [
    {
      key: "1",
      name: "Mike",
      age: 32,
      address: "10 Downing Street",
      address: "10 Downing Street",

      field1: "Value1",
      field2: "Value2",
      field3: "Value3",
      field4: "Value4",
    },
    {
      key: "2",
      name: "John",
      age: 42,
      address: "10 Downing Street",

      address: "10 Downing Street",

      field1: "Value5",
      field2: "Value6",
      field3: "Value7",
      field4: "Value8",
    },
    {
      key: "3",
      name: "John",
      age: 42,
      address: "10 Downing Street",
      address: "10 Downing Street",

      field1: "Value5",
      field2: "Value6",
      field3: "Value7",
      field4: "Value8",
    },
    {
      key: "4",
      name: "John",
      age: 42,
      address: "10 Downing Street",
      address: "10 Downing Street",

      field1: "Value5",
      field2: "Value6",
      field3: "Value7",
      field4: "Value8",
    },
  ];

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Age",
      dataIndex: "age",
      key: "age",
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "Field 1",
      dataIndex: "field1",
      key: "field1",
    },
    {
      title: "Field 2",
      dataIndex: "field2",
      key: "field2",
    },
    {
      title: "Field 3",
      dataIndex: "field3",
      key: "field3",
    },
    {
      title: "Field 4",
      dataIndex: "field4",
      key: "field4",
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      render: () => (
        <>
          <div className="d-flex relative justify-center items-center bg-red-600 w-[100px]">
            <div
              style={{
                position: "absolute",
                zIndex: 1,
                display: "flex",
                justifyContent: "center",
                width: "100%",
              }}
            >
              <HiOutlineDotsHorizontal
                size={20}
                style={{
                  cursor: "pointer",
                }}
              />
            </div>
            <Select
              defaultValue={""}
              className="w-full cursor-pointer"
              style={{ opacity: 1 }}
              value={""}
              onChange={(value) => {}}
            >
              <Select.Option value="View">View</Select.Option>
              <Select.Option value="Delete">Delete</Select.Option>
            </Select>
          </div>
        </>
      ),
    },
  ];

  return (
    <>
      {
        <div className="overflow-x-auto" style={{ overflowX: "auto" }}>
          <Table
            className="bg-gray-200"
            rowClassName={(record, index) =>
              index % 2 === 0 ? "table-row-light" : "table-row-dark"
            }
            pagination={{}}
            onChange={(e) => {}}
            columns={columns}
            dataSource={dataSource}
          />
        </div>
      }
    </>
  );
}

export default UserTable;
