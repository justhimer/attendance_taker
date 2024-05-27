import { responseErrorMsgHandler } from '../utils/ErrorMsgHandler';
import { endpointUrl } from './apiConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getCurrentUser } from './userAPI';

export enum InvitationStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
}

const route = 'invitations';

export async function getInvitationsToMe() {
  const jwttoken = await AsyncStorage.getItem('jwttoken');

  const me = await getCurrentUser();
  const my_id = me.id;

  const res = await fetch(
    `${endpointUrl}/${route}?user_id=${my_id}&status=${InvitationStatus.PENDING}`,
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
      return result.data;
    }
  }
}

export async function getSentInvitations(event_id: number) {
  const jwttoken = await AsyncStorage.getItem('jwttoken');

  const res = await fetch(
    `${endpointUrl}/${route}?event_id=${event_id}`,
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
      return result.data;
    }
  }
}

export async function createInvitation(event_id: number, user_id: number) {
  const jwttoken = await AsyncStorage.getItem('jwttoken');

  const res = await fetch(`${endpointUrl}/${route}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${jwttoken}`,
    },
    body: JSON.stringify({
      event_id,
      user_id,
      status: 'PENDING',
    }),
  });

  if (res.ok) {
    const result = await res.json();
    if (result.data) {
        return result.data;
    }
  }
}

export async function createInvitations(event_id: number, user_ids: number[]) {
  const jwttoken = await AsyncStorage.getItem('jwttoken');

  const payload = user_ids.map((user_id) => ({
    event_id,
    user_id,
    status: 'PENDING',
  }));

  // console.log('payload', payload);

  const res = await fetch(`${endpointUrl}/${route}/bulk`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${jwttoken}`,
    },
    body: JSON.stringify(payload),
  });

  if (res.ok) {
    const result = await res.json();
    if (result.data) {
      return result.data;
    }
  }
}

export async function updateInvitation(id: number, status: InvitationStatus) {
  const jwttoken = await AsyncStorage.getItem('jwttoken');

  const res = await fetch(`${endpointUrl}/${route}/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${jwttoken}`,
    },
    body: JSON.stringify({
      status,
    }),
  });

  if (res.ok) {
    const result = await res.json();
    if (result.data) {
      return result.data;
    }
  }
}