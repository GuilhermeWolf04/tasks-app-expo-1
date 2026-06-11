import React from 'react';
import { View } from 'react-native';
import { cssInterop } from 'nativewind';
import { Heading, Text } from '@gluestack-ui/themed';

const NWView = cssInterop(View, { className: 'style' });

interface EmptyStateProps {
  message?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({ message = 'Nenhuma tarefa encontrada.' }) => {
  return (
    <NWView className="flex-1 items-center justify-center px-8 mt-8">
      <Heading size="lg" style={{ color: '#333', textAlign: 'center' }}>
        {message}
      </Heading>
      <Text style={{ color: '#666', textAlign: 'center', marginTop: 8, fontSize: 14 }}>
        Adicione uma nova tarefa para começar.
      </Text>
    </NWView>
  );
};

export default EmptyState;
