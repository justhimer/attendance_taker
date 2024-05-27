import { StyleSheet, Text, View, Image, ScrollView, TextInput, Alert } from 'react-native'
import React, { useState } from 'react'
import { Stack, router, useLocalSearchParams } from 'expo-router'
import InfoBox from '@/components/InfoBox';
import { SafeAreaView } from 'react-native-safe-area-context';
import images from '@/constants/Images';
import { format as dateFormat, parseISO } from 'date-fns';
import Ionicons from '@expo/vector-icons/Ionicons';
import CustomButton from '@/components/CustomButton';
import { deleteEvent } from '@/apis/eventAPI';
import { useGlobalContext } from '@/context/GlobalProvider';
import { InvitationStatus, createInvitation, updateInvitation } from '@/apis/invitationAPI';

// export interface IEventData {
//     title: string;
//     host_by: string;
//     start: string;
//     end: string;
//     venue: string;
//     details: string;
// }

const InvitationEventScreen = () => {
    const [isSubmitting, setSubmitting] = useState(false);

    const { 
        invitation_id,
        title,
        host_by,
        start,
        end,
        venue,
        details
    }: any = useLocalSearchParams();

    const onAccept = async () => {
        Alert.alert("Accept Invitation", "Are you sure you want to accept this invitation?", [
            {
                text: "Cancel",
                style: "cancel"
            },
            { text: "OK", onPress: onAcceptInvitation }
        ]);
    }

    const onReject = async () => {
        Alert.alert("Reject Invitation", "Are you sure you want to reject this invitation?", [
            {
                text: "Cancel",
                style: "cancel"
            },
            { text: "OK", onPress: onRejectInvitation }
        ]);
    }

    const onAcceptInvitation = async () => {
        setSubmitting(true);
        try {
            const res = await updateInvitation(invitation_id, InvitationStatus.ACCEPTED);

            if (res) {
                Alert.alert('Success', 'Invitation accepted successfully');
                router.replace('(tabs)/invitations/invitation_list');
            }
        } catch (error) {
            console.log(error);
            Alert.alert('Error', 'An error occurred while accepting invitation');
        } finally {
            setSubmitting(false);
        }
    };

    const onRejectInvitation = async () => {
        setSubmitting(true);
        try {
            const res = await updateInvitation(invitation_id, InvitationStatus.REJECTED);

            if (res) {
                Alert.alert('Success', 'Invitation rejected.');
                router.replace('(tabs)/invitations/invitation_list');
            }
        } catch (error) {
            console.log(error);
            Alert.alert('Error', 'An error occurred while rejecting invitation');
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

                <View className="mt-4 flex flex-row w-full">
                    <CustomButton
                        title="Accept"
                        handlePress={onAccept}
                        containerStyles="mt-0 flex-auto w-48 mr-4"
                    />
                    <CustomButton
                        title="Reject"
                        handlePress={onReject}
                        containerStyles="mt-0 flex-auto w-48 bg-red-500"
                    />
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default InvitationEventScreen;