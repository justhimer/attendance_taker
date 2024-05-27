import { View, Text, KeyboardAvoidingView, SafeAreaView, ScrollView, Button, Alert } from 'react-native'
import React, { useState } from 'react'
import { FormField, CustomButton } from '@/components';
import DateTimePicker from '@react-native-community/datetimepicker';
import FormFieldLarger from '@/components/FormFieldLarger';
import { createEvent } from '@/apis/eventAPI';
import { router } from 'expo-router';

const CreateEvent = () => {
    const [keyboardOffset, setKeyboardOffset] = useState(0);
    const onFieldFocus = (offset: number) => {
        setKeyboardOffset(offset);
    };
  
    const handleStartChange = (event: any, selectedDate: any) => {
      const currentDate = selectedDate || form.start;
      setForm({ ...form, start: currentDate });
    };

    const handleEndChange = (event: any, selectedDate: any) => {
        const currentDate = selectedDate || form.end;
        setForm({ ...form, end: currentDate });
    };

    const [isSubmitting, setSubmitting] = useState(false);
    
    const [form, setForm] = useState({
        title: "",
        start: new Date(),
        end: new Date(),
        venue: "",
        details: "",
    });

    const onCreateEvent = async () => {
        if (form.title === "" || form.venue === "") {
            Alert.alert("Error", "Please fill in title and venue");
            return;
          }

        // check if start date is before end date
        if (form.start > form.end) {
            Alert.alert("Error", "Start date should be before end date");
            return;
        }
      
          setSubmitting(true);
          try {
            const result = await createEvent(form);
            if (result) {
              Alert.alert("Success", "Event created successfully");
              router.replace("(tabs)/events/event_list");
            }
          } catch (error) {
            Alert.alert("Error", (error as Error).message);
          } finally {
            setSubmitting(false);
          }
    }

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView>
        <View className="w-full flex justify-center h-full px-4 my-3">
            <KeyboardAvoidingView behavior='position' keyboardVerticalOffset={keyboardOffset}>
                <Text className="text-2xl font-semibold text-white mt-0 font-psemibold">
                    Create Event
                </Text>

                <FormField
                    title="Title"
                    value={form.title}
                    handleChangeText={(e: any) => setForm({ ...form, title: e })}
                    otherStyles="mt-10"
                    onFocus={() => onFieldFocus(-250)}
                />

                <Text className="text-base text-gray-100 font-pmedium mt-5">
                    Start Date & Time:
                    {/* {` ${start.toLocaleDateString()} ${start.toLocaleTimeString()}`} */}
                </Text>

                <DateTimePicker
                    value={form.start? new Date(form.start) : new Date()}
                    mode="datetime" // or "date" for date picker only
                    display="default"
                    themeVariant="dark"
                    onChange={handleStartChange}
                />

                <Text className="text-base text-gray-100 font-pmedium mt-5">
                    End Date & Time:
                </Text>

                <DateTimePicker
                    value={form.end? new Date(form.end) : new Date()}
                    mode="datetime" // or "date" for date picker only
                    display="default"
                    themeVariant="dark"
                    onChange={handleEndChange}
                />
                
                <FormField
                    title="Venue"
                    value={form.venue}
                    handleChangeText={(e: any) => setForm({ ...form, venue: e })}
                    otherStyles="mt-5"
                    onFocus={() => onFieldFocus(-50)}
                />

                <FormFieldLarger
                    title="Details"
                    value={form.details}
                    handleChangeText={(e: any) => setForm({ ...form, details: e })}
                    otherStyles="mt-5"
                    onFocus={() => onFieldFocus(40)}
                />

                <CustomButton
                    title="Create"
                    handlePress={onCreateEvent}
                    containerStyles="mt-7"
                />

            </KeyboardAvoidingView>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default CreateEvent