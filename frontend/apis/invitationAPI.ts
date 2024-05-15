import { responseErrorMsgHandler } from '../utils/ErrorMsgHandler';
import { endpointUrl } from './apiConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';

const route = 'invitations';

export async function getInvitations() {
  const jwttoken = await AsyncStorage.getItem('jwttoken');

  const res = await fetch(`${endpointUrl}/${route}`, {
    // credentials: 'same-origin',
    method: 'GET',
    headers: {
      // 'CSRF-Token': csrfToken,
      Authorization: `Bearer ${jwttoken}`,
    },
  });

  if (res.ok) {
    const result = await res.json();
    // if (result) {
    //     return result;
    // }
    if (result.data) {
        return result.data;
    }
  }
  
  const error = await responseErrorMsgHandler(res);
  throw new Error('Get User Failed.' + error.message);
}