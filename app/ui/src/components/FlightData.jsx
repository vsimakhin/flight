import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader"
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import Tile from "./Tile";
import { useCallback } from "react";
import { convertTimeToMinutes } from "../util/helpers";

const gridSize = { xs: 6, sm: 3, md: 3, lg: 3, xl: 3 };

export const FlightData = ({ flight }) => {
  const calculateSpeed = useCallback((time, distance) => {
    if (!time || convertTimeToMinutes(time) === 0) {
      return 0;
    }

    const speed = distance / (convertTimeToMinutes(time) / 60);
    return speed;
  }, []);

  return (
    <Card sx={{ mt: 2 }}>
      <CardContent>
        <CardHeader title="Flight Data" slotProps={{ title: { variant: "overline" } }} sx={{ p: 0, mb: 1 }}></CardHeader>
        <Grid container spacing={1}>
          <Tile size={gridSize} title="Total Time" value={flight.time.total_time} />
          <Tile size={gridSize} title="Night Time" value={flight.time.night_time} />
          <Tile size={gridSize} title="Distance (nm)" value={flight.distance.toLocaleString(undefined, { maximumFractionDigits: 1 })} />
          <Tile size={gridSize} title="Speed (kt)" value={calculateSpeed(flight.time.total_time, flight.distance).toLocaleString(undefined, { maximumFractionDigits: 1 })} />
        </Grid>
      </CardContent>
    </Card>
  );
}

export default FlightData;