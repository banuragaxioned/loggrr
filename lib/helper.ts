// Get initials from name
export function getInitials(name: string): string {
  const initials = name
    .match(/(^\S\S?|\s\S)?/g)
    ?.map((v) => v.trim())
    .join("")
    .match(/(^\S|\S$)?/g)
    ?.join("")
    .toLocaleUpperCase();

  return initials ?? "";
}

/**
 * This function converts a time string in the format of HH:mm or HH.mm to minutes
 * getTimeInMinutes('0') // Output: 0
 * getTimeInMinutes('0.5') // Output: 30
 * getTimeInMinutes('0:50') // Output: 50
 * getTimeInMinutes('1.75') // Output: 105
 * getTimeInMinutes('1:30') // Output: 90
 * getTimeInMinutes('1.5') // Output: 90
 * getTimeInMinutes('2.25') // Output: 135
 * getTimeInMinutes('12:00') // Output: 720
 * getTimeInMinutes('7.5') // Output: 450
 * getTimeInMinutes('7:30') // Output: 450
 * thigetTimeInMinutes('3') // Output: 180 TODO: this edge case doesn't work yet
 */
export const getTimeInMinutes = (logTime: string): number => {
  try {
    const isHourMinFormat = logTime.includes(":") || /^\d+$/.test(logTime);
    const timeArr = isHourMinFormat ? logTime.split(":") : logTime.split(".");

    if (timeArr.length !== 2 || isNaN(Number(timeArr[0])) || isNaN(Number(timeArr[1]))) {
      // Invalid time format
      throw new Error("Invalid time format. Please use the format HH:mm or H.mm");
    }

    const timeFormat = isHourMinFormat ? "HOURMIN" : "HOURS";
    let logTimeInMinutes;

    if (timeFormat === "HOURMIN") {
      const hours = parseInt(timeArr[0] || "0", 10);
      const minutes = parseInt(timeArr[1] || "0", 10);
      logTimeInMinutes = hours * 60 + minutes;
    } else {
      const hours = parseInt(timeArr[0] || "0", 10);
      const minutes = parseInt(timeArr[1] || "0", 10);
      const decimalPlaces = timeArr[1].length;
      const decimalFraction = minutes / 10 ** decimalPlaces;
      logTimeInMinutes = hours * 60 + decimalFraction * 60;
    }

    return Math.round(logTimeInMinutes);
  } catch (error) {
    throw new Error("Invalid time format. Please use the format HH:mm or H.mm");
  }
};

// Get time in hours and minutes
export const getTimeInHoursAndMinutes = (duration: number) => {
  const hours = Math.floor(duration / 60);
  const minutes = duration % 60;
  const HH = hours < 10 ? `0${hours}` : hours;
  const MM = minutes < 10 ? `0${minutes}` : minutes;
  return `${HH}:${MM}`;
};

// Get time in hours and minutes
export const getTimeInHours = (duration: number) => {
  const minutesToHours = (duration / 60).toFixed(2);
  let hours = parseFloat(minutesToHours.toString().replace(/\.0+$/, ""));
  return hours;
};

// Get date with Date format, but with 00:00:00 time
export const cleanDate = (dateInput: Date) => {
  const justDate = dateInput.toISOString().split("T")[0];
  return new Date(justDate);
};

// split array into smaller chunks.
export const splitIntoChunk = (array: { id: number }[], size: number) => {
  const chunkedData = [];

  let index = 0;
  while (index < array.length) {
    chunkedData.push(array.slice(index, size + index));
    index += size;
  }

  return chunkedData;
};

// Convert string to boolean
export const stringToBoolean = (inputString: string | undefined): boolean | null => {
  if (inputString === "true") {
    return true;
  } else if (inputString === "false") {
    return false;
  } else {
    return null;
  }
};

// Convert hours to decimal
export const hoursToDecimal = (val: string) => {
  if (val.includes(":")) {
    const [hours, minutes] = val.split(":");
    val = `${Number(hours) + Number(minutes) / 60}`;
  }

  return val;
};

// Get user role based on team slug and workspace role
export const getUserRole = (teamData?: { slug: string; role: string }[], slug?: string) => {
  return teamData?.find((team) => team.slug === slug)?.role ?? "GUEST";
};

// Check if user has access to the page
export const checkAccess = (
  currentUserRole: string,
  rolesToCheck: string[] = ["GUEST"],
  type: "deny" | "allow" = "deny",
): boolean => {
  return type === "deny" ? !rolesToCheck.includes(currentUserRole) : rolesToCheck.includes(currentUserRole);
};

// Get all members time entries grouped by name
export const formatEntryDate = (date: Date): string => {
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};
