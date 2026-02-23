import { View, Text } from 'react-native';

interface BadgeProps {
  label: string;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
  size?: 'sm' | 'md';
  className?: string;
}

export function Badge({
  label,
  variant = 'default',
  size = 'md',
  className = '',
}: BadgeProps) {
  const variantClasses = {
    default: 'bg-gray-100 text-gray-700',
    success: 'bg-green-100 text-green-700',
    warning: 'bg-yellow-100 text-yellow-700',
    danger: 'bg-red-100 text-red-700',
    info: 'bg-blue-100 text-blue-700',
  };

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
  };

  const [bgColor, textColor] = variantClasses[variant].split(' ');

  return (
    <View className={`rounded-full ${bgColor} ${sizeClasses[size].split(' ')[0]} ${sizeClasses[size].split(' ')[1]} ${className}`}>
      <Text className={`${textColor} ${sizeClasses[size].split(' ')[2]} font-medium`}>
        {label}
      </Text>
    </View>
  );
}
