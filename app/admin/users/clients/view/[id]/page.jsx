"use client";
import { useParams } from "next/navigation";
import { useLoaderData } from "next/server";

 async function ViewClient() {
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

// export async function page({ params }) {
//   return {
//     props: params,
//   };
// }

export default ViewClient;