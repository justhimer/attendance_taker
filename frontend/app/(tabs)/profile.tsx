// // rnfe

import { Text, View } from 'react-native';
import React, { useEffect } from 'react';
// import { StatusBar } from 'expo-status-bar';
// import useAPI from '@/utils/UseAPI';
// import { getCurrentUser } from '@/apis/userAPI';
// import { useGlobalContext } from '@/context/GlobalProvider';

const Profile = () => {
  // const { user, setUser, setIsLogged } = useGlobalContext();
  // const { data: user } = useAPI(() => getCurrentUser());

  // const logout = async () => {
  //   await signOut();
  //   setUser(null);
  //   setIsLogged(false);

  //   router.replace("/sign-in");
  // };

  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text className="text-3xl font-pblack">Profile</Text>
    </View>
  )
}

export default Profile