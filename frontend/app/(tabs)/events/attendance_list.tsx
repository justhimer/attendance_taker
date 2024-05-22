import { View, Text, FlatList } from 'react-native'
import React from 'react'
import useAPI_WithParams from '@/utils/UseAPI_WithParams';
import { getAttendanceList } from '../../../apis/attendanceAPI';
import { useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import EmptyState from '@/components/EmptyState';
import AttendanceCard from '@/components/AttendanceCard';

const attendance_list = () => {
    const { id }: any = useLocalSearchParams();  // id means event_id

    const { data: attendanceList, refetch: refetchAttendanceList } = useAPI_WithParams(getAttendanceList, +id);

    return (
    <SafeAreaView className="bg-primary h-full">
        <FlatList
            data={attendanceList}
            keyExtractor={(item: any) => item.id}
            renderItem={({ item }) => (
            <View>
                <AttendanceCard
                    id={+item.id}
                    username={item.user.username}
                    email={item.user.email}
                    attend_time={item.attend_time}
                    start={item.event.start}
                    end={item.event.end}
                />
            </View>
            )}
            ListEmptyComponent={() => (
                <EmptyState
                  title="No Attendance Found"
                  subtitle="Please invite people to join."
                />
            )}
        />
    </SafeAreaView>
    )
}

export default attendance_list;