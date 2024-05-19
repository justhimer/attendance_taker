import { Link } from "expo-router";

import { View, Text, Pressable, Image } from 'react-native';
import React from 'react';
import icons from '@/constants/Icons';
import images from '@/constants/Images';
import { format as dateFormat, parseISO } from 'date-fns';

export interface IInvitationCardData {
  invitation_id: number;
  title: string;
  host_by: string;
  start: string;
  end: string;
  venue: string;
  details: string;
}

const InvitationCard = (data: IInvitationCardData) => {
  return (
    <Link
        href={{
          pathname: `(tabs)/invitations/invitation`,
          params: {
            invitation_id: data.invitation_id,
            title: data.title,
            host_by: data.host_by,
            start: data.start,
            end: data.end,
            venue: data.venue,
            details: data.details,
          }
        }}
        asChild
    >
      <Pressable className="flex flex-col items-center px-4 mb-5">
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
                  {dateFormat(data.start, 'yyyy-MM-dd')}
              </Text>
              <Text
                className="font-psemibold text-sm text-white"
                numberOfLines={1}
              >
                {data.title}
              </Text>
            </View>
          </View>

          <View className="pt-4">
            <Image source={icons.menu} className="w-5 h-5" resizeMode="contain" />
          </View>
        </View>
      </Pressable>
    </Link>
  );
};

export default InvitationCard;