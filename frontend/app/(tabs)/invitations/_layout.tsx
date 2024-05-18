import React from 'react'
import { useGlobalContext } from '@/context/GlobalProvider';
import { StatusBar } from "expo-status-bar";
import { Redirect, Stack } from 'expo-router';
import Loader from '@/components/Loader';

export default function InvitationStack() {
  return (
    <Stack>
      <Stack.Screen
        name="invitation_list"
        options={{
          title: 'Invitations',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="invitation"
        options={{
          title: 'Invitation',
          headerShown: true,
        }}
      />
    </Stack>
  )
}