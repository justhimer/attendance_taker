import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Stack, useLocalSearchParams } from 'expo-router'
import InfoBox from '@/components/InfoBox';

// export interface IEventData {
//     title: string;
//     host_by: string;
//     start: string;
//     end: string;
//     venue: string;
//     details: string;
// }

const EventDetailsScreen = () => {
    const { 
        id, 
        title,
        host_by,
        start,
        end,
        venue,
        details
    } = useLocalSearchParams();
    return (
        <View>
            <Stack.Screen options={{ title: `Event ${id}` }} />
            <InfoBox
              title={title}
              containerStyles="mt-1"
              titleStyles="text-lg"
            />
        </View>
    )
}

export default EventDetailsScreen;