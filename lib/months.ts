type StartEnd = {
  startDate: Date;
  endDate: Date;
};

export function getStartandEndDates(range: string): StartEnd {
  if (range) {
    const [start, end] = range.split(",");

    return {
      startDate: new Date(start),
      endDate: new Date(end),
    };
  }

  return {
    startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    endDate: new Date(),
  };
}
