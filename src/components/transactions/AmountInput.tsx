import { View, Text, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import { formatCurrency } from '@/utils/format';

interface AmountInputProps {
  value: number;
  onChange: (value: number) => void;
  currency?: string;
}

export function AmountInput({
  value,
  onChange,
  currency = 'VND',
}: AmountInputProps) {
  const [displayValue, setDisplayValue] = useState(value.toString());

  const handleNumberPress = (num: string) => {
    const newValue = displayValue === '0' ? num : displayValue + num;
    setDisplayValue(newValue);
    onChange(parseFloat(newValue) || 0);
  };

  const handleDelete = () => {
    const newValue = displayValue.slice(0, -1) || '0';
    setDisplayValue(newValue);
    onChange(parseFloat(newValue) || 0);
  };

  const handleClear = () => {
    setDisplayValue('0');
    onChange(0);
  };

  const handleShortcut = (multiplier: number) => {
    const currentValue = parseFloat(displayValue) || 0;
    const newValue = currentValue * multiplier;
    setDisplayValue(newValue.toString());
    onChange(newValue);
  };

  const handleDecimal = () => {
    if (!displayValue.includes('.')) {
      const newValue = displayValue + '.';
      setDisplayValue(newValue);
    }
  };

  const buttons = [
    ['1', '2', '3'],
    ['4', '5', '6'],
    ['7', '8', '9'],
    ['.', '0', '⌫'],
  ];

  return (
    <View className="w-full">
      {/* Display */}
      <View className="bg-gray-50 rounded-2xl p-6 mb-4">
        <Text className="text-gray-600 text-sm mb-1">Amount</Text>
        <Text className="text-4xl font-bold text-gray-900" numberOfLines={1}>
          {formatCurrency(parseFloat(displayValue) || 0, currency)}
        </Text>
      </View>

      {/* Shortcuts */}
      <View className="flex-row gap-2 mb-4">
        <TouchableOpacity
          onPress={() => handleShortcut(1000)}
          className="flex-1 bg-blue-50 rounded-xl py-3 items-center"
          activeOpacity={0.7}
        >
          <Text className="text-primary-blue font-semibold">× 1K</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleShortcut(1000)}
          className="flex-1 bg-blue-50 rounded-xl py-3 items-center"
          activeOpacity={0.7}
        >
          <Text className="text-primary-blue font-semibold">+ 000</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleClear}
          className="flex-1 bg-red-50 rounded-xl py-3 items-center"
          activeOpacity={0.7}
        >
          <Text className="text-red-500 font-semibold">Clear</Text>
        </TouchableOpacity>
      </View>

      {/* Number pad */}
      <View className="gap-3">
        {buttons.map((row, rowIndex) => (
          <View key={rowIndex} className="flex-row gap-3">
            {row.map((btn) => (
              <TouchableOpacity
                key={btn}
                onPress={() => {
                  if (btn === '⌫') {
                    handleDelete();
                  } else if (btn === '.') {
                    handleDecimal();
                  } else {
                    handleNumberPress(btn);
                  }
                }}
                className="flex-1 bg-white border-2 border-gray-200 rounded-2xl py-4 items-center active:bg-gray-50"
                activeOpacity={0.7}
              >
                <Text className="text-2xl font-semibold text-gray-900">
                  {btn}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </View>
    </View>
  );
}
