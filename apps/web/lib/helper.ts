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
  const hours = parseFloat(minutesToHours.toString().replace(/\.0+$/, ""));
  return hours;
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
  }
  return null;
};

// Convert hours to decimal
export const hoursToDecimal = (val: string) => {
  if (val.includes(":")) {
    const [hours, minutes] = val.split(":");
    val = `${Number(hours) + Number(minutes) / 60}`;
  }

  return val;
};
