import { responseErrorMsgHandler } from '../utils/ErrorMsgHandler';
import { endpointUrl } from './apiConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface IPatchUserData {
  username?: string;
  password?: string;
  phone?: string;
}

interface ICreateUserData {
  username: string;
  email: string;
  password: string;
  phone?: string;
}

const route = 'users';

export async function createUser(userData: ICreateUserData) {
  const res = await fetch(`${endpointUrl}/${route}`, {
    method: 'POST',
    body: JSON.stringify(userData),
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
    },
  });

  if (res.ok) {
    const result = await res.json();
    if (result.data) {
        return result.data;
    }
  }
  
  const error = await responseErrorMsgHandler(res);
  throw new Error('Create User Failed.' + error.message);
}

export async function getCurrentUser() {
  const jwttoken = await AsyncStorage.getItem('jwttoken');

  const res = await fetch(`${endpointUrl}/${route}/current`, {
    method: 'GET',
    headers: {
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

export async function patchUser(id: number, patchData: IPatchUserData) {
  const jwttoken = await AsyncStorage.getItem('jwttoken');

  const res = await fetch(`${endpointUrl}/${route}/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(patchData),
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      Authorization: `Bearer ${jwttoken}`,
    },
  });

  if (res.ok) {
    const result = await res.json();
    if (result.data) {
        return result.data;
    }
  }
  
  const error = await responseErrorMsgHandler(res);
  throw new Error('Patch User Failed.' + error.message);
}