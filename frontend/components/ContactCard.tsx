import { deleteContact } from "@/apis/contactAPI";
import icons from "@/constants/Icons";
import images from "@/constants/Images";
import { Pressable, View, Image, Alert, Text } from "react-native";

export interface IContactCardData {
    id: number;
    username: string;
    email: string;
}


const ContactCard = (data: IContactCardData) => {
    const handleCardClick = () => {
        Alert.alert(
            'Delete Contact',
            'Are you sure you want to delete this contact?',
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'Delete',
                    onPress: () => {
                        deleteContact(data.id);
                    },
                },
            ],
            { cancelable: true }
        );
    }

    return (
            <Pressable onPress={handleCardClick} className="flex flex-col items-center px-4 mb-5">
                <View className="flex flex-row gap-3 items-start">
                    <View className="flex justify-center items-center flex-row flex-1">
                        <View className="w-[46px] h-[46px] rounded-lg border border-secondary flex justify-center items-center p-0.5">
                            <Image
                                source={images.profile}
                                className="w-full h-full rounded-lg"
                                resizeMode="cover"
                            />
                        </View>

                        <View className="flex justify-center flex-1 ml-3 gap-y-0">
                            <Text
                                className="text-xs text-yellow-500 font-pregular"
                                numberOfLines={1}
                            >
                                User ID: {data.id}
                            </Text>
                            <Text
                                className="font-psemibold text-sm text-white"
                                numberOfLines={1}
                            >
                                Username: {data.username}
                            </Text>
                            <Text
                                className="font-psemibold text-sm text-white"
                                numberOfLines={1}
                            >
                                Email: {data.email}
                            </Text>
                        </View>
                    </View>

                    <View className="pt-4">
                        <Image source={icons.menu} className="w-5 h-5" resizeMode="contain" />
                    </View>
                </View>
            </Pressable>
    )
}

export default ContactCard