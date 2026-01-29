import EditTenantClient from "./EditTenantClient";

export function generateStaticParams() {
  return [{ id: "id" }];
}

export const dynamicParams = false;

export default function Page() {
  return <EditTenantClient />;
}
