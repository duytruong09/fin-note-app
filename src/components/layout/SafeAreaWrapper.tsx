import { SafeAreaView } from 'react-native-safe-area-context';
import { ReactNode } from 'react';

interface SafeAreaWrapperProps {
  children: ReactNode;
  className?: string;
}

export function SafeAreaWrapper({ children, className = '' }: SafeAreaWrapperProps) {
  return (
    <SafeAreaView className={`flex-1 bg-white ${className}`}>
      {children}
    </SafeAreaView>
  );
}
