import { useState } from "react";
// import { ResizeMode, Video } from "expo-av";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { format as dateFormat, parseISO } from 'date-fns';

export interface IEventData {
    title: string;
    host_by: string;
    start: string;
    end: string;
    venue: string;
    details: string;
}

import icons from "../constants/Icons";
import images from "@/constants/Images";

const Card = (data: IEventData) => {
  return (
    <View>

    </View>
  );
};

export default Card;