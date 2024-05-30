import { View, Text, Pressable, Image, Alert } from 'react-native';
import React, { useEffect } from 'react';
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
  const [attendStatus, setAttendStatus] = React.useState('Pending');
  const [badgeColor, setBadgeColor] = React.useState('red-500');

  const convertTime = (timeString: string | null) => {
    if (timeString) {
      return dateFormat(parseISO(timeString), 'yyyy-MM-dd HH:mm');
    }
    return 'N/A';
  }

  const analyseAttendStatus = () => {
    if (!data.attend_time) {
      if (new Date() <= new Date(data.end)) {
        setAttendStatus('Pending');
        setBadgeColor('red-500');
        return;
      }
      setAttendStatus('Absent');
      setBadgeColor('red-500');
      return;
    }

    if (new Date(data.attend_time) <= new Date(data.start)) {
      setAttendStatus('Attended');
      setBadgeColor('green-500');
      return;
    } else {
      setAttendStatus('Late');
      setBadgeColor('green-500');
      return;
    }
  }

  useEffect(() => {
    analyseAttendStatus();
  }, [data.attend_time]);

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
          <View className={`bg-${badgeColor} rounded-full px-2 py-1`}>
            <Text className="text-white text-xs font-psemibold">{attendStatus}</Text>
          </View>
          {/* { attendStatus === 'Absent' ? (
            <View className="bg-red-500 rounded-full px-2 py-1">
              <Text className="text-white text-xs font-psemibold">{attendStatus}</Text>
            </View> ) : (
            <View className="bg-green-500 rounded-full px-2 py-1">
              <Text className="text-white text-xs font-psemibold">{attendStatus}</Text>
            </View>)
          } */}
        </View>
      </View>
    </Pressable>
  );
};

export default AttendanceCard;