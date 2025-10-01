// Custom
import HelpButtonDrawer from "./HelpButtonDrawer";

const HELP_CONTENT = [
  {
    title: 'Flight by Flaps & Throttles',
    description: 'Use this tool to calculate total flight time and night time.',
  },
  {
    title: 'Place',
    description: 'Enter the departure or arrival airport code in ICAO (e.g., LKPR) or IATA (e.g., PRG) format.',
  },
  {
    title: 'Time',
    description: 'Enter the time in Coordinated Universal Time (UTC) using the HHMM format (e.g., 2230 for 22:30).',
  },
];

export const HelpButton = () => {
  return (
    <HelpButtonDrawer content={HELP_CONTENT} />
  );
}

export default HelpButton;