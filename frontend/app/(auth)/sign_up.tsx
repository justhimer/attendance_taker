import { useState } from "react";
import { Link, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, ScrollView, Dimensions, Alert, Image, KeyboardAvoidingView } from "react-native";

import images from "../../constants/Images";
import { CustomButton, FormField } from "../../components";
import { useGlobalContext } from "../../context/GlobalProvider";
import { createUser } from "@/apis/userAPI";
import { signIn } from "@/apis/authAPI";

const SignUp = () => {
  const { setUser, setIsLogged } = useGlobalContext();
  const [isSubmitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    phone: "",
  });

  const submit = async () => {
    if (form.username === "" || form.email === "" || form.password === "" || form.phone === "") {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    setSubmitting(true);
    try {
      const signUpResult = await createUser(form);
      const signInResult = await signIn({ email: form.email, password: form.password });
      setUser(signInResult);
      setIsLogged(true);

      Alert.alert("Success", "User registered successfully");
      router.replace("/profile");
    } catch (error) {
      Alert.alert("Error", (error as Error).message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView>
      <View
          className="w-full flex justify-center h-full px-4 my-3"
          style={{
            minHeight: Dimensions.get("window").height - 200,
          }}
        >
          <KeyboardAvoidingView behavior='position' keyboardVerticalOffset={-150}>
            <Image
              source={images.logo}
              resizeMode="contain"
              className="w-[250px] h-[250px] mx-auto"
            />

            <Text className="text-2xl font-semibold text-white mt-0 font-psemibold">
              Sign Up to Attendance Taker
            </Text>

            <FormField
              title="Username"
              value={form.username}
              handleChangeText={(e: any) => setForm({ ...form, username: e })}
              otherStyles="mt-10"
            />

            <FormField
              title="Email"
              value={form.email}
              handleChangeText={(e: any) => setForm({ ...form, email: e })}
              otherStyles="mt-7"
              keyboardType="email-address"
            />

            <FormField
              title="Password"
              value={form.password}
              handleChangeText={(e: any) => setForm({ ...form, password: e })}
              otherStyles="mt-7"
            />

            <FormField
              title="Phone"
              value={form.phone}
              handleChangeText={(e: any) => setForm({ ...form, phone: e })}
              otherStyles="mt-7"
            />

            <CustomButton
              title="Sign Up"
              handlePress={submit}
              containerStyles="mt-7"
              isLoading={isSubmitting}
            />

            <View className="flex justify-center pt-5 flex-row gap-2">
              <Text className="text-lg text-gray-100 font-pregular">
                Have an account already?
              </Text>
              <Link
                href="sign_in"
                className="text-lg font-psemibold text-secondary"
              >
                Login
              </Link>
            </View>
          </KeyboardAvoidingView>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignUp;