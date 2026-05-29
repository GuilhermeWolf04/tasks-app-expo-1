import React from 'react';
import { View, Text, Image, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { globalStyles } from '../styles/global';

interface AboutScreenProps {
  onClose: () => void;
}

export default function AboutScreen({ onClose }: AboutScreenProps) {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Image 
        source={require('../../assets/task-app-banner.png')} 
        style={styles.logo} 
      />
      
      <Text style={styles.title}>Sobre o App</Text>
      
      <View style={styles.section}>
        <Text style={styles.paragraph}>
          Bem-vindo ao Gerenciador de Tarefas! Este aplicativo foi desenvolvido com o intuito de facilitar a organização do seu dia a dia, permitindo o acompanhamento de suas atividades de forma simples, rápida e eficiente.
        </Text>
        <Text style={styles.paragraph}>
          Com uma interface moderna e intuitiva, você pode adicionar novas tarefas, marcar as que já foram concluídas e definir prioridades. O objetivo principal é proporcionar uma experiência fluida para aumentar a sua produtividade e focar no que realmente importa.
        </Text>
        <Text style={styles.paragraph}>
          Desenvolvido como um projeto de estudo e aplicação de melhores práticas em desenvolvimento mobile, o Gerenciador de Tarefas utiliza tecnologias de ponta para entregar um aplicativo robusto, performático e disponível para múltiplas plataformas a partir do mesmo código-fonte.
        </Text>
      </View>

      <Text style={styles.subtitle}>Tecnologias Utilizadas</Text>
      
      <View style={styles.techList}>
        <Text style={styles.techItem}>• React Native</Text>
        <Text style={styles.techItem}>• Expo</Text>
        <Text style={styles.techItem}>• TypeScript</Text>
        <Text style={styles.techItem}>• EAS</Text>
      </View>

      <TouchableOpacity style={styles.closeButton} onPress={onClose}>
        <Text style={styles.closeButtonText}>Fechar</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    padding: 32,
    alignItems: 'center',
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 24,
    borderRadius: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 24,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: globalStyles?.primaryColor || '#000',
    marginTop: 16,
    marginBottom: 12,
    alignSelf: 'flex-start',
  },
  section: {
    marginBottom: 24,
    width: '100%',
  },
  paragraph: {
    fontSize: 16,
    color: '#555',
    lineHeight: 24,
    marginBottom: 12,
    textAlign: 'justify',
  },
  techList: {
    width: '100%',
    backgroundColor: '#f5f5f5',
    padding: 20,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: globalStyles?.primaryColor || '#000',
    marginBottom: 32,
  },
  techItem: {
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
    marginBottom: 8,
  },
  closeButton: {
    backgroundColor: globalStyles?.primaryColor || '#000',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 8,
    alignItems: 'center',
    width: '100%',
    marginTop: 16,
    marginBottom: 32,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
