import { QueryClientProvider } from '@tanstack/react-query';
import { NotificationsProvider } from './hooks/useNotifications/useNotifications';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
// Custom components and libraries
import { queryClient } from './util/http/http';
import MainPage from './components/MainPage';


function App() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <QueryClientProvider client={queryClient}>
        <NotificationsProvider>
          <MainPage />
        </NotificationsProvider>
      </QueryClientProvider>
    </LocalizationProvider>
  )
}

export default App
