import { NextRequest, NextResponse } from "next/server";
import { loggr } from "./main";

export async function POST(req: NextRequest) {
  const body = await req.json();
  try {
    const { message, result, status = 400 } = await loggr(body.input);
    return NextResponse.json({ message, result });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
