const getTimeInMinutes = (logTime: string): number => {
  try {
    const isHourMinFormat = logTime.includes(':') || /^\d+$/.test(logTime);
    const timeArr = isHourMinFormat ? logTime.split(':') : logTime.split('.');

    if (timeArr.length !== 2 || isNaN(Number(timeArr[0])) || isNaN(Number(timeArr[1]))) {
      // Invalid time format
      throw new Error('Invalid time format. Please use the format HH:mm or H.mm');
    }

    const timeFormat = isHourMinFormat ? 'HOURMIN' : 'HOURS';
    let logTimeInMinutes;

    if (timeFormat === 'HOURMIN') {
      const hours = parseInt(timeArr[0] || '0', 10);
      const minutes = parseInt(timeArr[1] || '0', 10);
      logTimeInMinutes = (hours * 60) + minutes;
    } else {
      const hours = parseInt(timeArr[0] || '0', 10);
      const minutes = parseInt(timeArr[1] || '0', 10);
      const decimalPlaces = timeArr[1].length;
      const decimalFraction = minutes / (10 ** decimalPlaces);
      logTimeInMinutes = (hours * 60) + (decimalFraction * 60);
    }

    return Math.round(logTimeInMinutes);
  } catch (error) {
    throw new Error('Invalid time format. Please use the format HH:mm or H.mm');
  }
};

export const getTimeInMinutesNew = (logTime: string): number => {
  try {
    const isHourMinFormat = logTime.includes(':') || logTime.includes('.');
    const timeArr = isHourMinFormat ? logTime.split(/[:.]/) : [logTime];

    if (timeArr.length === 1 && isNaN(Number(timeArr[0]))) {
      // Invalid time format
      throw new Error('Invalid time format. Please use the format HH:mm or H.mm');
    } else if (timeArr.length === 2 && (isNaN(Number(timeArr[0])) || isNaN(Number(timeArr[1])))) {
      // Invalid time format
      throw new Error('Invalid time format. Please use the format HH:mm or H.mm');
    }

    const hours = parseInt(timeArr[0] || '0', 10);
    const minutes = parseInt(timeArr[1] || '0', 10);

    const totalMinutes = (hours * 60) + minutes;
    return totalMinutes;
  } catch (error) {
    throw new Error('Invalid time format. Please use the format HH:mm or H.mm');
  }
};




// console.log(getTimeInMinutes('3')); // Output: 180
// console.log(getTimeInMinutes('0')); // Output: 0
console.log(getTimeInMinutes('0.5')); // Output: 30
console.log(getTimeInMinutes('0:50')); // Output: 50
console.log(getTimeInMinutes('1.75')); // Output: 105
console.log(getTimeInMinutes('1:30')); // Output: 90
console.log(getTimeInMinutes('1.5')); // Output: 90
console.log(getTimeInMinutes('2.25')); // Output: 135
console.log(getTimeInMinutes('12:00')); // Output: 720
console.log(getTimeInMinutes('7.5')); // Output: 450
console.log(getTimeInMinutes('7:30')); // Output: 450
console.log(getTimeInMinutes(':20')); // Output: 20
console.log(getTimeInMinutes('.75')); // Output: 45
// console.log(getTimeInMinutes('x:30')); // Output: 0
// console.log(getTimeInMinutes('2:x')); // Output: 0
// console.log(getTimeInMinutes('abc')); // Output: 0


console.log(getTimeInMinutesNew('3')); // Output: 180
console.log(getTimeInMinutesNew('0')); // Output: 0
console.log(getTimeInMinutesNew('0.5')); // Output: 30
console.log(getTimeInMinutesNew('0:50')); // Output: 50
console.log(getTimeInMinutesNew('1.75')); // Output: 105
console.log(getTimeInMinutesNew('1:30')); // Output: 90
console.log(getTimeInMinutesNew('1.5')); // Output: 90
console.log(getTimeInMinutesNew('2.25')); // Output: 135
console.log(getTimeInMinutesNew('12:00')); // Output: 720
console.log(getTimeInMinutesNew('7.5')); // Output: 450
console.log(getTimeInMinutesNew('7:30')); // Output: 450
console.log(getTimeInMinutesNew(':20')); // Output: 20
console.log(getTimeInMinutesNew('.75')); // Output: 45
// console.log(getTimeInMinutes('x:30')); // Output: 0
// console.log(getTimeInMinutes('2:x')); // Output: 0
// console.log(getTimeInMinutes('abc')); // Output: 0