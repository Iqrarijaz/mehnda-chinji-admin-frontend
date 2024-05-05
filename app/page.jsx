import InnerPageCard from "@/components/layout/InnerPageCard";
import React from "react";

function page() {
  return (
    <InnerPageCard title="Home Page">
      <h1 className="text-3xl font-base  font-serif ">
        Hello world!
      </h1>
      <h1 className="text-3xl font-base  font-mono ">
        Hello world!
      </h1>
      <h1 className="text-3xl font-base  font-sans ">
        Hello world!
      </h1>
      
    </InnerPageCard>
  );
}

export default page;
