import { db } from "@/server/db";
import * as z from "zod";
import { NextRequest, NextResponse } from "next/server";

const attendanceSchema = {
  name: z.string().min(3).max(25),
  email: z.string().email(),
  location: z.string().min(3).max(25),
  startTime: z.coerce.date().optional(),
  endTime: z.coerce.date().optional(),
  status: z.boolean(),
};

const addAttendanceSchema = z.object(attendanceSchema);

export async function POST(req: NextRequest) {
  try {

    const json = await req.json();
    const body = addAttendanceSchema.parse(json);

    const currentDate = body.startTime && new Date(body.startTime);

    const attendance = await db.attendance.create({
      data: {
        name: body.name,
        email: body.email,
        location: body.location,
        startTime: currentDate,
        endTime: body.endTime,
        status: body.status,
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
