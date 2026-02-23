import { TextInput, View, Text } from 'react-native';
import { ReactNode, useState } from 'react';

interface InputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  label?: string;
  error?: string;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  multiline?: boolean;
  numberOfLines?: number;
  disabled?: boolean;
  className?: string;
}

export function Input({
  value,
  onChangeText,
  placeholder,
  label,
  error,
  secureTextEntry,
  keyboardType = 'default',
  autoCapitalize = 'none',
  leftIcon,
  rightIcon,
  multiline = false,
  numberOfLines = 1,
  disabled = false,
  className = '',
}: InputProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View className={`w-full ${className}`}>
      {label && (
        <Text className="text-gray-700 font-medium mb-2 text-sm">
          {label}
        </Text>
      )}

      <View
        className={`
          flex-row items-center
          bg-white border-2 rounded-xl px-4
          ${isFocused ? 'border-primary-blue' : 'border-gray-200'}
          ${error ? 'border-red-500' : ''}
          ${disabled ? 'bg-gray-100' : ''}
          ${multiline ? 'py-3' : 'py-0'}
        `}
      >
        {leftIcon && (
          <View className="mr-2">
            {leftIcon}
          </View>
        )}

        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#ADB5BD"
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          multiline={multiline}
          numberOfLines={numberOfLines}
          editable={!disabled}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={`
            flex-1 text-base text-gray-900
            ${multiline ? '' : 'py-3'}
          `}
        />

        {rightIcon && (
          <View className="ml-2">
            {rightIcon}
          </View>
        )}
      </View>

      {error && (
        <Text className="text-red-500 text-sm mt-1">
          {error}
        </Text>
      )}
    </View>
  );
}
