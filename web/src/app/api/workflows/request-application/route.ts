import { NextResponse } from "next/server";
import { getRequestApplicationGuide } from "@/lib/workflow-service";

export async function GET() {
  const data = await getRequestApplicationGuide();
  return NextResponse.json(data);
}
