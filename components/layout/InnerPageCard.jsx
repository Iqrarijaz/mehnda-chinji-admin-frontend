import React from "react";
import MainHeader from "./MainHeader";

function InnerPageCard({ title, children }) {
  return (
    <>
      <MainHeader />
      <div className="bg-gray-100 min-h-screen p-4 ">
        <div className="m-4 rounded-2xl ">
          <h1 className="text-xl mb-4 font-mono">{title}</h1>
          <div>{children}</div>
        </div>
      </div>
    </>
  );
}

export default InnerPageCard;
