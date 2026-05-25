import { useAuth } from "@clerk/expo";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

export default function Profile() {

    const { signOut } = useAuth();
    const handleSignOut = async () => {
        try {
            await signOut();
            router.replace("/sign-in");
        } catch (error) {
            console.error("Error signing out:", error);
        }
    };
    
    
    return (
        <><View>
            <Text>Profile</Text>
        </View>
            {/* sign out */}
            <View className="px-6 mt-auto mb-8">
                <TouchableOpacity
                    onPress={handleSignOut}
                    className="flex-row items-center justify-center gap-2 bg-red-50 py-4 rounded-2xl border border-red-100"
                >
                    <Ionicons name="log-out-outline" size={20} color="#EF4444" />
                    <Text className="text-red-500 font-semibold text-base">Sign Out</Text>
                </TouchableOpacity>
            </View></>
    );
}
