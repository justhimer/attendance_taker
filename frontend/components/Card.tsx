import { useState } from "react";
// import { ResizeMode, Video } from "expo-av";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { format as dateFormat, parseISO } from 'date-fns';

export interface ICardData {
    title: string;
    date: string;
    venue: string;
}

import icons from "../constants/Icons";
import images from "@/constants/Images";

const Card = (data: ICardData) => {
  return (
    <View className="flex flex-col items-center px-4 mb-5">
      <View className="flex flex-row gap-3 items-start">
        <View className="flex justify-center items-center flex-row flex-1">
          <View className="w-[46px] h-[46px] rounded-lg border border-secondary flex justify-center items-center p-0.5">
            <Image
              source={images.event}
              className="w-full h-full rounded-lg"
              resizeMode="cover"
            />
          </View>

          <View className="flex justify-center flex-1 ml-3 gap-y-0">
            <Text
                className="text-xs text-yellow-500 font-pregular"
                numberOfLines={1}
            >
                {dateFormat(data.date, 'yyyy-MM-dd HH:mm:ss')}
            </Text>
            <Text
              className="font-psemibold text-sm text-white"
              numberOfLines={1}
            >
              {data.title}
            </Text>
            {/* <Text
              className="text-xs text-gray-100 font-pregular"
              numberOfLines={1}
            >
              {data.venue}
            </Text> */}
          </View>
        </View>

        <View className="pt-4">
          <Image source={icons.menu} className="w-5 h-5" resizeMode="contain" />
        </View>
      </View>

      {/* {play ? (
        <Video
          source={{ uri: video }}
          className="w-full h-60 rounded-xl mt-3"
          resizeMode={ResizeMode.CONTAIN}
          useNativeControls
          shouldPlay
          onPlaybackStatusUpdate={(status) => {
            if (status.didJustFinish) {
              setPlay(false);
            }
          }}
        />
      ) : (
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => setPlay(true)}
          className="w-full h-60 rounded-xl mt-3 relative flex justify-center items-center"
        >
          <Image
            source={{ uri: thumbnail }}
            className="w-full h-full rounded-xl mt-3"
            resizeMode="cover"
          />

          <Image
            source={icons.play}
            className="w-12 h-12 absolute"
            resizeMode="contain"
          />
        </TouchableOpacity>
      )} */}
    </View>
  );
};

export default Card;