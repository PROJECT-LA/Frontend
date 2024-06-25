import ControlsPage from "./clientPage";

export default async function Page({
  searchParams,
}: {
  searchParams?: { template?: string };
}) {
  if (searchParams?.template) {
    return <ControlsPage exists={true} idTemplate={searchParams.template} />;
  } else {
    return <ControlsPage exists={false} />;
  }
}
