import { View, Text, TouchableOpacity, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import QRCode from 'react-native-qrcode-svg';
import { useLocalSearchParams } from 'expo-router';
import images from "@/constants/Images";
import { SafeAreaView } from 'react-native-safe-area-context';
import { patchEvent } from '@/apis/eventAPI';
import * as Crypto from 'expo-crypto';
import CustomButton from '@/components/CustomButton';

export interface QRCodeData {
    event_id: number;
    uuid: string;
}

const ShowQR = () => {
    const { id }: any = useLocalSearchParams();
    const [qrCodeValue, setQRCodeValue] = useState('none');
    const [isToggled, setIsToggled] = useState(false);

    function generateRandomUUID() {
        return Crypto.randomUUID();
    }

    const generateQRCodeValue = async () => {
        const newUUID = generateRandomUUID();
        await patchEvent(id, { qr_uuid: newUUID });
        
        const qrCodeValue: QRCodeData = {
            event_id: id,
            uuid: newUUID
        };
        return JSON.stringify(qrCodeValue);
    };

    const getQRCodeValue = async () => {
        const value = await generateQRCodeValue();
        setQRCodeValue(value);
    };

    useEffect(() => {
        getQRCodeValue();
    }, []);

    useEffect(() => {
        if (isToggled) {
            getQRCodeValue();
            const interval = setInterval(getQRCodeValue, 20000); // Toggle every 20 seconds

            return () => clearInterval(interval);
        }
    }, [isToggled]);

    const handleToggle = () => {
        setIsToggled(!isToggled);
    };

    return (
        <SafeAreaView className="bg-white h-full">
        <View className="w-full flex justify-center items-center h-full">
            <QRCode
                value={qrCodeValue}
                logo={images.logo}
                logoSize={100}
                size={300}
                backgroundColor="transparent"
            />
            <CustomButton
                title={ isToggled ? 'Stop Refresh' : 'Start Refresh' }
                handlePress={handleToggle}
                containerStyles="mt-10 w-48"
            />
            <Text className="text-center mt-3 text-sm text-black font-psemibold">
               Now { isToggled ? 'Refreshing QR Code Every 20 Seconds' : 'Not Refreshing QR Code' }
            </Text>
            {/* <TouchableOpacity onPress={handleToggle}>
                <Text>{isToggled ? 'Stop Toggling' : 'Start Toggling'}</Text>
            </TouchableOpacity> */}
        </View>
        </SafeAreaView>
    );
};

export default ShowQR;

// import { View, Text, TouchableOpacity, Alert } from 'react-native';
// import React, { useEffect, useState } from 'react';
// import QRCode from 'react-native-qrcode-svg';
// import { useLocalSearchParams } from 'expo-router';
// import images from "@/constants/Images";
// import { SafeAreaView } from 'react-native-safe-area-context';
// import { patchEvent } from '@/apis/eventAPI';
// import CustomButton from '@/components/CustomButton';

// const ShowQR = () => {
//     const { id, title }: any = useLocalSearchParams();
//     const [qrCodeValue, setQRCodeValue] = useState("none");

//     function generateRandomUUID() {
//       return crypto.randomUUID();
//     }
  
//     const generateQRCodeValue = async () => {
//         const newUUID = generateRandomUUID();
//         const result = await patchEvent(id, { qr_uuid: newUUID });
//         if (!result) {
//             Alert.alert("Error", "Failed to update QR code ID");
//             setQRCodeValue("none");
//         }
//         const qrCodeValue = JSON.stringify({
//             id: id,
//             title: title,
//             uuid: newUUID
//         });
//         console.log(qrCodeValue);
//         setQRCodeValue(qrCodeValue);
//     }

//     const generateQRCode = async () => {
//         await generateQRCodeValue();
//     };

//     useEffect(() => {
//         generateQRCode();
//     }, []);

//     const onRefresh = async () => {}
//     const onStop = async () => {}

//     return (
//         <SafeAreaView className="bg-white h-full">
//             <View className="w-full flex justify-center items-center h-full">
//                 <QRCode
//                     value={qrCodeValue}
//                     logo={images.logo}
//                     logoSize={100}
//                     size={300}
//                     backgroundColor="transparent"
//                 />
//             </View>
//             <View className="mt-4 flex flex-row w-full">
//                 <CustomButton
//                     title="Refresh / 20s"
//                     handlePress={onRefresh}
//                     containerStyles="mt-0 flex-auto w-48 mr-4"
//                 />
//                 <CustomButton
//                     title="Stop"
//                     handlePress={onStop}
//                     containerStyles="mt-0 flex-auto w-48"
//                 />
//             </View>
//         </SafeAreaView>
//     )
// }

// export default ShowQR;