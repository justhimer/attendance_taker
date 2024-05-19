import { responseErrorMsgHandler } from '../utils/ErrorMsgHandler';
import { endpointUrl } from './apiConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getCurrentUser } from './userAPI';

const route = 'attendance';

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

// export async function getSingleAttendance(id: number) {
//   const jwttoken = await AsyncStorage.getItem('jwttoken');

//   const res = await fetch(`${endpointUrl}/${route}/${id}`, {
//     method: 'GET',
//     headers: {
//       Authorization: `Bearer ${jwttoken}`,
//     },
//   });

//   if (res.ok) {
//     const result = await res.json();
//     if (result.data) {
//       return result.data;
//     }
//   }
// }

// export async function getAllAttendanceByEventId(eventId: number) {
//   const jwttoken = await AsyncStorage.getItem('jwttoken');

//   const res = await fetch(`${endpointUrl}/${route}`, {
//     method: 'GET',
//     headers: {
//       Authorization: `Bearer ${jwttoken}`,
//     },
//     body: JSON.stringify({ event_id: eventId }),
//   });

//   if (res.ok) {
//     const result = await res.json();
//     if (result.data) {
//       return result.data;
//     }
//   }
// }