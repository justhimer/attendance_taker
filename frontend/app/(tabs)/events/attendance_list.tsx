import { View, Text, FlatList, RefreshControl } from 'react-native'
import React, { useState } from 'react'
import useAPI_WithParams from '@/utils/UseAPI_WithParams';
import { getAttendanceList } from '../../../apis/attendanceAPI';
import { useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import EmptyState from '@/components/EmptyState';
import AttendanceCard from '@/components/AttendanceCard';

const attendance_list = () => {
    const { id }: any = useLocalSearchParams();  // id means event_id

    const { data: attendanceList, refetch: refetchAttendanceList } = useAPI_WithParams(getAttendanceList, +id);

    const [refreshing, setRefreshing] = useState(false);
    const onRefresh = async () => {
        setRefreshing(true);
        await refetchAttendanceList();
        setRefreshing(false);
      };

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
            // ListHeaderComponent={() => (
            //     <View className="flex my-6 px-4 space-y-6">
            //       <View className="flex justify-between items-start flex-row mb-6">
            //         <Text className="text-2xl font-psemibold text-white">
            //           Attendance
            //         </Text>
            //       </View>
            //     </View>
            // )}
            ListEmptyComponent={() => (
                <EmptyState
                  title="No Attendance Found"
                  subtitle="Please invite people to join."
                />
            )}
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
        />
    </SafeAreaView>
    )
}

export default attendance_list;