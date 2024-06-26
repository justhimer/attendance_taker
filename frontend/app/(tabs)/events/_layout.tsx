import React from 'react'
import { useGlobalContext } from '@/context/GlobalProvider';
import { StatusBar } from "expo-status-bar";
import { Redirect, Stack } from 'expo-router';
import Loader from '@/components/Loader';

export default function EventStack() {
  return (
    <Stack>
      <Stack.Screen
        name="event_list"
        options={{
          title: 'Events',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="event"
        options={{
          title: 'Event',
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="create_event"
        options={{
          title: 'Create Event',
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="show_qr"
        options={{
          title: 'Show QR',
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="scan_qr"
        options={{
          title: 'Scan QR',
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="attendance_list"
        options={{
          title: 'Attendance List',
          headerShown: true,
        }}
      />
    </Stack>
  )
}