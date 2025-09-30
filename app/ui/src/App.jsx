import { QueryClientProvider } from '@tanstack/react-query';
import { NotificationsProvider } from '@toolpad/core/useNotifications';
import { DialogsProvider } from '@toolpad/core/useDialogs';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
// Custom components and libraries
import { queryClient } from './util/http/http';
import MainPage from './components/MainPage';


function App() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <QueryClientProvider client={queryClient}>
        <DialogsProvider>
          <NotificationsProvider>
            <MainPage />
          </NotificationsProvider>
        </DialogsProvider>
      </QueryClientProvider>
    </LocalizationProvider>
  )
}

export default App
