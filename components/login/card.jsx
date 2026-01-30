import React from "react";

function LoginCard({ children }) {
  return (
    <div className="bg-gray-100 h-auto rounded w-[500px] p-10 ">
      <div className="text-center mb-10">
        {/* <h1 className="text-xl font-sans text-black font-bold mb-2">
          Welcome to
        </h1>
        <h1 className="text-3xl font-sans text-secondary font-bold">
          Admin Panel
        </h1> */}
      </div>
      <div>{children}</div>
    </div>
  );
}

export default LoginCard;
