import { db } from "@/server/db";
import * as z from "zod";
import { NextRequest, NextResponse } from "next/server";

const attendanceSchema = z.object({
  name: z.string().min(3).max(25),
  email: z.string().email(),
  location: z.string().min(3).max(25),
  startTime: z.coerce.date(),
  endTime: z.coerce.date(),
});

export async function POST(req: NextRequest) {
  try {

    const json = await req.json();
    const body = attendanceSchema.parse(json);


    const attendance = await db.attendance.create({
      data: {
        name: body.name,
        email: body.email,
        location: body.location,
        startTime: body.startTime,
        endTime: body.endTime,
      },
    });

    return NextResponse.json(attendance);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 422 });
    }

    return NextResponse.json({ error }, { status: 500 });
  }
}