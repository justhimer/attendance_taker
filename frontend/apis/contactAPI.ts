import { endpointUrl } from './apiConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';

const route = 'contacts';

export async function createContact(userId: number, contactUserId: number) {
  const jwttoken = await AsyncStorage.getItem('jwttoken');

  const data = {
    user_id: userId,
    contact_id: contactUserId,
  };

  const res = await fetch(`${endpointUrl}/${route}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${jwttoken}`,
      'Content-Type': 'application/json',
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

export async function getContacts() {
  const jwttoken = await AsyncStorage.getItem('jwttoken');

  const res = await fetch(`${endpointUrl}/${route}`, {
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

export async function deleteContact(contactId: number) {
  const jwttoken = await AsyncStorage.getItem('jwttoken');

  const res = await fetch(`${endpointUrl}/${route}/${contactId}`, {
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