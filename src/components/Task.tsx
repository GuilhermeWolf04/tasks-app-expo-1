import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Feather, AntDesign } from '@expo/vector-icons';
import { cssInterop } from 'nativewind';

const NWView = cssInterop(View, { className: 'style' });
const NWText = cssInterop(Text, { className: 'style' });
const NWTouchableOpacity = cssInterop(TouchableOpacity, { className: 'style' });

interface TaskProps {
  text: string;
  updateMode: () => void;
  deleteTask: () => void;
}

const Task: React.FC<TaskProps> = ({ text, updateMode, deleteTask }) => {
  return (
    <NWView className="mt-4 flex-row items-center justify-between rounded-2xl bg-white px-4 py-4 shadow-sm shadow-black/10">
      <NWText className="mr-4 flex-1 text-base text-gray-800">{text}</NWText>
      <NWView className="flex-row items-center gap-4">
        <NWTouchableOpacity className="rounded-full bg-gray-100 p-2" onPress={updateMode}>
          <Feather name="edit" size={20} color="#111827" />
        </NWTouchableOpacity>
        <NWTouchableOpacity className="rounded-full bg-gray-100 p-2" onPress={deleteTask}>
          <AntDesign name="delete" size={20} color="#111827" />
        </NWTouchableOpacity>
      </NWView>
    </NWView>
  );
};

export default Task;
