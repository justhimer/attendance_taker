import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { FlatList, RefreshControl, Text, View, StyleSheet } from "react-native";

import useAPI from "../../../utils/UseAPI";
import { getInvitationsToMe } from "@/apis/invitationAPI";
import EmptyState from "@/components/EmptyState";
import InvitationCard from "@/components/InvitationCard";

const Invitations = () => {
  const { data: invitations, refetch: refetchInvitations } = useAPI(getInvitationsToMe);

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetchInvitations();
    setRefreshing(false);
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <FlatList
        data={invitations}
        keyExtractor={( item: any ) => item.id}
        renderItem={({ item }) => (
          <View>
            <InvitationCard
              id={+item.event.id}
              title={item.event.title}
              host_by={item.event.host_by}
              start={item.event.start}
              end={item.event.end}
              venue={item.event.venue}
              details={item.event.details}
            />
          </View>
        )}
        ListHeaderComponent={() => (
          <View className="flex my-6 px-4 space-y-6">
            <View className="flex justify-between items-start flex-row mb-6">
              <Text className="text-2xl font-psemibold text-white">
                Invitations to Me
              </Text>
            </View>
          </View>
        )}
        ListEmptyComponent={() => (
          <EmptyState
            title="No Invitations Found"
            subtitle="Please wait for an invitation"
          />
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </SafeAreaView>
  );
};

export default Invitations;