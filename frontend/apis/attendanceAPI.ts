import { responseErrorMsgHandler } from '../utils/ErrorMsgHandler';
import { endpointUrl } from './apiConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';

const route = 'attendance';

export async function getSingleAttendance(id: number) {
  const jwttoken = await AsyncStorage.getItem('jwttoken');

  const res = await fetch(`${endpointUrl}/${route}/${id}`, {
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

export async function getAllAttendanceByEventId(eventId: number) {
  const jwttoken = await AsyncStorage.getItem('jwttoken');

  const res = await fetch(`${endpointUrl}/${route}`, {
    // credentials: 'same-origin',
    method: 'GET',
    headers: {
      // 'CSRF-Token': csrfToken,
      Authorization: `Bearer ${jwttoken}`,
    },
    body: JSON.stringify({ event_id: eventId }),
  });

  if (res.ok) {
    const result = await res.json();
    if (result.data) {
      return result.data;
    }
  }
}