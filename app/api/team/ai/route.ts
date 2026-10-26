import { NextRequest, NextResponse } from "next/server";
import { loggr } from "./main";
import { getServerSession } from "next-auth";
import { authOptions } from "@/server/auth";
import { isDateKey } from "@/lib/date";
import { getRequestTodayKey } from "@/server/timezone";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) return NextResponse.json({ error: "Unauthorized! You are not logged in." }, { status: 403 });

    const { today, ...body } = await req.json();
    const todayKey = isDateKey(today) ? today : await getRequestTodayKey();
    const { message, result, status } = await loggr(JSON.stringify(body), todayKey);

    return NextResponse.json({ message, result }, { status });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
