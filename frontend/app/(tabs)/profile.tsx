import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Image, FlatList, TouchableOpacity, Dimensions, Alert, ScrollView, KeyboardAvoidingView } from "react-native";

import icons from "../../constants/Icons";
import useAPI from "../../utils/UseAPI";
import { patchUser, getCurrentUser } from "@/apis/userAPI";
import { signOut } from "@/apis/authAPI";
import { useGlobalContext } from "../../context/GlobalProvider";
import EmptyState from "@/components/EmptyState";
import InfoBox from "@/components/InfoBox";
import FormField from "@/components/FormField";
import { useEffect, useState } from "react";
import CustomButton from "@/components/CustomButton";
import images from "@/constants/Images";

const Profile = () => {
  const { user, setUser, setIsLogged } = useGlobalContext();
  const [isSubmitting, setSubmitting] = useState(false);
  const [displayUser, setDisplayUser] = useState({
    id: -1,
    email: "loading",
    username: "loading",
    password: "",
    phone: "loading",
  });

  useEffect(() => {
    if (user) {
      setDisplayUser({
        id: user.id,
        email: user.email,
        username: user.username,
        password: "",
        phone: user.phone ? user.phone : "",
      });
    }
  }, [user]);

  const logout = async () => {
    await signOut();
    setUser(null);
    setIsLogged(false);

    router.replace("(auth)/sign_in");
  };

  const changeUsername = async () => {
    if (displayUser.username === "") {
      Alert.alert("Error", "Please fill in username");
      return;
    }

    setSubmitting(true);

    try {
      const result = await patchUser(displayUser.id, { username: displayUser.username });
      setUser(result);
      setIsLogged(true);

      Alert.alert("Success", "User signed in successfully");
    } catch (error) {
      Alert.alert("Error", (error as Error).message);
    } finally {
      setSubmitting(false);
    }
  };

  const changePassword = async () => {
    if (displayUser.password === "") {
      Alert.alert("Error", "Please fill in password");
      return;
    }

    setSubmitting(true);

    try {
      const result = await patchUser(displayUser.id, { password: displayUser.password });
      setUser(result);
      setIsLogged(true);

      Alert.alert("Success", "User signed in successfully");
    } catch (error) {
      Alert.alert("Error", (error as Error).message);
    } finally {
      setSubmitting(false);
    }
  }

  const changePhone = async () => {
    if (displayUser.phone === "") {
      Alert.alert("Error", "Please fill in phone number");
      return;
    }

    setSubmitting(true);

    try {
      const result = await patchUser(displayUser.id, { phone: displayUser.phone });
      setUser(result);
      setIsLogged(true);

      Alert.alert("Success", "User signed in successfully");
    } catch (error) {
      Alert.alert("Error", (error as Error).message);
    } finally {
      setSubmitting(false);
    }
  }

  const resetUsername = () => {
    setDisplayUser({ ...displayUser, username: user?.username || "" });
  };

  const resetPassword = () => {
    setDisplayUser({ ...displayUser, password: "" });
  }

  const resetPhone = () => {
    setDisplayUser({ ...displayUser, phone: user?.phone || "" });
  }

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView>
        <KeyboardAvoidingView behavior='position' keyboardVerticalOffset={-150}>
          <View className="w-full flex justify-center items-center mt-6 mb-12 px-4">
            <TouchableOpacity
              onPress={logout}
              className="flex w-full items-end mb-10"
            >
              <Image
                source={icons.logout}
                resizeMode="contain"
                className="w-6 h-6"
              />
            </TouchableOpacity>

            <View className="w-16 h-16 border border-secondary rounded-lg flex justify-center items-center">
              <Image
                source={images.profile}
                className="w-[90%] h-[90%] rounded-lg"
                resizeMode="cover"
              />
            </View>

            <InfoBox
              title={displayUser.email}
              containerStyles="mt-1"
              titleStyles="text-lg"
            />

            <FormField
              title="Username"
              value={displayUser.username}
              handleChangeText={(e: any) => setDisplayUser({ ...displayUser, username: e })}
              otherStyles="mt-7"
              keyboardType="email-address"
            />

            <View className="mt-2 flex flex-row w-full">
              <CustomButton
                title="Change"
                handlePress={changeUsername}
                containerStyles="mt-0 flex-auto w-48 mr-4"
                isLoading={isSubmitting}
              />
              <CustomButton
                title="Reset"
                handlePress={resetUsername}
                containerStyles="mt-0 flex-auto w-48"
                textStyles="text-white"
                isLoading={isSubmitting}
              />
            </View>

            <FormField
              title="Password"
              value={displayUser.password}
              handleChangeText={(e: any) => setDisplayUser({ ...displayUser, password: e })}
              otherStyles="mt-7"
            />

            <View className="mt-2 flex flex-row w-full">
              <CustomButton
                title="Change"
                handlePress={changePassword}
                containerStyles="mt-0 flex-auto w-48 mr-4"
                isLoading={isSubmitting}
              />
              <CustomButton
                title="Reset"
                handlePress={resetPassword}
                containerStyles="mt-0 flex-auto w-48"
                textStyles="text-white"
                isLoading={isSubmitting}
              />
            </View>

            <FormField
              title="Phone Number"
              value={displayUser.phone}
              handleChangeText={(e: any) => setDisplayUser({ ...displayUser, phone: e })}
              otherStyles="mt-7"
            />

            <View className="mt-2 flex flex-row w-full">
              <CustomButton
                title="Change"
                handlePress={changeUsername}
                containerStyles="mt-0 flex-auto w-48 mr-4"
                isLoading={isSubmitting}
              />
              <CustomButton
                title="Reset"
                handlePress={resetUsername}
                containerStyles="mt-0 flex-auto w-48"
                textStyles="text-white"
                isLoading={isSubmitting}
              />
            </View>
          </View>
        </KeyboardAvoidingView>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Profile;