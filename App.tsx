import { useEffect, useState, type ReactElement } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, Platform, Image, Pressable, ActivityIndicator, Modal, Button, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { cssInterop } from 'nativewind';
import Checkbox from 'expo-checkbox';
import DateTimePicker from '@react-native-community/datetimepicker';
import { GluestackUIProvider, Button as GluestackButton, ButtonText, Input, InputField } from '@gluestack-ui/themed';
import { gluestackUIConfig } from '@gluestack-ui/config';
import TaskList from './src/components/TaskList';
import { addTask, deleteTask, getAllTasks, updateTask, TaskItem } from './src/utils/handle-api';
import { globalStyles } from './src/styles/global';
import AboutScreen from './src/components/AboutScreen';
import LoginScreen from './src/screens/LoginScreen';
import SignupScreen from './src/screens/SignupScreen';
import { getToken, logout, AuthUser } from './src/utils/handle-auth';

// TODO (Zustand): Importe o seu useTaskStore aqui

type Screen = 'loading' | 'login' | 'signup' | 'main';

const NativeSafeAreaView = cssInterop(SafeAreaView, { className: 'style' });

export default function App() {
  const [screen, setScreen] = useState<Screen>('loading');
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);

  // TODO (Zustand): Remova este useState e utilize o seletor da sua store para pegar as tasks
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [text, setText] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [taskId, setTaskId] = useState("");
  const [loading, setLoading] = useState(true);
  const [logoError, setLogoError] = useState(false);
  const [filter, setFilter] = useState<'all' | 'completed' | 'pending'>('all');

  const [aboutModalVisible, setAboutModalVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [priority, setPriority] = useState<'Baixa' | 'Média' | 'Alta'>('Baixa');

  // Verifica o token salvo ao iniciar o app
  useEffect(() => {
    getToken().then((token) => {
      if (token) {
        setScreen('main');
      } else {
        setScreen('login');
      }
    });
  }, []);

  const handleLoginSuccess = (user: AuthUser) => {
    setCurrentUser(user);
    setScreen('main');
  };

  const handleLogout = () => {
    Alert.alert('Sair', 'Deseja encerrar sua sessão?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Sair',
        style: 'destructive',
        onPress: async () => {
          await logout();
          setCurrentUser(null);
          setTasks([]);
          setScreen('login');
        },
      },
    ]);
  };

  useEffect(() => {
    if (screen !== 'main') return;
    // TODO (Zustand): Atualize esta chamada para usar a action correspondente da store
    getAllTasks(setTasks, setLoading);
  }, [screen]);

  const resetForm = () => {
    setText("");
    setCompleted(false);
    setDueDate(null);
    setPriority('Baixa');
    setIsUpdating(false);
    setTaskId("");
    setModalVisible(false);
  };

  const updateMode = (task: TaskItem) => {
    setIsUpdating(true);
    setTaskId(task._id);
    setText(task.text);
    setCompleted(!!task.completed);
    setDueDate(task.dueDate ? new Date(task.dueDate) : null);
    setModalVisible(true);
  };

  const handleSave = () => {
    const formattedDate = dueDate ? dueDate.toISOString() : null;
    if (isUpdating) {
      // TODO (Zustand): Substitua a chamada abaixo pela action de atualizar da sua store
      updateTask(taskId, text, completed, formattedDate, setTasks, resetForm);
    } else {
      // TODO (Zustand): Substitua a chamada abaixo pela action de adicionar da sua store
      addTask(text, completed, formattedDate, setTasks, resetForm);
    }
  };

  const onChangeDate = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) setDueDate(selectedDate);
  };

  let content: ReactElement;

  if (screen === 'loading') {
    content = (
      <NativeSafeAreaView className="flex-1 bg-gray-100 justify-center items-center">
        <ActivityIndicator size="large" color={globalStyles.primaryColor} />
      </NativeSafeAreaView>
    );
  } else if (screen === 'login') {
    content = (
      <NativeSafeAreaView className="flex-1 bg-gray-100">
        <LoginScreen
          onLoginSuccess={handleLoginSuccess}
          onGoToSignup={() => setScreen('signup')}
        />
        <StatusBar style="auto" />
      </NativeSafeAreaView>
    );
  } else if (screen === 'signup') {
    content = (
      <NativeSafeAreaView className="flex-1 bg-gray-100">
        <SignupScreen
          onSignupSuccess={handleLoginSuccess}
          onGoToLogin={() => setScreen('login')}
        />
        <StatusBar style="auto" />
      </NativeSafeAreaView>
    );
  } else {
    content = (
      <NativeSafeAreaView className="flex-1 bg-gray-100">
        <View style={styles.container}>
          <View style={styles.headerContainer}>
            {logoError ? (
              <Text style={styles.header}>Gerenciador de Tarefas</Text>
            ) : (
              <Image
                source={require('./assets/task-app-banner.png')}
                style={styles.logo}
                onError={() => setLogoError(true)}
              />
            )}
            {!logoError && <Text style={styles.header}>Tarefas</Text>}
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
              <Text style={styles.logoutText}>Sair</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.counterContainer}>
            <Text style={styles.counterText}>Total de Tarefas: {tasks.length}</Text>
          </View>

          <View style={styles.filterContainer}>
            <TouchableOpacity 
              style={[styles.filterButton, filter === 'all' ? styles.filterButtonActive : styles.filterButtonInactive]} 
              onPress={() => setFilter('all')}
            >
              <Text style={filter === 'all' ? styles.filterTextActive : styles.filterTextInactive}>Todas</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.filterButton, filter === 'completed' ? styles.filterButtonActive : styles.filterButtonInactive]} 
              onPress={() => setFilter('completed')}
            >
              <Text style={filter === 'completed' ? styles.filterTextActive : styles.filterTextInactive}>Concluídas</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.filterButton, filter === 'pending' ? styles.filterButtonActive : styles.filterButtonInactive]} 
              onPress={() => setFilter('pending')}
            >
              <Text style={filter === 'pending' ? styles.filterTextActive : styles.filterTextInactive}>Pendentes</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.actionButtonsContainer}>
            <Pressable 
              style={({ pressed }) => [
                styles.actionButton,
                styles.actionButtonAdd,
                pressed && styles.actionButtonAddPressed
              ]}
              onPress={() => setModalVisible(true)}
            >
              <Text style={styles.actionButtonText}>Nova Tarefa</Text>
            </Pressable>

            <Pressable 
              style={({ pressed }) => [
                styles.actionButton,
                styles.deleteButton,
                pressed && styles.deleteButtonPressed
              ]}
              // TODO (Zustand): Chame a action de deletar todas as tarefas da sua store
              onPress={() => setTasks([])} 
            >
              <Text style={styles.actionButtonText}>Excluir todas</Text>
            </Pressable>
          </View>

          <View style={styles.aboutButtonContainer}>
            <Button title="Sobre o App" onPress={() => setAboutModalVisible(true)} />
          </View>

          {/* TODO (Zustand): Remova as props tasks, onUpdate e onDelete após refatorar o TaskList */}
          <TaskList 
            tasks={tasks.filter(t => {
              if (filter === 'completed') return t.completed;
              if (filter === 'pending') return !t.completed;
              return true;
            })} 
            onUpdate={updateMode} 
            onDelete={(id) => deleteTask(id, setTasks)} 
          />

          {loading && (
            <View style={styles.loaderContainer}>
              <ActivityIndicator size="large" color="#000" />
            </View>
          )}
        </View>

        <Modal
          visible={modalVisible}
          transparent={true}
          animationType="fade"
          onRequestClose={resetForm}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>{isUpdating ? "Editar Tarefa" : "Nova Tarefa"}</Text>
              
              <Input style={styles.gluestackInput}>
                <InputField
                  placeholder="Nome da tarefa..."
                  value={text}
                  maxLength={50}
                  onChangeText={setText}
                  style={styles.gluestackInputField}
                />
              </Input>

              <View style={styles.fieldRow}>
                <Text style={styles.fieldLabel}>Data limite:</Text>
                {Platform.OS === 'web' ? (
                  // @ts-ignore
                  <input 
                    type="date"
                    value={dueDate ? dueDate.toISOString().split('T')[0] : ''}
                    onChange={(e: any) => {
                      const val = e.target.value;
                      if (val) {
                        const parts = val.split('-');
                        setDueDate(new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2])));
                      } else {
                        setDueDate(null);
                      }
                    }}
                    style={{ padding: 8, borderRadius: 4, border: '1px solid #ccc', flex: 1, marginLeft: 16 }}
                  />
                ) : (
                  <View style={{ flex: 1, marginLeft: 16, alignItems: 'flex-start' }}>
                    <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.datePickerBtn}>
                      <Text>{dueDate ? dueDate.toLocaleDateString() : "Selecionar Data"}</Text>
                    </TouchableOpacity>
                    {showDatePicker && (
                      <DateTimePicker
                        value={dueDate || new Date()}
                        mode="date"
                        display="default"
                        onChange={onChangeDate}
                      />
                    )}
                  </View>
                )}
              </View>

            <View style={styles.fieldRow}>
              <Text style={styles.fieldLabel}>Concluída:</Text>
              <View style={styles.checkboxContainer}>
                <Checkbox
                  value={completed}
                  onValueChange={setCompleted}
                  color={completed ? '#000' : undefined}
                />
              </View>
            </View>

            <View style={styles.fieldRow}>
              <Text style={styles.fieldLabel}>Prioridade:</Text>
              <View style={styles.priorityContainer}>
                {['Baixa', 'Média', 'Alta'].map((p) => (
                  <TouchableOpacity 
                    key={p} 
                    style={[
                      styles.priorityButton, 
                      priority === p && { 
                        backgroundColor: p === 'Baixa' ? '#4caf50' : p === 'Média' ? '#ff9800' : '#f44336',
                        borderColor: p === 'Baixa' ? '#4caf50' : p === 'Média' ? '#ff9800' : '#f44336'
                      }
                    ]}
                    onPress={() => setPriority(p as any)}
                  >
                    <Text style={[styles.priorityText, priority === p && styles.priorityTextActive]}>{p}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

              <View style={styles.modalActions}>
                <TouchableOpacity style={styles.modalCancelBtn} onPress={resetForm}>
                  <Text style={styles.modalCancelText}>Cancelar</Text>
                </TouchableOpacity>
                <GluestackButton
                  style={styles.gluestackButton}
                  onPress={handleSave}
                  isDisabled={!text.trim()}
                >
                  <ButtonText style={styles.gluestackButtonText}>Salvar</ButtonText>
                </GluestackButton>
              </View>
            </View>
          </View>
        </Modal>

        <Modal
          visible={aboutModalVisible}
          animationType="slide"
          onRequestClose={() => setAboutModalVisible(false)}
        >
          <AboutScreen onClose={() => setAboutModalVisible(false)} />
        </Modal>

        <StatusBar style="auto" />
      </NativeSafeAreaView>
    );
  }

  return (
    <GluestackUIProvider config={gluestackUIConfig}>{content}</GluestackUIProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    maxWidth: 600,
    width: '100%',
    alignSelf: 'center',
    paddingHorizontal: 16,
  },
  headerContainer: {
    alignItems: 'center',
    marginTop: 16,
    position: 'relative',
  },
  logoutButton: {
    position: 'absolute',
    right: 0,
    top: 0,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  logoutText: {
    fontSize: 13,
    color: '#555',
    fontWeight: '600',
  },
  logo: {
    width: 60,
    height: 60,
    marginBottom: 8,
  },
  header: {
    textAlign: 'center',
    fontSize: 24,
    fontWeight: 'bold',
  },
  counterContainer: {
    marginTop: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  counterText: {
    fontSize: globalStyles.bodyFontSize,
    color: '#666',
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginTop: 12,
  },
  filterButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    borderWidth: 1,
  },
  filterButtonActive: {
    backgroundColor: '#000',
    borderColor: '#000',
  },
  filterButtonInactive: {
    backgroundColor: 'transparent',
    borderColor: '#000',
  },
  filterTextActive: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  filterTextInactive: {
    color: '#000',
    fontSize: 14,
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    marginTop: 16,
  },
  aboutButtonContainer: {
    marginTop: 16,
    alignItems: 'center',
  },
  actionButton: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    flex: 1,
  },
  actionButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
    letterSpacing: 0.5,
  },
  actionButtonAdd: {
    backgroundColor: globalStyles.primaryColor,
    shadowColor: globalStyles.primaryColor,
  },
  actionButtonAddPressed: {
    backgroundColor: '#333',
    transform: [{ scale: 0.98 }],
    elevation: 1,
    shadowOpacity: 0.1,
  },
  deleteButton: {
    backgroundColor: '#ff4d4d',
    shadowColor: '#ff0000',
  },
  deleteButtonPressed: {
    backgroundColor: '#d9363e',
    transform: [{ scale: 0.98 }],
    elevation: 1,
    shadowOpacity: 0.1,
  },
  loaderContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    zIndex: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    maxWidth: 400,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 24,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    paddingVertical: 10,
    paddingHorizontal: 12,
    fontSize: 16,
    marginBottom: 16,
  },
  fieldRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  fieldLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  checkboxContainer: {
    marginLeft: 16,
  },
  priorityContainer: {
    flexDirection: 'row',
    flex: 1,
    marginLeft: 16,
    gap: 8,
    flexWrap: 'wrap',
  },
  priorityButton: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  priorityText: {
    color: '#333',
  },
  priorityTextActive: {
    color: '#fff',
    fontWeight: 'bold',
  },
  datePickerBtn: {
    borderWidth: 1,
    borderColor: '#ccc',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 4,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: 8,
  },
  modalCancelBtn: {
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  modalCancelText: {
    color: '#666',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalSaveBtn: {
    backgroundColor: '#000',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 4,
  },
  modalSaveBtnDisabled: {
    backgroundColor: '#ccc',
  },
  modalSaveText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  gluestackInput: {
    marginBottom: 16,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#d1d5db',
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  gluestackInputField: {
    fontSize: 16,
    color: '#1f2937',
  },
  gluestackButton: {
    borderRadius: 6,
    backgroundColor: '#000',
    paddingHorizontal: 20,
    paddingVertical: 12,
    opacity: 1,
  },
  gluestackButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});
