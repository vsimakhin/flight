import dayjs from 'dayjs';

export let API_URL = '/api';
if (import.meta.env.MODE === 'development') {
  API_URL = 'http://localhost:4000/api';
}

export const FLIGHT_INITIAL_STATE = {
  uuid: "",
  date: dayjs().format('DD/MM/YYYY'),
  departure: {
    place: "",
    time: ""
  },
  arrival: {
    place: "",
    time: ""
  },
  time: {
    total_time: "0:00",
    night_time: "0:00",
  },
  distance: 0,
};

export const PLACE_SLOT_PROPS = {
  htmlInput: { style: { textTransform: 'uppercase' }, onInput: (e) => { e.target.value = e.target.value.toUpperCase() } }
}

export const TIME_SLOT_PROPS = {
  htmlInput: { maxLength: 4, onInput: (e) => { e.target.value = e.target.value.replace(/[^0-9]/g, '') }, inputMode: 'numeric' }
}
