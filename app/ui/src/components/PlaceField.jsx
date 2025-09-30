import { useCallback } from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
// MUI Icons
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import FlightLandIcon from '@mui/icons-material/FlightLand';
// Custom components
import { PLACE_SLOT_PROPS, TIME_SLOT_PROPS } from '../constants/constants';
import useLogbook from '../hooks/useLogbook';

const gridSize = { xs: 11, sm: 2, md: 2, lg: 2, xl: 2 };
const capitalizeFirstLetter = (str) => str ? `${str[0].toUpperCase()}${str.slice(1)}` : "";

const Label = ({ icon: Icon, text }) => {
  return (
    <Box gap={0.5} display="flex" alignItems="center"><Icon />{text}</Box>
  )
}

export const PlaceField = ({ flight, handleChange, type }) => {
  const icon = type === "departure" ? FlightTakeoffIcon : FlightLandIcon;

  const { calculateDistance } = useLogbook();

  const handlePlaceChange = useCallback(async () => {
    // quickly recalculate the distance to show on map
    const distance = await calculateDistance(flight);

    if (distance) {
      handleChange("distance", distance);
    }
    // it's a trick to update the map when the place field is left
    // otherwise the map will be refreshed on each flight field change
    handleChange("redraw", Math.random());
  }, [flight, handleChange, calculateDistance]);

  return (
    <>
      <Grid size={gridSize}>
        <TextField
          id={`${type}.place`}
          name={`${type}.place`}
          label={<Label icon={icon} text="Place" />}
          onChange={(event) => (handleChange(`${type}.place`, event.target.value))}
          value={type == "departure" ? flight.departure.place : flight.arrival.place ?? ""}
          slotProps={PLACE_SLOT_PROPS}
          size="small"
          variant="outlined"
          fullWidth
          onBlur={() => handlePlaceChange()}
        />
      </Grid>
      <Grid size={gridSize}>
        <TextField
          id={`${type}.time`}
          name={`${type}.time`}
          label={<Label icon={icon} text="Time" />}
          onChange={(event) => handleChange(`${type}.time`, event.target.value)}
          value={type == "departure" ? flight.departure.time : flight.arrival.time ?? ""}
          size="small"
          variant="outlined"
          slotProps={TIME_SLOT_PROPS}
          placeholder="HHMM"
          fullWidth
          tooltip={`${capitalizeFirstLetter(type)} time`}
        />
      </Grid>

    </>
  )
};

export default PlaceField;