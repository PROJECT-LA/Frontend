import ControlsPage from "./clientPage";

export default async function Page({
  searchParams,
}: {
  searchParams?: { template?: string };
}) {
  return <ControlsPage idTemplate={searchParams?.template ?? ""} />;
}
