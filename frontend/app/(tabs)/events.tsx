import { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { FlatList, Image, RefreshControl, Text, View, StyleSheet } from "react-native";

import images from "../../constants/Images";
import useAPI from "../../utils/UseAPI";
import { getEvents } from "../../apis/eventAPI";
import { getInvitations } from "@/apis/invitationAPI";
import { IListItem, ListItems } from "@/components/ListItems";
import EmptyState from "@/components/EmptyState";
import Card, { ICardData } from "@/components/Card";
import { Layout, Tab, TabBar, TabView, Text as UIText } from "@ui-kitten/components";
import { getAttendEvents } from "@/apis/attendanceAPI";
// import { EmptyState, SearchInput, Trending, VideoCard } from "../../components";

const Events = () => {
  const { data: hostEvents, refetch: refetchHostEvents } = useAPI(getEvents);
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
            <Card
              title={item.title}
              start={item.start}
              venue={item.venue}
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
              <Tab title='I ATTEND' />
            </TabBar>

            {/* <SearchInput /> */}

            {/* <View className="w-full flex-1 pt-5 pb-8">
              <Text className="text-lg font-pregular text-gray-100 mb-3">
                Latest Videos
              </Text>

              <Trending posts={latestPosts ?? []} />
            </View> */}
          </View>
        )}
        ListEmptyComponent={() => (
          <EmptyState
            title="No Events Found"
            subtitle="Please join an event."
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