import { NextResponse } from "next/server";
import { toggleSavedItem } from "@/lib/action-service";

export async function POST() {
  const result = await toggleSavedItem();
  return NextResponse.json(result);
}
