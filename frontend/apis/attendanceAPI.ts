import { responseErrorMsgHandler } from '../utils/ErrorMsgHandler';
import { endpointUrl } from './apiConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';

const route = 'attendance';

export async function getAttendEvents() {
  const jwttoken = await AsyncStorage.getItem('jwttoken');

  const res = await fetch(`${endpointUrl}/${route}/events`, {
    // credentials: 'same-origin',
    method: 'GET',
    headers: {
      // 'CSRF-Token': csrfToken,
      Authorization: `Bearer ${jwttoken}`,
    },
  });

  if (res.ok) {
    const result = await res.json();
    if (result.data) {
      const events = result.data.map((result: any) => (result.event));
      return events;
    }
  }
}

export async function getAttendEventByEventID(event_id: number) {
  const jwttoken = await AsyncStorage.getItem('jwttoken');

  const res = await fetch(`${endpointUrl}/${route}/event/${event_id}`, {
    // credentials: 'same-origin',
    method: 'GET',
    headers: {
      // 'CSRF-Token': csrfToken,
      Authorization: `Bearer ${jwttoken}`,
    },
  });

  if (res.ok) {
    const result = await res.json();
    if (result.data) {
      return result.data;
    }
  }
}