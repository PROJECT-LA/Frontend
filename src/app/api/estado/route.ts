import { commitDate, commitID, nombreRama } from "@/utils/vcsinfo";
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    estado: `Servicio funcionando correctamente 🙌`,
    hora: new Date().getTime(),
    b: await nombreRama(),
    cid: await commitID(),
    cd: await commitDate(),
  });
}
