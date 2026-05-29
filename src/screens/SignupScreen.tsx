import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { signup, saveToken, AuthUser } from '../utils/handle-auth';
import { globalStyles } from '../styles/global';

interface Props {
  onSignupSuccess: (user: AuthUser) => void;
  onGoToLogin: () => void;
}

export default function SignupScreen({ onSignupSuccess, onGoToLogin }: Props) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSignup = async () => {
    if (!name.trim() || !email.trim() || !password.trim()) {
      setError('Preencha todos os campos.');
      return;
    }
    if (password.length < 6) {
      setError('A senha deve ter no mínimo 6 caracteres.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const { token, user } = await signup(email.trim(), password);
      await saveToken(token);
      onSignupSuccess(user);
    } catch (err: any) {
      const msg = err?.response?.data?.error ?? 'Erro ao criar conta. Tente novamente.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Criar Conta</Text>
        <Text style={styles.subtitle}>Preencha os dados abaixo para se cadastrar</Text>

        <TextInput
          style={styles.input}
          placeholder="Nome"
          value={name}
          onChangeText={setName}
          autoCapitalize="words"
          autoComplete="name"
        />

        <TextInput
          style={styles.input}
          placeholder="E-mail"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          autoComplete="email"
        />

        <TextInput
          style={styles.input}
          placeholder="Senha (mínimo 6 caracteres)"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          autoComplete="new-password"
        />

        {error !== '' && <Text style={styles.errorText}>{error}</Text>}

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleSignup}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Criar Conta</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity style={styles.linkContainer} onPress={onGoToLogin}>
          <Text style={styles.linkText}>
            Já tem uma conta? <Text style={styles.linkBold}>Entrar</Text>
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: globalStyles.backgroundColor },
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingVertical: 48,
    maxWidth: 480,
    width: '100%',
    alignSelf: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: globalStyles.primaryColor,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 32,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 16,
    fontSize: 16,
    marginBottom: 16,
    backgroundColor: '#fafafa',
  },
  errorText: {
    color: '#c0392b',
    marginBottom: 12,
    fontSize: 14,
  },
  button: {
    backgroundColor: globalStyles.primaryColor,
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  linkContainer: {
    marginTop: 24,
    alignItems: 'center',
  },
  linkText: {
    fontSize: 15,
    color: '#555',
  },
  linkBold: {
    fontWeight: 'bold',
    color: globalStyles.primaryColor,
  },
});
