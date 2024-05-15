import { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { FlatList, Image, RefreshControl, Text, View } from "react-native";

import images from "../../constants/Images";
import useAPI from "../../utils/UseAPI";
import { getEvents } from "../../apis/eventAPI";
import { getInvitations } from "@/apis/invitationAPI";
import { IListItem, ListItems } from "@/components/ListItems";
import EmptyState from "@/components/EmptyState";
import SearchInput from "@/components/SearchInput";
// import { EmptyState, SearchInput, Trending, VideoCard } from "../../components";



const Home = () => {
  const { data: events, refetch } = useAPI(getEvents);
//   const { data: latestPosts } = useAPI(getLatestPosts);

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const [listItems, setListItems] = useState<IListItem[]>([]);

  useEffect(() => {
    if (events) {
      const items = events.map((event: any) => ({
        title: event.title,
        description: event.start,
      }));
      setListItems(items);
    }
  }, [events]);

  return (
    <SafeAreaView className="bg-primary">
      <FlatList
        data={events}
        keyExtractor={(item: any) => item.$id}
        renderItem={({ item }) => (
          <Text className="text-3xl">{item.title}</Text>
          // <VideoCard
          //   title={item.title}
          //   thumbnail={item.thumbnail}
          //   video={item.video}
          //   creator={item.creator.username}
          //   avatar={item.creator.avatar}
          // />
        )}
        ListHeaderComponent={() => (
          <View className="flex my-6 px-4 space-y-6">
            <View className="flex justify-between items-start flex-row mb-6">
              <View>
                <Text className="font-pmedium text-sm text-gray-100">
                  Welcome Back
                </Text>
                <Text className="text-2xl font-psemibold text-white">
                  User
                </Text>
              </View>

              <View className="mt-1.5">
                <Image
                  source={images.logo}
                  className="w-14 h-14"
                  resizeMode="contain"
                />
              </View>
            </View>

            <SearchInput />

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
            title="No Videos Found"
            subtitle="No videos created yet"
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

export default Home;