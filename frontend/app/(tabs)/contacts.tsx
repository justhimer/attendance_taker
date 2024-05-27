import { View, Text, FlatList, RefreshControl, Alert } from 'react-native'
import React, { useState } from 'react'
import useAPI from '@/utils/UseAPI';
import { createContact, getContacts } from '@/apis/contactAPI';
import { SafeAreaView } from 'react-native-safe-area-context';
import ContactCard from '@/components/ContactCard';
import EmptyState from '@/components/EmptyState';
import CustomButton from '@/components/CustomButton';
import { useGlobalContext } from '@/context/GlobalProvider';

const Contacts = () => {
    const { user } = useGlobalContext();
    const { data: contacts, refetch: refetchContacts } = useAPI(getContacts);

    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = async () => {
        setRefreshing(true);
        await refetchContacts();
        setRefreshing(false);
    };

    const onCreateContact = () => {
        Alert.prompt('Create Contact', 'Enter the user ID of the contact', async (contactUserID) => {
            if (contactUserID && user) {
                try {
                    const result = await createContact(user.id, +contactUserID);
                    if (result) {
                        refetchContacts();
                        Alert.alert('Success', 'Contact created successfully');
                    } else {
                        Alert.alert('Error', 'Failed to create contact');
                    }
                } catch (error) {
                    Alert.alert('Error', (error as Error).message);
                }
            }
        });
    }

    return (
        <SafeAreaView className="bg-primary h-full">
            <FlatList
                data={contacts}
                keyExtractor={(item: any) => item.id}
                renderItem={({ item }) => (
                    <View>
                        <ContactCard
                            id={+item.contact.id}
                            username={item.contact.username}
                            email={item.contact.email}
                        />
                    </View>
                )}
                ListHeaderComponent={() => (
                    <View className="flex my-6 px-4 space-y-6">
                        <View className="flex justify-between items-start flex-row mb-6">
                            <Text className="text-2xl font-psemibold text-white">
                                My Contacts
                            </Text>
                        </View>
                    </View>
                )}
                ListEmptyComponent={() => (
                    <EmptyState
                    title="No Contacts Found"
                    subtitle="Please add a contact"
                  />
                )}
                ListFooterComponent={() => (
                    <View className="mt-2 mx-4">
                        <CustomButton
                            title="Create Contact"
                            handlePress={onCreateContact}
                            containerStyles="mt-7"
                        />
                    </View>
                )}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            />
        </SafeAreaView>
    )
}

export default Contacts