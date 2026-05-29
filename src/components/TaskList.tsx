import React, { useMemo } from 'react';
import { SectionList, StyleSheet, View, Text } from 'react-native';
import TaskItem from './TaskItem';
import { TaskItem as TaskType } from '../utils/handle-api';

// TODO (Zustand): Remova as props tasks, onUpdate e onDelete daqui, elas não serão mais necessárias
interface TaskListProps {
  tasks: TaskType[];
  onUpdate: (task: TaskType) => void;
  onDelete: (id: string) => void;
}

// TODO (Zustand): Importe o useTaskStore e pegue as tasks diretamente da store
const TaskList: React.FC<TaskListProps> = ({ tasks, onUpdate, onDelete }) => {
  const sections = useMemo(() => {
    const completedTasks = tasks.filter((task) => task.completed);
    const pendingTasks = tasks.filter((task) => !task.completed);

    return [
      { title: '✅ Concluídas', data: completedTasks },
      { title: '📋 Pendentes', data: pendingTasks },
    ];
  }, [tasks]);

  return (
    <View style={styles.listContainer}>
      <SectionList
        sections={sections}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContent}
        renderSectionHeader={({ section: { title } }) => (
          <Text style={styles.sectionHeader}>{title}</Text>
        )}
        renderItem={({ item }) => (
          
          <TaskItem
            task={item}
            updateMode={() => onUpdate(item)}
            deleteTask={() => onDelete(item._id)}
          />
        )}
        renderSectionFooter={({ section }) => 
          section.data.length === 0 ? (
            <Text style={styles.emptySectionText}>Nenhuma tarefa nesta categoria.</Text>
          ) : null
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  listContainer: {
    flex: 1,
    marginTop: 16,
  },
  listContent: {
    paddingBottom: 24,
  },
  sectionHeader: {
    backgroundColor: '#f0f0f0',
    fontWeight: 'bold',
    padding: 12,
    fontSize: 16,
    marginTop: 8,
    marginBottom: 8,
    borderRadius: 4,
  },
  emptySectionText: {
    padding: 16,
    color: '#666',
    fontStyle: 'italic',
    textAlign: 'center',
  }
});

export default TaskList;
