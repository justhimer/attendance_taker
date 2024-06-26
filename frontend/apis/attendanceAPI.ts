import { endpointUrl } from './apiConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getCurrentUser } from './userAPI';
import { responseErrorMsgHandler } from '@/utils/ErrorMsgHandler';

const route = 'attendance';

export async function getAttendanceList(eventId: number) {
  const jwttoken = await AsyncStorage.getItem('jwttoken');

  const res = await fetch(`${endpointUrl}/${route}?event_id=${eventId}`, {
    method: 'GET',
    headers: {
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

export async function getMyAttendance(eventId: number) {
  const jwttoken = await AsyncStorage.getItem('jwttoken');

  const me = await getCurrentUser();
  const my_id = me.id;

  const res = await fetch(
    `${endpointUrl}/${route}?user_id=${my_id}&event_id=${eventId}`,
    { 
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwttoken}`,
      },
    }
  );

  if (res.ok) {
    const result = await res.json();
    if (result.data) {
      return result.data[0];
    }
  }
}

export async function patchAttendance(attendanceId: number, data: any) {
  // console.log('attendanceId', attendanceId);
  // console.log('data', data);
  const jwttoken = await AsyncStorage.getItem('jwttoken');

  const res = await fetch(`${endpointUrl}/${route}/${attendanceId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${jwttoken}`,
    },
    body: JSON.stringify(data),
  });

  if (res.ok) {
    const result = await res.json();
    if (result.data) {
      return result.data;
    }
  }

  const error = await responseErrorMsgHandler(res);
  throw new Error('Patch Attendance Failed.' + error.message);
}
