import { db } from "@/server/db";

export const getAttendance = async (team: string) => {
  const attendance = await db.attendance.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      location: true,
      startTime: true,
      endTime: true,
      status: true,
    },
  });

  const attendanceList =  attendance.map((att) => {
    return {
      id: att.id,
      name: att.name,
      email: att.email,
      location: att.location,
      startTime: att.startTime,
    };
  });

  return attendanceList;
};
