import { responseErrorMsgHandler } from '../utils/ErrorMsgHandler';
import { endpointUrl } from './apiConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';

const route = 'events';

export async function createEvent(data: any) {
  const jwttoken = await AsyncStorage.getItem('jwttoken');

  const res = await fetch(`${endpointUrl}/${route}`, {
    method: 'POST',
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
}

export async function getHostEvents() {
  const jwttoken = await AsyncStorage.getItem('jwttoken');

  const res = await fetch(`${endpointUrl}/${route}/host`, {
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

export async function getAttendEvents() {
  const jwttoken = await AsyncStorage.getItem('jwttoken');

  const res = await fetch(`${endpointUrl}/${route}/attend`, {
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

export async function getEvent(id: number) {
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
        return result.data;
    }
  }
}

// export async function getHostEvent(id: number) {
//   const jwttoken = await AsyncStorage.getItem('jwttoken');

//   const res = await fetch(`${endpointUrl}/${route}/host/${id}`, {
//     // credentials: 'same-origin',
//     method: 'GET',
//     headers: {
//       // 'CSRF-Token': csrfToken,
//       Authorization: `Bearer ${jwttoken}`,
//     },
//   });

//   if (res.ok) {
//     const result = await res.json();
//     if (result.data) {
//         return result.data;
//     }
//   }
// }

// export async function getAttendEvent(id: number) {
//   const jwttoken = await AsyncStorage.getItem('jwttoken');

//   const res = await fetch(`${endpointUrl}/${route}/attend/${id}`, {
//     // credentials: 'same-origin',
//     method: 'GET',
//     headers: {
//       // 'CSRF-Token': csrfToken,
//       Authorization: `Bearer ${jwttoken}`,
//     },
//   });

//   if (res.ok) {
//     const result = await res.json();
//     if (result.data) {
//         return result.data;
//     }
//   }
// }

export async function patchEvent(id: number, data: any) {
  const jwttoken = await AsyncStorage.getItem('jwttoken');

  const res = await fetch(`${endpointUrl}/${route}/${id}`, {
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
}

export async function deleteEvent(id: number) {
  const jwttoken = await AsyncStorage.getItem('jwttoken');

  const res = await fetch(`${endpointUrl}/${route}/${id}`, {
    method: 'DELETE',
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