import dayjs from "dayjs";

// Convert minutes to HHHH:MM format
export const convertMinutesToTime = (minutes) => {
  if (!minutes) return "00:00";

  const hours = String(Math.floor(minutes / 60)).padStart(2, '0');
  const mins = String(minutes % 60).padStart(2, '0');
  return `${hours}:${mins}`;
};

// Convert hours to HHHH:MM format
export const convertHoursToTime = (hours) => {
  if (!hours) return "00:00";
  const totalMinutes = Math.floor(hours * 60);
  const formattedTime = convertMinutesToTime(totalMinutes);
  return formattedTime;
};

// Convert HHHH:MM format back to minutes if needed
export const convertTimeToMinutes = (time) => {
  if (!time) return 0;
  const [hours, mins] = time.split(':').map(Number);
  return hours * 60 + mins;
};