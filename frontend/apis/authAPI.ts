import { responseErrorMsgHandler } from '../utils/ErrorMsgHandler';
import { endpointUrl } from './apiConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface LoginData {
    email: string;
    password: string;
}

const route = 'users';

export async function login(loginData: LoginData) {
  const res = await fetch(`${endpointUrl}/${route}/current`, {
    // credentials: 'same-origin',
    method: 'POST',
    body: JSON.stringify(loginData),
  });

  if (res.ok) {
    const result = await res.json();
    
    // use asynstorage to store token
    await AsyncStorage.setItem('jwttoken', result.token);
    
    if (result) {
        return result;
    }
  }
  
  const error = await responseErrorMsgHandler(res);
  throw new Error('Get User Failed.' + error.message);
}