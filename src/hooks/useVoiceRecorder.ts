import { useState, useRef } from 'react';
import { Audio } from 'expo-av';
import { APP_CONFIG } from '@/constants/config';

export function useVoiceRecorder() {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  const recordingRef = useRef<Audio.Recording | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const requestPermission = async (): Promise<boolean> => {
    try {
      const { granted } = await Audio.requestPermissionsAsync();
      setHasPermission(granted);
      return granted;
    } catch (error) {
      console.error('Error requesting audio permission:', error);
      setHasPermission(false);
      return false;
    }
  };

  const startRecording = async (): Promise<void> => {
    try {
      // Check permission
      if (hasPermission === null) {
        const granted = await requestPermission();
        if (!granted) {
          throw new Error('Microphone permission not granted');
        }
      } else if (!hasPermission) {
        throw new Error('Microphone permission not granted');
      }

      // Configure audio mode
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      // Start recording
      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );

      recordingRef.current = recording;
      setIsRecording(true);
      setRecordingDuration(0);

      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingDuration((prev) => {
          const newDuration = prev + 1;
          // Auto-stop after max duration
          if (newDuration >= APP_CONFIG.MAX_AUDIO_DURATION) {
            stopRecording();
          }
          return newDuration;
        });
      }, 1000);
    } catch (error) {
      console.error('Error starting recording:', error);
      throw error;
    }
  };

  const stopRecording = async (): Promise<string | null> => {
    try {
      if (!recordingRef.current) {
        return null;
      }

      // Stop timer
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }

      setIsRecording(false);

      await recordingRef.current.stopAndUnloadAsync();
      const uri = recordingRef.current.getURI();
      recordingRef.current = null;

      return uri;
    } catch (error) {
      console.error('Error stopping recording:', error);
      throw error;
    }
  };

  const cancelRecording = async (): Promise<void> => {
    if (recordingRef.current) {
      await recordingRef.current.stopAndUnloadAsync();
      recordingRef.current = null;
    }

    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    setIsRecording(false);
    setRecordingDuration(0);
  };

  return {
    isRecording,
    recordingDuration,
    hasPermission,
    startRecording,
    stopRecording,
    cancelRecording,
    requestPermission,
  };
}
