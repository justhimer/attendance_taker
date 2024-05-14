import { responseErrorMsgHandler } from '../utils/ErrorMsgHandler';
import { endpointUrl } from './apiConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface LoginData {
    email: string;
    password: string;
}

const route = 'auth';

export async function signIn(loginData: LoginData) {
  const json = JSON.stringify(loginData);
  console.log('loginData: ', json);
  const res = await fetch(`${endpointUrl}/${route}/login`, {
    // credentials: 'same-origin',
    method: 'POST',
    body: JSON.stringify(loginData),
    // headers: {
    //   'Content-Type': 'application/json; charset=utf-8',
    //   'CSRF-Token': csrfToken,
    // },
  });
  console.log(res);

  if (res.ok) {
    const result = await res.json();
    
    // use asynstorage to store token
    await AsyncStorage.setItem('jwttoken', result.token);
    
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