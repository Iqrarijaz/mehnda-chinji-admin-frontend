import EditClientClient from "./EditClientClient";

export function generateStaticParams() {
  return [{ id: "id" }];
}

export const dynamicParams = false;

export default function Page() {
  return <EditClientClient />;
}
