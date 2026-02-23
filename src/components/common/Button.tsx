import { TouchableOpacity, Text, ActivityIndicator, View } from 'react-native';
import { ReactNode } from 'react';

interface ButtonProps {
  title?: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  disabled?: boolean;
  icon?: ReactNode;
  fullWidth?: boolean;
  className?: string;
}

export function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  icon,
  fullWidth = false,
  className = '',
}: ButtonProps) {
  const baseClasses = 'rounded-xl flex-row items-center justify-center';

  const variantClasses = {
    primary: 'bg-primary-blue',
    secondary: 'bg-gray-200',
    outline: 'bg-transparent border-2 border-primary-blue',
    danger: 'bg-red-500',
  };

  const sizeClasses = {
    sm: 'px-4 py-2',
    md: 'px-6 py-3',
    lg: 'px-8 py-4',
  };

  const textVariantClasses = {
    primary: 'text-white',
    secondary: 'text-gray-800',
    outline: 'text-primary-blue',
    danger: 'text-white',
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  };

  const isDisabled = disabled || isLoading;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled}
      className={`
        ${baseClasses}
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${fullWidth ? 'w-full' : ''}
        ${isDisabled ? 'opacity-50' : ''}
        ${className}
      `}
      activeOpacity={0.7}
    >
      {isLoading ? (
        <ActivityIndicator
          color={variant === 'outline' || variant === 'secondary' ? '#4C6EF5' : '#fff'}
        />
      ) : (
        <View className="flex-row items-center gap-2">
          {icon}
          {title && (
            <Text
              className={`
                ${textVariantClasses[variant]}
                ${textSizeClasses[size]}
                font-semibold
              `}
            >
              {title}
            </Text>
          )}
        </View>
      )}
    </TouchableOpacity>
  );
}
