import { notFound } from "next/navigation";
import Controles from "./clientPage";
import ControlsPage2 from "./clientPage2";

export default async function Page({
  searchParams,
}: {
  searchParams?: { template?: string };
}) {
  if (!searchParams?.template) notFound();
  // return <Controles idTemplate={searchParams.template} />;
  return <ControlsPage2 idTemplate={searchParams.template} />;
}
