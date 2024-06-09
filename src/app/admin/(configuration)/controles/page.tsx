import { notFound } from "next/navigation";
import Controles from "./clientPage";
import ControlsPage2 from "./clientPage2";

export default async function Page({
  searchParams,
}: {
  searchParams?: { template?: string };
}) {
  let existsId: boolean = false;
  if (searchParams?.template) {
    return <ControlsPage2 exists={true} idTemplate={searchParams.template} />;
  } else {
    return <ControlsPage2 exists={false} />;
  }
}
