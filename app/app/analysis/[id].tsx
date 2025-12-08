import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { useLocalSearchParams, Stack, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useStore } from '../../store/useStore';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

export default function AnalysisDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { getSample } = useStore();
  const sample = getSample(id);

  if (!sample) {
    return (
      <SafeAreaView className="flex-1 bg-background items-center justify-center">
        <Text className="text-white">Sample not found</Text>
      </SafeAreaView>
    );
  }

  const analysis = sample.latestAnalysis || {};
  const results = analysis.results || [];
  const totalSequences = analysis.count || analysis.total_sequences || 0;

  const renderPredictionItem = ({ item, index }: { item: any, index: number }) => (
    <View className="bg-card p-4 rounded-xl border border-gray-800 mb-3">
      <View className="flex-row justify-between items-start mb-2">
        <Text className="text-white font-bold text-lg">{item.header || `Sequence ${index + 1}`}</Text>
        <View className="bg-green-900/30 px-2 py-1 rounded-md">
          <Text className="text-green-400 text-xs font-bold">{(item.prediction?.class_prob * 100).toFixed(1)}% Conf.</Text>
        </View>
      </View>
      
      <View className="flex-row justify-between mb-2">
        <View>
          <Text className="text-gray-500 text-xs">Class</Text>
          <Text className="text-accent font-medium">{item.prediction?.class || 'Unknown'}</Text>
        </View>
        <View>
          <Text className="text-gray-500 text-xs">Genus</Text>
          <Text className="text-white font-medium">{item.prediction?.genus || 'Unknown'}</Text>
        </View>
      </View>

      <View className="mt-2 pt-2 border-t border-gray-800">
         <Text className="text-gray-500 text-xs">Sequence Length: <Text className="text-gray-300">{item.sequence_length}</Text></Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['bottom']}>
      <Stack.Screen options={{ 
        headerShown: true,
        title: 'Analysis Results',
        headerStyle: { backgroundColor: '#0B1121' },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: 'bold' },
        headerLeft: () => (
          <TouchableOpacity onPress={() => router.back()} className="mr-4">
            <Ionicons name="chevron-back" size={24} color="white" />
          </TouchableOpacity>
        ),
      }} />
      
      <View className="p-4 bg-background flex-1">
        <View className="flex-row justify-between items-center mb-6">
          <View>
            <Text className="text-3xl font-bold text-white">Predictions</Text>
            <Text className="text-gray-500">Based on AI Model v2.1</Text>
          </View>
          <View className="bg-card px-4 py-2 rounded-xl border border-gray-800 items-center">
             <Text className="text-gray-400 text-xs">Total Sequences</Text>
             <Text className="text-white font-bold text-xl">{totalSequences}</Text>
          </View>
        </View>

        <FlatList
          data={results}
          renderItem={renderPredictionItem}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={{ paddingBottom: 20 }}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View className="items-center justify-center mt-10">
              <Text className="text-gray-500">No predictions available yet.</Text>
            </View>
          }
        />
      </View>
    </SafeAreaView>
  );
}
