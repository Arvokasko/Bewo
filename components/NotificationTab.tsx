import React, { useState } from "react";
import { View, Text, TouchableOpacity, Button } from "react-native";
import * as Notifications from "expo-notifications";

export default function NotificationTab() {
    const [selected, setSelected] = useState<{ [key: string]: boolean }>({
        Mon: false,
        Tue: false,
        Wed: false,
        Thu: false,
        Fri: false,
        Sat: false,
        Sun: false,
    });

    // Toggle a day’s checkbox
    const toggleCheckbox = (day: string) => {
        setSelected((prev) => ({ ...prev, [day]: !prev[day] }));
    };

    // Map short day names to Expo weekday numbers
    const weekdayMap: Record<string, 1 | 2 | 3 | 4 | 5 | 6 | 7> = {
        Sun: 1,
        Mon: 2,
        Tue: 3,
        Wed: 4,
        Thu: 5,
        Fri: 6,
        Sat: 7,
    };

    const triggerTestNotification = async () => {
        await Notifications.scheduleNotificationAsync({
            content: {
                title: "Test Notification",
                body: "This is a manual test!",
            },
            trigger: {
                type: "timeInterval",
                seconds: 5,
                repeats: false,
            } as Notifications.TimeIntervalTriggerInput,
        });
    };


    // Schedule notifications for selected days
    const scheduleNotifications = async () => {
        // Ask for permission first
        const { status } = await Notifications.requestPermissionsAsync();
        if (status !== "granted") {
            alert("Permission not granted for notifications!");
            return;
        }

        for (const day of Object.keys(selected)) {
            if (selected[day]) {
                await Notifications.scheduleNotificationAsync({
                    content: {
                        title: "Reminder!",
                        body: `It's ${day}, don't forget your task.`,
                    },
                    trigger: {
                        type: "calendar",
                        weekday: weekdayMap[day],
                        hour: 9,
                        minute: 0,
                        repeats: true,
                    } as Notifications.CalendarTriggerInput,
                });
            }
        }
        alert("Notifications scheduled!");
    };

    return (
        <View>
            {/* Day checkboxes */}
            <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
                {Object.keys(selected).map((day) => (
                    <TouchableOpacity
                        key={day}
                        onPress={() => toggleCheckbox(day)}
                        style={{ alignItems: "center", margin: 7 }}
                    >
                        <Text style={{ fontSize: 18 }}>{selected[day] ? "☑" : "☐"}</Text>
                        <Text style={{ color: "white" }}>{day}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* Confirm button */}
            <Button title="Set Notifications" onPress={scheduleNotifications} />
            <Button title="test Notifications" onPress={triggerTestNotification} />
        </View>
    );
}
