import { NextResponse } from "next/server";
import { getSubmissionCenterData } from "@/lib/workflow-service";

export async function GET() {
  const data = await getSubmissionCenterData();
  return NextResponse.json(data);
}
