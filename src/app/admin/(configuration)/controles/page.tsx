import { notFound } from "next/navigation";
import Controles from "./clientPage";

export default async function Page({
  searchParams,
}: {
  searchParams?: { template?: string };
}) {
  if (!searchParams?.template) notFound();
  return <Controles idTemplate={searchParams.template} />;
}
