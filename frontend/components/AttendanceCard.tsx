import { View, Text, Pressable, Image, Alert } from 'react-native';
import React from 'react';
import images from '@/constants/Images';
import { format as dateFormat, parseISO } from 'date-fns';
import { patchAttendance } from '@/apis/attendanceAPI';

export interface IAttendanceCardData {
  id: number;
  username: string;
  email: string;
  attend_time: string | null;
  start: string;
  end: string;
}

const AttendanceCard = (data: IAttendanceCardData) => {
  const convertTime = (timeString: string | null) => {
    if (timeString) {
      return dateFormat(parseISO(timeString), 'yyyy-MM-dd HH:mm');
    }
    return 'N/A';
  }

  const getAttendStatus = () => {
    if (!data.attend_time) {
      if (new Date() <= new Date(data.end)) {
        return 'Pending';
      }
      return 'Absent';
    }

    if (new Date(data.attend_time) <= new Date(data.start)) {
      return 'Attended';
    } else {
      return 'Late';
    }
  }

  const handleCardClick = () => {
    Alert.alert(
      'Change Attendance Time',
      'Choose Attendance Status',
      [
        {
          text: 'Attended',
          onPress: () => patchAttendance(data.id, { attend_time: data.start }),
        },
        {
          text: 'Late',
          onPress: () => patchAttendance(data.id, { attend_time: data.end }),
        },
        {
          text: 'Not Attended',
          onPress: () => patchAttendance(data.id, { attend_time: null }),
        },
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
      ],
    );
  };

  return (
    <Pressable onPress={handleCardClick} className="flex flex-col items-center px-4 mb-5">
      <View className="flex flex-row gap-3 items-start">
        <View className="flex justify-center items-center flex-row flex-1">
          <View className="w-[46px] h-[46px] rounded-lg border border-secondary flex justify-center items-center p-0.5">
            <Image
              source={images.profile}
              className="w-full h-full rounded-lg"
              resizeMode="cover"
            />
          </View>

          <View className="flex justify-center flex-1 ml-3 gap-y-0">
            <Text
              className="font-psemibold text-sm text-white"
              numberOfLines={1}
            >
              {data.username}
            </Text>
            <Text
                className="text-xs text-yellow-500 font-pregular"
                numberOfLines={1}
            >
                Attend Time: {convertTime(data.attend_time)}
            </Text>
          </View>
        </View>

        <View className="pt-4">
          {/* Use badge */}
          <Text className="text-xs text-white bg-yellow-500 px-2 py-1 rounded-full">
            {getAttendStatus()}
          </Text>
        </View>
      </View>
    </Pressable>
  );
};

export default AttendanceCard;