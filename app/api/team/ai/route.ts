import { NextRequest, NextResponse } from "next/server";
import { loggr } from "./main";
import { getServerSession } from "next-auth";
import { authOptions } from "@/server/auth";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) return NextResponse.json({ error: "Unauthorized! You are not logged in." }, { status: 403 });

    const body = await req.json();
    const { message, result } = await loggr(JSON.stringify(body));

    return NextResponse.json({ message, result });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
