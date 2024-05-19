import { View, Text } from 'react-native';
import React from 'react';
import QRCode from 'react-native-qrcode-svg';
import { useLocalSearchParams } from 'expo-router';
import images from "@/constants/Images";
import { SafeAreaView } from 'react-native-safe-area-context';

const ShowQR = () => {
    const { 
        id, 
    }: any = useLocalSearchParams();

    return (
        <SafeAreaView className="bg-white h-full">
            <View className="w-full flex justify-center items-center h-full">
                {/* <Text className="text-2xl font-bold text-yellow-500">ID {id}</Text> */}
                <QRCode
                    value={id}
                    logo={images.logo}
                    logoSize={100}
                    size={300}
                    backgroundColor="transparent"
                />
            </View>
        </SafeAreaView>
    )
}

export default ShowQR