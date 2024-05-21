import { StyleSheet, Text, View, Image, ScrollView, TextInput, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Stack, router, useLocalSearchParams } from 'expo-router'
import InfoBox from '@/components/InfoBox';
import { SafeAreaView } from 'react-native-safe-area-context';
import images from '@/constants/Images';
import { format as dateFormat, parseISO } from 'date-fns';
import Ionicons from '@expo/vector-icons/Ionicons';
import CustomButton from '@/components/CustomButton';
import { deleteEvent } from '@/apis/eventAPI';
import { useGlobalContext } from '@/context/GlobalProvider';
import { createInvitation } from '@/apis/invitationAPI';
import { getMyAttendance } from '@/apis/attendanceAPI';

// export interface IEventData {
//     title: string;
//     host_by: string;
//     start: string;
//     end: string;
//     venue: string;
//     details: string;
// }

const EventDetailsScreen = () => {
    const { user } = useGlobalContext();
    const [ isSubmitting, setSubmitting ] = useState(false);
    const [ myAttendanceId, setMyAttendanceId ] = useState(0);
    const [ myAttendStatus, setMyAttendStatus ] = useState('');

    const { 
        id, 
        title,
        hosted_by,
        start,
        end,
        venue,
        details
    }: any = useLocalSearchParams();

    const fetchMyAttendance = async () => {
        const attendance = await getMyAttendance(+id);
        if (attendance) {
            const attendanceId = (attendance as any).id;
            setMyAttendanceId(attendanceId);

            const time = (attendance as any).attend_time;
            if (time === null) {
                if (new Date() < parseISO(end)) {
                    setMyAttendStatus('Pending');
                } else {
                    setMyAttendStatus('Absent');
                }
            } else {
                const attendDateTime = new Date(time);
                const attendedOrLate = attendDateTime > parseISO(end) ? 'Attended(Late)' : 'Attended(On Time)';
                const formattedDateTime = dateFormat(attendDateTime, 'yyyy-MM-dd HH:mm:ss');
                setMyAttendStatus(`${attendedOrLate}: ${formattedDateTime}`);
            }
        }
    }

    useEffect(() => {
        if (hosted_by != user?.id) {
            fetchMyAttendance();
        }
    }, []);

    const onInvite = async () => {
        Alert.prompt('Enter User ID', 'Please enter the ID of the user you want to invite:', async (userId) => {
            if (userId) {
                try {
                    const result = await createInvitation(+id, +userId); // Replace with your actual API call
                    if (result) {
                        Alert.alert('Success', 'Invitation sent successfully!');
                    } else {
                        Alert.alert('Error', 'Failed to send invitation.');
                    }
                } catch (error) {
                    Alert.alert('Error', (error as Error).message);
                }
            }
        });
    };

    const onAttendance = async () => {};
    
    const onShowQRCode = async () => {
        router.push({ pathname: "(tabs)/events/show_qr", params: {id, title} })
    };

    const onScanQRCode = async () => {
        router.push({ pathname: "(tabs)/events/scan_qr", params: {event_id: id, myAttendanceId} })
    };

    const onDelete = async () => {
        Alert.alert("Delete Event", "Are you sure you want to delete this event?", [
            {
              text: "Cancel",
              style: "cancel"
            },
            { text: "OK", onPress: onDeleteEvent }
        ]);
    }

    const onDeleteEvent = async () => {
        setSubmitting(true);
        try {
          const result = await deleteEvent(id);
          if (result) {
            Alert.alert("Success", "Event deleted successfully");
            router.replace("(tabs)/events/event_list");
          }
        } catch (error) {
          Alert.alert("Error", (error as Error).message);
        } finally {
          setSubmitting(false);
        }
    };
    
    return (
        <SafeAreaView className="bg-primary h-full">
            <ScrollView className='mx-4 '>
                <Text className="text-2xl font-semibold text-yellow-500 mt-0 font-psemibold mb-2">
                    {title}
                </Text>

                <View className="flex justify-center items-center flex-row flex-1">
                    <View className="w-[46px] h-[46px] rounded-lg  flex justify-center items-center p-0.5">
                        <Ionicons size={28} name='calendar' style={[{ color: 'white' }]} />
                        {/* <Image
                            source={images.event}
                            className="w-full h-full rounded-lg"
                            resizeMode="cover"
                        /> */}
                    </View>

                    <Text
                        className="font-psemibold text-sm text-white ml-3 w-[50px]"
                        numberOfLines={1}
                    >
                        Date
                    </Text>

                    <View className="flex justify-center flex-1 ml-3 gap-y-0">
                        <Text
                            className="text-xs text-gray-100 font-pregular"
                            numberOfLines={1}
                        >
                            {dateFormat(start, 'yyyy-MM-dd')}
                        </Text>
                    </View>
                </View>

                <View className="flex justify-center items-center flex-row flex-1">
                    <View className="w-[46px] h-[46px] rounded-lg  flex justify-center items-center p-0.5">
                        <Ionicons size={28} name='time' style={[{ color: 'white' }]} />
                    </View>

                    <Text
                        className="font-psemibold text-sm text-white ml-3 w-[50px]"
                        numberOfLines={1}
                    >
                        Start
                    </Text>

                    <View className="flex justify-center flex-1 ml-3 gap-y-0">
                        <Text
                            className="text-xs text-gray-100 font-pregular"
                            numberOfLines={1}
                        >
                            {dateFormat(start, 'HH:mm:ss')}
                        </Text>
                    </View>
                </View>

                <View className="flex justify-center items-center flex-row flex-1">
                    <View className="w-[46px] h-[46px] rounded-lg  flex justify-center items-center p-0.5">
                        <Ionicons size={28} name='time' style={[{ color: 'white' }]} />
                    </View>

                    <Text
                        className="font-psemibold text-sm text-white ml-3 w-[50px]"
                        numberOfLines={1}
                    >
                        End
                    </Text>

                    <View className="flex justify-center flex-1 ml-3 gap-y-0">
                        <Text
                            className="text-xs text-gray-100 font-pregular"
                            numberOfLines={1}
                        >
                            {dateFormat(end, 'HH:mm:ss')}
                        </Text>
                    </View>
                </View>

                <View className={`space-y-2 mt-2`}>
                    <Text className="text-base text-gray-100 font-pmedium">Venue</Text>

                    <View className="w-full h-16 px-4 bg-black-100 rounded-2xl border-2 border-black-200 flex flex-row items-center">
                        <TextInput editable={false} multiline value={venue} className="text-white font-psemibold text-base" />
                    </View>
                </View>

                <View className={`space-y-2 mt-2`}>
                    <Text className="text-base text-gray-100 font-pmedium">Details</Text>

                    <View className="w-full h-[150px] px-4 bg-black-100 rounded-2xl border-2 border-black-200 flex flex-row items-center">
                        <TextInput editable={false} multiline value={details? details : 'No details.'} className="py-[10px] h-[150px] text-white font-psemibold text-base" />
                    </View>
                </View>

                { hosted_by == user?.id ? (
                    <View>
                        <CustomButton
                            title="Show QR Code"
                            handlePress={onShowQRCode}
                            containerStyles="mt-5 flex-auto"
                        />

                        <View className="mt-4 flex flex-row w-full">
                            <CustomButton
                                title="Invitation"
                                handlePress={onInvite}
                                containerStyles="mt-0 flex-auto w-48 mr-4"
                            />
                            <CustomButton
                                title="Attendance"
                                handlePress={onAttendance}
                                containerStyles="mt-0 flex-auto w-48"
                            />
                        </View>

                        <CustomButton
                            title="Delete Event"
                            handlePress={onDelete}
                            containerStyles="mt-5 flex-auto bg-red-500"
                            isLoading={isSubmitting}
                        />
                    </View>
                ) : (
                    <View>
                        <View className={`space-y-2 mt-2`}>
                            <Text className="text-base text-gray-100 font-pmedium">My Attendence</Text>

                            <View className="w-full h-16 px-4 bg-black-100 rounded-2xl border-2 border-black-200 flex flex-row items-center">
                                <TextInput editable={false} multiline value={myAttendStatus} className="text-white font-psemibold text-base" />
                            </View>
                        </View>

                        <CustomButton
                            title="Refresh Attendance"
                            handlePress={fetchMyAttendance}
                            containerStyles="mt-5 flex-auto"
                        />

                        <CustomButton
                            title="Scan QR Code"
                            handlePress={onScanQRCode}
                            containerStyles="mt-5 flex-auto"
                        />

                        {/* { 
                            myAttendStatus !== "Absent" ? (
                                <CustomButton
                                    title="Scan QR Code"
                                    handlePress={onScanQRCode}
                                    containerStyles="mt-5 flex-auto"
                                />
                            ) : null
                        } */}
                    </View>
                )}
                
            </ScrollView>
        </SafeAreaView>
    )
}

export default EventDetailsScreen;