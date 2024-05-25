import { responseErrorMsgHandler } from '../utils/ErrorMsgHandler';
import { endpointUrl } from './apiConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface ISignInData {
    email: string;
    password: string;
}

const route = 'auth';

export async function signIn(loginData: ISignInData) {
  // const json = JSON.stringify(loginData);
  const res = await fetch(`${endpointUrl}/${route}`, {
    method: 'POST',
    body: JSON.stringify(loginData),
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
    },
  });

  if (res.ok) {
    const result = await res.json();
    
    if (result.data) {
      await AsyncStorage.setItem('jwttoken', result.data.token);
      return result.data.user;
    }
  }
  
  const error = await responseErrorMsgHandler(res);
  throw new Error('Sign in Failed.' + error.message);
}

export async function signOut() {
  await AsyncStorage.removeItem('jwttoken');
}