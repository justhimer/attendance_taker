import React from 'react'
import { useGlobalContext } from '@/context/GlobalProvider';
import { StatusBar } from "expo-status-bar";
import { Redirect, Stack } from 'expo-router';
import Loader from '@/components/Loader';

export default function EventStack() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: 'Events',
          headerShown: false,
        }}
      />
    </Stack>
  )
}