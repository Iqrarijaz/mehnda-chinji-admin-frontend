import EditEmailTemplateClient from "./EditEmailTemplateClient";

export function generateStaticParams() {
  return [{ id: "id" }];
}

export const dynamicParams = false;

export default function Page() {
  return <EditEmailTemplateClient />;
}
