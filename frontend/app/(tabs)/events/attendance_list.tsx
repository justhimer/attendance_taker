import { View, Text, FlatList } from 'react-native'
import React from 'react'
import useAPI_WithParams from '@/utils/UseAPI_WithParams';
import { getAttendanceList } from '../../../apis/attendanceAPI';
import { useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

const attendance_list = () => {
    const { id }: any = useLocalSearchParams();  // id means event_id
    console.log(id);

    const { data: attendanceList, refetch: refetchAttendanceList } = useAPI_WithParams(getAttendanceList, +id);

    return (
    <SafeAreaView className="bg-primary h-full">
        <FlatList
            data={attendanceList}
            keyExtractor={(item: any) => item.id}
            renderItem={({ item }) => (
            <View>
                <Text>{item.id}</Text>
                <Text>{item.user_id}</Text>
                <Text>{item.event_id}</Text>
                <Text>{item.attend_time}</Text>
            </View>
            )}
        />
    </SafeAreaView>
    )
}

export default attendance_list;