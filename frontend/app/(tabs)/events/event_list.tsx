import { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { FlatList, Image, RefreshControl, Text, View, StyleSheet } from "react-native";

import images from "../../../constants/Images";
import useAPI from "../../../utils/UseAPI";
import { getAttendEvents, getHostEvents } from "../../../apis/eventAPI";
import { getInvitationsToMe } from "@/apis/invitationAPI";
import { IListItem, ListItems } from "@/components/ListItems";
import EmptyState from "@/components/EmptyState";
import EventCard from "@/components/EventCard";
import { Layout, Tab, TabBar, TabView, Text as UIText } from "@ui-kitten/components";
import CustomButton from "@/components/CustomButton";
import { router } from "expo-router";
// import { EmptyState, SearchInput, Trending, VideoCard } from "../../components";

const Events = () => {
  const { data: hostEvents, refetch: refetchHostEvents } = useAPI(getHostEvents);
  const { data: attendevents, refetch: refetchAttendEvents } = useAPI(getAttendEvents);

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetchHostEvents();
    await refetchAttendEvents();
    setRefreshing(false);
  };

  // const [listItems, setListItems] = useState<ICardData[]>([]);

  const [selectedIndex, setSelectedIndex] = useState(0);

  const onCreateEvent = () => {
    router.push("(tabs)/events/create_event");
  }

  // useEffect(() => {
  //   if (events) {
  //     const items = events.map((event: any) => ({
  //       title: event.title,
  //       date: event.start,
  //       venue: event.venue,
  //     }));
  //     setListItems(items);
  //   }
  // }, [events]);

  return (
    <SafeAreaView className="bg-primary h-full">
      <FlatList
        data={selectedIndex === 0 ? hostEvents : attendevents}
        keyExtractor={( item: any ) => item.id}
        renderItem={({ item }) => (
          <View>
            <EventCard
              id={+item.id}
              title={item.title}
              hosted_by={item.hosted_by}
              start={item.start}
              end={item.end}
              venue={item.venue}
              details={item.details}
            />
          </View>
        )}
        ListHeaderComponent={() => (
          <View className="flex my-6 px-4 space-y-6">
            <View className="flex justify-between items-start flex-row mb-6">
              <Text className="text-2xl font-psemibold text-white">
                Events
              </Text>
            </View>

            <TabBar
              style={styles.tabContainer}
              selectedIndex={selectedIndex}
              onSelect={index => setSelectedIndex(index)}
            >
              <Tab title='I HOST' />
              <Tab title='I JOIN' />
            </TabBar>
          </View>
        )}
        ListFooterComponent={() => selectedIndex === 0 ? (
          <View className="mt-2 mx-4">
            <CustomButton
              title="Create Event"
              handlePress={onCreateEvent}
              containerStyles="mt-7"
            />
          </View>
        ) : <></>} 
        ListEmptyComponent={() => (
          <EmptyState
            title="No Events Found"
            subtitle="Please host/join an event."
          />
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
      {/* <ListItems
        data={listItems}
      /> */}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  tabContainer: {
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
});

export default Events;