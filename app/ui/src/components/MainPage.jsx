import CssBaseline from '@mui/material/CssBaseline';
import { useCallback, useEffect, useMemo, useState } from "react";
import Box from "@mui/material/Box";
// Custom
import AppTheme from '../shared-theme/AppTheme.jsx';
import ColorModeIconDropdown from '../shared-theme/ColorModeIconDropdown';
import FlightRecordDetails from "./FlightRecordDetails.jsx";
import { FLIGHT_INITIAL_STATE } from "../constants/constants.jsx";
import FlightData from './FlightData.jsx';
import useLogbook from '../hooks/useLogbook.jsx';
import { convertMinutesToTime } from '../util/helpers.jsx';
import FlightMap from './FlightMap/FlightMap.jsx';

export const MainPage = () => {
  const [flight, setFlight] = useState(FLIGHT_INITIAL_STATE);

  const handleChange = useCallback((key, value) => {
    setFlight((flight) => {
      const keys = key.split('.'); // Split key by dots to handle nesting
      let updatedFlight = { ...flight }; // Create a shallow copy of the flight object
      let current = updatedFlight;

      // Traverse and create nested objects as needed
      keys.forEach((k, index) => {
        if (index === keys.length - 1) {
          // Update the final key with the new value
          current[k] = value;
        } else {
          // Ensure the next level exists
          current[k] = current[k] ? { ...current[k] } : {};
          current = current[k];
        }
      });

      return updatedFlight;
    });
  }, []);

  const { calculateNightTime, calculateTotalTime } = useLogbook();

  const handleTimeChange = useCallback(async () => {
    // check length for the time field
    if (flight.departure.time.length === 4 && flight.arrival.time.length === 4) {
      const total_time = calculateTotalTime(flight);
      handleChange("time.total_time", total_time);

      // night time
      if (flight.date && flight.departure.place && flight.arrival.place) {
        const nightTime = parseInt(await calculateNightTime(flight)) || 0;
        handleChange("time.night_time", convertMinutesToTime(nightTime));
      }
    }
  }, [flight, handleChange, calculateNightTime]);

  useEffect(() => {
    handleTimeChange();
  }, [flight.date, flight.departure.time, flight.arrival.time]);

  const flightMap = useMemo(() => (<FlightMap data={[flight]} />), [flight.redraw])

  return (
    <AppTheme>
      <CssBaseline enableColorScheme />
      <Box sx={{ position: 'fixed', top: '1rem', right: '1rem' }}>
        <ColorModeIconDropdown />
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'center', minHeight: 'calc(100dvh - var(--template-frame-height, 0px))' }}>
        <Box sx={{ width: '100%', maxWidth: 800, p: 2 }} >
          <FlightRecordDetails flight={flight} handleChange={handleChange} />
          <FlightData flight={flight} />
          {flightMap}
        </Box>
      </Box>
    </AppTheme>
  );
}

export default MainPage;