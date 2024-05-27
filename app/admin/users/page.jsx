"use client";
import Loading from "@/animations/homePageLoader";
import UserTable from "@/components/Tables/UserTable";
import UseMount from "@/hooks/useMount";
import React from "react";

function Users() {
  const isMounted = UseMount();
  return (
    <div className="flex flex-col">
      <div className="justify-between flex mb-4">
        <h1 className="text-xl text-gray-500 font-sans font-bold ">Users</h1>
        <div>
          <input
            class="px-3 py-2 border border-gray-400 rounded-2xl focus:border-gray-500"
            type="text"
            placeholder="Search"
          />
        </div>
      </div>
      <div className="relative min-h-[400px] bg-gray-200 rounded-3xl p-3">
        {!isMounted ? <Loading /> : <UserTable />}
      </div>{" "}
    </div>
  );
}

export default Users;
