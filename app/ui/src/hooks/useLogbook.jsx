import { useCallback } from "react";
import { useMutation } from "@tanstack/react-query";
import dayjs from 'dayjs';
// Custom
import { fetchDistance, fetchNightTime } from "../util/http/http";
import { useErrorNotification } from "./useAppNotifications";

export const useLogbook = () => {

  // mutation to fetch distance between two places
  const { mutateAsync: getDistance } = useMutation({
    mutationFn: ({ signal, departure, arrival }) => fetchDistance({ signal, departure, arrival }),
  });

  /**
   * Calculate total distance of the flight including enroute stops if any
   * @param {object} flight - Flight record object
   * @returns {number} - Total distance in nautical miles
   */
  const calculateDistance = useCallback(async (flight) => {
    if (!flight) return 0;

    return await getDistance({ departure: flight.departure.place, arrival: flight.arrival.place })
  }, [getDistance]);

  // mutation to fetch night time
  const { mutateAsync: getNightTime, isError: isErrorNightTime, error: errorNightTime } = useMutation({
    mutationFn: ({ signal, flight }) => fetchNightTime({ flight, signal }),
  });
  useErrorNotification({ isError: isErrorNightTime, error: errorNightTime, fallbackMessage: 'Failed to calculate night time' });

  /**
   * Calculate night time of the flight
   * @param {object} flight - Flight record object
   * @returns {number} - Night time in minutes
   */
  const calculateNightTime = useCallback(async (flight) => {
    if (!flight) return 0;

    const nightTime = await getNightTime({ flight });
    return nightTime || 0;
  }, [getNightTime]);

  /**
   * Calculate total flight time considering overnight flights
   * @param {object} flight - Flight record object
   * @returns {string} - Total flight time in "HH:MM" format
   */
  const calculateTotalTime = useCallback((flight) => {
    // Parse times using the "HHMM" format
    const departure = dayjs(flight.departure.time, "HHmm");
    const arrival = dayjs(flight.arrival.time, "HHmm");

    // If arrival time is earlier than departure time, assume it's on the next day
    const adjustedArrival = arrival.isBefore(departure) ? arrival.add(1, "day") : arrival;

    // Calculate the total time in minutes
    const totalMinutes = adjustedArrival.diff(departure, "minute");

    // Format the total time as "HH:MM"
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    return `${hours}:${minutes.toString().padStart(2, "0")}`;
  }, []);

  return { calculateDistance, calculateNightTime, calculateTotalTime };
}

export default useLogbook;