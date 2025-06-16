"use client";
import React from "react";
import SearchInput from "@/components/InnerPage/SearchInput";
import SystemLogsTable from "./components/Table";
import SystemLogsContextProvider, {
  useSystemLogsContext,
} from "@/context/admin/developers/SystemLogsContext";
import { Select } from "antd";

function SystemLogs() {
  const { setFilters } = useSystemLogsContext(); // Accessing setFilters function from SystemLogsContext

  return (
    <>
      {/* Title and search input section */}
      <div className="flex flex-col md:flex-row justify-between mb-6">
        <h1 className="inner-page-title text-3xl text-black p-0 mb-4 md:mb-0">
          System Logs
        </h1>
        <div className="flex flex-col md:flex-row gap-4">
          {/* SearchInput component with setFilters prop */}
          <SearchInput setFilters={setFilters} />
        </div>
      </div>

      {/* Filtering section */}
      <div className="flex lg:justify-end mb-6 gap-10 justify-between">
        <div className="min-w-[160px]">
          {/* Select component for filtering by portal */}
          <Select
            className="focus:outline-none"
            defaultValue={"Admin"}
            style={{
              width: "100%",
              height: "40px !important",
            }}
            onChange={(value) => {
              if (value === null) {
                // Clearing advanced filter when "All" is selected
                setFilters((old) => ({
                  ...old,
                  advance: null,
                }));
              } else {
                // Setting advanced filter based on selected portal
                setFilters((old) => ({
                  ...old,
                  advance: {
                    portal: value,
                  },
                }));
              }
            }}
            options={[
              {
                value: "ADMIN",
                label: "Admin",
              },
              {
                value: "USER",
                label: "User",
              },
              {
                value: "WEBSITE",
                label: "Website",
              },
              {
                value: null,
                label: "All",
              },
            ]}
          />
        </div>
      </div>

      {/* Displaying SystemLogsTable component */}
      <SystemLogsTable />
    </>
  );
}

// ParentWrapper component to provide SystemLogsContext to SystemLogs component
export default function ParentWrapper() {
  return (
    <SystemLogsContextProvider>
      <SystemLogs />
    </SystemLogsContextProvider>
  );
}
