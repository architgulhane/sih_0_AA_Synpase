import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

export default function DSIScreen() {
  return (
    <SafeAreaView className="flex-1 bg-background p-4">
      <View className="flex-row justify-between items-center mb-6">
        <Text className="text-3xl font-bold text-white">DSI & Credits</Text>
        <TouchableOpacity>
          <Ionicons name="wallet-outline" size={28} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Wallet Card */}
        <View className="bg-gradient-to-r from-blue-900 to-purple-900 p-6 rounded-2xl mb-6 border border-gray-700">
          <Text className="text-gray-300 mb-1">Total Balance</Text>
          <Text className="text-4xl font-bold text-white mb-4">2,150 <Text className="text-lg text-accent">BIO</Text></Text>
          
          <View className="flex-row gap-3">
            <TouchableOpacity className="bg-white/20 px-4 py-2 rounded-lg flex-row items-center">
              <Ionicons name="arrow-up" size={16} color="white" />
              <Text className="text-white font-bold ml-2">Send</Text>
            </TouchableOpacity>
            <TouchableOpacity className="bg-white/20 px-4 py-2 rounded-lg flex-row items-center">
              <Ionicons name="arrow-down" size={16} color="white" />
              <Text className="text-white font-bold ml-2">Receive</Text>
            </TouchableOpacity>
          </View>
        </View>

        <Text className="text-white font-bold text-xl mb-4">Recent Transactions</Text>

        {[1, 2, 3].map((i) => (
          <View key={i} className="bg-card p-4 rounded-xl border border-gray-800 mb-3 flex-row justify-between items-center">
            <View className="flex-row items-center">
              <View className="w-10 h-10 rounded-full bg-green-900/30 items-center justify-center mr-3">
                <MaterialCommunityIcons name="leaf" size={20} color="#4ADE80" />
              </View>
              <View>
                <Text className="text-white font-bold">Minted Credits</Text>
                <Text className="text-gray-500 text-xs">Sample #A4B{i}</Text>
              </View>
            </View>
            <Text className="text-green-400 font-bold">+50 BIO</Text>
          </View>
        ))}

        <View className="mt-4 bg-card p-4 rounded-xl border border-gray-800">
          <Text className="text-white font-bold text-lg mb-2">Access Benefit Sharing</Text>
          <Text className="text-gray-400 text-sm mb-4">
            Your contributions have been used in 3 commercial research projects.
          </Text>
          <TouchableOpacity className="bg-accent py-3 rounded-lg items-center">
            <Text className="text-background font-bold">View Contracts</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
