import { View, Text, FlatList, RefreshControl, Alert, Pressable } from 'react-native'
import React, { useEffect, useState } from 'react'
import useAPI from '@/utils/UseAPI';
import { createContact, getContacts } from '@/apis/contactAPI';
import { SafeAreaView } from 'react-native-safe-area-context';
import EmptyState from '@/components/EmptyState';
import CustomButton from '@/components/CustomButton';
import { useGlobalContext } from '@/context/GlobalProvider';
import useAPI_WithParams from '@/utils/UseAPI_WithParams';
import { createInvitations, getSentInvitations } from '@/apis/invitationAPI';
import { useLocalSearchParams } from 'expo-router';
import InviteCard from '@/components/InviteCard';

const Invite = () => {
    const { eventId }: any = useLocalSearchParams();  // id means event_id

    // const { user } = useGlobalContext();
    const { data: contacts, refetch: refetchContacts } = useAPI(getContacts);
    const { data: sentInvitations, refetch: refetchSentInvitations } = useAPI_WithParams(getSentInvitations, +eventId);

    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = async () => {
        setRefreshing(true);
        await refetchContacts();
        await refetchSentInvitations();
        setRefreshing(false);
    };

    const [sendUserIds, setSendUserIds] = useState<number[]>([]);

    useEffect(() => {
        if (sentInvitations) {
            setSendUserIds(sentInvitations.map((invitation: any) => invitation.user_id));
        }
    }, [sentInvitations]);

    const [showContacts, setShowContacts] = useState<any[]>([]);

    useEffect(() => {
        if (contacts) {
            setShowContacts(contacts.filter((contact: any) => !sendUserIds.includes(+contact.contact_id)));
        }
    }, [contacts, sendUserIds]);

    const [selectedContactUsers, setSelectedContactUsers] = useState<number[]>([]);

    const toggleSelectedContact = (id: number) => {
        // console.log('selectedContactUsers', selectedContactUsers);
        if (selectedContactUsers.includes(id)) {
            setSelectedContactUsers(selectedContactUsers.filter((contact) => contact !== id));
        } else {
            setSelectedContactUsers([...selectedContactUsers, id]);
        }
    }

    const onInvite = () => {
        if (selectedContactUsers.length > 0) {
            Alert.alert('Invite', 'Are you sure you want to invite these contacts?', [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'OK',
                    onPress: async () => {
                        try {
                            const result = await createInvitations(+eventId, selectedContactUsers);
                            if (result) {
                                refetchSentInvitations();
                                Alert.alert('Success', 'Invitations sent successfully');
                            } else {
                                Alert.alert('Error', 'Failed to send invitations');
                            }
                        } catch (error) {
                            Alert.alert('Error', (error as Error).message);
                        }
                    },
                },
            ]);
        } else {
            Alert.alert('Error', 'Please select at least one contact to invite');
        }
    }

    return (
        <SafeAreaView className="bg-primary h-full">
            <FlatList
                data={showContacts}
                keyExtractor={(item: any) => item.id}
                renderItem={({ item }) => (
                    <Pressable
                        onPress={() => toggleSelectedContact(+item.contact.id)}
                        // className={`bg-${selectedContacts.includes(+item.id) ? 'transparent' : 'primary'} p-4`}
                    >
                        <InviteCard
                            id={+item.contact.id}
                            username={item.contact.username}
                            email={item.contact.email}
                            color={selectedContactUsers.includes(+item.contact.id) ? 'red-500' : 'transparent'}
                        />
                    </Pressable>
                )}
                ListHeaderComponent={() => (
                    <View className="flex my-6 px-4 space-y-6">
                        <View className="flex justify-between items-start flex-row mb-6">
                            <Text className="text-2xl font-psemibold text-white">
                                Invite Contacts
                            </Text>
                        </View>
                    </View>
                )}
                ListFooterComponent={() => (
                    <View className="flex my-6 px-4 space-y-6">
                        <CustomButton
                            title="Invite"
                            handlePress={onInvite}
                        />
                    </View>
                )}
                ListEmptyComponent={() => (
                    <EmptyState
                        title="No Contacts Found"
                        subtitle="Please add some contacts"
                    />
                )}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            />
        </SafeAreaView>
    );
}

export default Invite;