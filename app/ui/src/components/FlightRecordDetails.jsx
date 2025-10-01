import dayjs from "dayjs";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader"
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import { DatePicker } from "@mui/x-date-pickers";
import PlaceField from "./PlaceField.jsx";
import HelpButton from "./HelpButton.jsx";

export const FlightRecordDetails = ({ flight, handleChange }) => {
  return (
    <Card >
      <CardContent>
        <CardHeader title="Flight" slotProps={{ title: { variant: "overline" } }} sx={{ p: 0, mb: 1 }}
          action={<HelpButton />}></CardHeader>
        <Grid container spacing={1} columns={11}>
          <Grid size={{ xs: 11, sm: 3, md: 3, lg: 3, xl: 3 }}>
            <DatePicker
              id="date" name="date"
              label="Date"
              format="DD/MM/YYYY"
              fullWidth
              onChange={(value) => { handleChange("date", value ? dayjs(value).format("DD/MM/YYYY") : "") }}
              slotProps={{ field: { size: "small", fullWidth: true } }}
              variant=""
              value={dayjs(flight?.date ?? dayjs().format('DD/MM/YYYY'), "DD/MM/YYYY")}
            />
          </Grid>
          <PlaceField flight={flight} handleChange={handleChange} type="departure" />
          <PlaceField flight={flight} handleChange={handleChange} type="arrival" />
        </Grid>
      </CardContent>
    </Card>
  );
}

export default FlightRecordDetails;