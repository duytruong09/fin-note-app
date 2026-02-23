import { useState } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  cancelAnimation,
} from 'react-native-reanimated';
import { SafeAreaWrapper } from '@/components/layout/SafeAreaWrapper';
import { WaveformVisualizer } from '@/components/voice/WaveformVisualizer';
import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import { Loading } from '@/components/common/Loading';
import { useVoiceRecorder } from '@/hooks/useVoiceRecorder';
import { useVoiceStore } from '@/store';
import { formatCurrency } from '@/utils/format';
import { APP_CONFIG } from '@/constants/config';

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

export default function VoiceScreen() {
  const router = useRouter();
  const {
    isRecording,
    recordingDuration,
    hasPermission,
    startRecording,
    stopRecording,
    cancelRecording,
    requestPermission,
  } = useVoiceRecorder();

  const {
    isProcessing,
    transcript,
    parsedExpense,
    processVoice,
    clearVoiceData,
  } = useVoiceStore();

  const [showReview, setShowReview] = useState(false);

  // Pulse animation for record button
  const scale = useSharedValue(1);

  const handleStartRecording = async () => {
    if (hasPermission === false) {
      Alert.alert(
        'Microphone Permission Required',
        'Please enable microphone access in your device settings to use voice input.',
        [{ text: 'OK' }]
      );
      return;
    }

    if (hasPermission === null) {
      const granted = await requestPermission();
      if (!granted) {
        return;
      }
    }

    try {
      clearVoiceData();
      await startRecording();

      // Start pulse animation
      scale.value = withRepeat(
        withSequence(
          withTiming(1.1, { duration: 500 }),
          withTiming(1, { duration: 500 })
        ),
        -1,
        true
      );
    } catch (error: any) {
      Alert.alert('Recording Error', error.message || 'Failed to start recording');
    }
  };

  const handleStopRecording = async () => {
    try {
      const uri = await stopRecording();

      // Stop pulse animation
      cancelAnimation(scale);
      scale.value = withTiming(1, { duration: 200 });

      if (!uri) {
        Alert.alert('Error', 'Failed to save recording');
        return;
      }

      // Process voice
      await processVoice(uri, APP_CONFIG.DEFAULT_LANGUAGE);
      setShowReview(true);
    } catch (error: any) {
      Alert.alert('Processing Error', error.message || 'Failed to process voice input');
    }
  };

  const handleCancel = async () => {
    await cancelRecording();
    cancelAnimation(scale);
    scale.value = withTiming(1, { duration: 200 });
    clearVoiceData();
    setShowReview(false);
  };

  const handleSaveTransaction = () => {
    // Navigate to add transaction modal with pre-filled data
    router.push('/(modals)/add-transaction');
    clearVoiceData();
    setShowReview(false);
  };

  const animatedButtonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <SafeAreaWrapper>
      <View className="flex-1 p-6">
        {/* Header */}
        <View className="mb-8">
          <Text className="text-3xl font-bold text-gray-900 mb-2">
            Voice Input
          </Text>
          <Text className="text-gray-600">
            Speak naturally to create transactions
          </Text>
        </View>

        {/* Main Content */}
        <View className="flex-1 justify-center items-center">
          {!showReview ? (
            <>
              {/* Waveform Visualizer */}
              <View className="mb-8">
                <WaveformVisualizer isActive={isRecording} />
              </View>

              {/* Timer */}
              {isRecording && (
                <View className="mb-8">
                  <Text className="text-4xl font-bold text-primary-blue">
                    {formatTime(recordingDuration)}
                  </Text>
                  <Text className="text-gray-500 text-center mt-2">
                    / {formatTime(APP_CONFIG.MAX_AUDIO_DURATION)}
                  </Text>
                </View>
              )}

              {/* Record Button */}
              <AnimatedTouchable
                onPress={isRecording ? handleStopRecording : handleStartRecording}
                style={animatedButtonStyle}
                className={`w-32 h-32 rounded-full items-center justify-center ${
                  isRecording ? 'bg-red-500' : 'bg-primary-blue'
                }`}
                activeOpacity={0.8}
              >
                <Text className="text-6xl">
                  {isRecording ? '⏹️' : '🎤'}
                </Text>
              </AnimatedTouchable>

              <Text className="text-gray-600 text-center mt-6 max-w-xs">
                {isRecording
                  ? 'Tap to stop recording'
                  : 'Tap to start recording your expense'}
              </Text>

              {/* Cancel Button (when recording) */}
              {isRecording && (
                <Button
                  title="Cancel"
                  onPress={handleCancel}
                  variant="outline"
                  className="mt-6"
                />
              )}

              {/* Processing Indicator */}
              {isProcessing && (
                <View className="mt-8">
                  <Loading message="Processing voice..." />
                </View>
              )}
            </>
          ) : (
            <>
              {/* Review Screen */}
              <View className="w-full">
                {/* Transcript */}
                {transcript && (
                  <Card className="mb-4">
                    <Text className="text-sm text-gray-500 mb-2">Transcript</Text>
                    <Text className="text-base text-gray-900">{transcript}</Text>
                  </Card>
                )}

                {/* Parsed Data */}
                {parsedExpense && (
                  <Card className="mb-6">
                    <Text className="text-lg font-semibold text-gray-900 mb-4">
                      Parsed Transaction
                    </Text>

                    <View className="gap-3">
                      <View className="flex-row justify-between">
                        <Text className="text-gray-600">Amount</Text>
                        <Text className="text-xl font-bold text-gray-900">
                          {formatCurrency(parsedExpense.amount)}
                        </Text>
                      </View>

                      {parsedExpense.categoryName && (
                        <View className="flex-row justify-between">
                          <Text className="text-gray-600">Category</Text>
                          <Text className="text-gray-900 font-medium">
                            {parsedExpense.categoryName}
                          </Text>
                        </View>
                      )}

                      {parsedExpense.description && (
                        <View className="flex-row justify-between">
                          <Text className="text-gray-600">Description</Text>
                          <Text className="text-gray-900 font-medium">
                            {parsedExpense.description}
                          </Text>
                        </View>
                      )}

                      <View className="flex-row justify-between">
                        <Text className="text-gray-600">Confidence</Text>
                        <Text
                          className={`font-medium ${
                            parsedExpense.confidence >= 0.7
                              ? 'text-green-600'
                              : 'text-yellow-600'
                          }`}
                        >
                          {(parsedExpense.confidence * 100).toFixed(0)}%
                        </Text>
                      </View>
                    </View>

                    {parsedExpense.confidence < 0.7 && (
                      <View className="mt-4 bg-yellow-50 border border-yellow-200 rounded-xl p-3">
                        <Text className="text-yellow-700 text-sm">
                          ⚠️ Low confidence. Please review before saving.
                        </Text>
                      </View>
                    )}
                  </Card>
                )}

                {/* Action Buttons */}
                <View className="gap-3">
                  <Button
                    title="Edit & Save"
                    onPress={handleSaveTransaction}
                    fullWidth
                    size="lg"
                  />
                  <Button
                    title="Try Again"
                    onPress={handleCancel}
                    variant="outline"
                    fullWidth
                    size="lg"
                  />
                </View>
              </View>
            </>
          )}
        </View>

        {/* Instructions */}
        {!isRecording && !showReview && !isProcessing && (
          <View className="bg-blue-50 rounded-2xl p-4">
            <Text className="text-blue-900 font-semibold mb-2">
              💡 Tips for better results
            </Text>
            <Text className="text-blue-700 text-sm mb-1">
              • Speak clearly and naturally
            </Text>
            <Text className="text-blue-700 text-sm mb-1">
              • Include amount and category
            </Text>
            <Text className="text-blue-700 text-sm">
              • Example: "Hôm nay ăn cơm 50 nghìn"
            </Text>
          </View>
        )}
      </View>
    </SafeAreaWrapper>
  );
}
