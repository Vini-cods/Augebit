import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
  StyleSheet,
  Animated,
  Modal,
  TouchableWithoutFeedback,
  Alert,
  Dimensions,
  FlatList
} from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

const CursoProdutividade = () => {
  const navigation = useNavigation();
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [cursoInscrito, setCursoInscrito] = useState(false);
  
  // Sidebar states
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const slideAnim = useRef(new Animated.Value(-width)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const topicos = [
    { 
      titulo: 'Módulo 1: Introdução à Produtividade', 
      conteudo: '• O que é produtividade\n• Diferença entre estar ocupado e ser produtivo\n• Mitos sobre produtividade',
      icon: 'rocket-outline'
    },
    { 
      titulo: 'Módulo 2: Autoconhecimento e Diagnóstico', 
      conteudo: '• Como você usa o seu tempo hoje?\n• Rastreadores de tempo e autoavaliação\n• Identificação de ladrões de tempo',
      icon: 'analytics-outline'
    },
    { 
      titulo: 'Módulo 3: Técnicas de Gestão do Tempo', 
      conteudo: '• Matriz de Eisenhower\n• Técnica Pomodoro\n• Método GTD\n• Planejamento semanal e diário',
      icon: 'time-outline'
    },
    { 
      titulo: 'Módulo 4: Organização Pessoal', 
      conteudo: '• Organização de e-mails e tarefas\n• Ambiente físico e digital\n• Multitarefa: quando evitar',
      icon: 'folder-outline'
    },
    { 
      titulo: 'Módulo final: Hábitos e Rotina', 
      conteudo: '• Criar hábitos produtivos\n• Rotina matinal\n• Lidar com imprevistos\n• Equilíbrio e pausas',
      icon: 'repeat-outline'
    },
  ];

  // Menu items
  const menuItems = [
    { id: 1, icon: "home", label: "Início", screen: "Inicio" },
    { id: 2, icon: "calendar", label: "Agendamentos", screen: "Agendamento" },
    { id: 3, icon: "book", label: "Cursos", screen: "CursosMenu" },
  ];

  const toggleTopico = (index) => {
    setExpandedIndex(index === expandedIndex ? null : index);
  };

  const handleParticipar = () => {
    Alert.alert(
      "Confirmação",
      "Deseja se inscrever neste curso?",
      [
        {
          text: "Cancelar",
          style: "cancel"
        },
        { 
          text: "Confirmar", 
          onPress: () => {
            setCursoInscrito(true);
            Alert.alert("Sucesso", "Inscrição realizada com sucesso!");
          }
        }
      ]
    );
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const renderMenuItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.menuItem} 
      onPress={() => {
        setIsSidebarOpen(false);
        navigation.navigate(item.screen);
      }}
    >
      <Ionicons name={item.icon} size={20} color="#333" style={styles.menuIcon} />
      <Text style={styles.menuLabel}>{item.label}</Text>
    </TouchableOpacity>
  );

  // Sidebar animations
  React.useEffect(() => {
    if (isSidebarOpen) {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: false,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: false,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: -width,
          duration: 300,
          useNativeDriver: false,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: false,
        }),
      ]).start();
    }
  }, [isSidebarOpen]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#7C3AED" />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>Produtividade no Trabalho</Text>
        
        <TouchableOpacity onPress={toggleSidebar}>
          <MaterialIcons name="menu" size={28} color="#7C3AED" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <LinearGradient
          colors={['#7C3AED', '#5B21B6']}
          style={styles.gradientHeader}
        >
          <Text style={styles.title}>Produtividade no Trabalho</Text>
          <Text style={styles.description}>
            Aprenda técnicas comprovadas para aumentar sua eficiência
          </Text>
        </LinearGradient>

        <View style={styles.detailsContainer}>
          <View style={styles.detailItem}>
            <Ionicons name="time-outline" size={20} color="#7C3AED" />
            <Text style={styles.detailText}>6 horas</Text>
          </View>
          <View style={styles.detailItem}>
            <Ionicons name="school-outline" size={20} color="#7C3AED" />
            <Text style={styles.detailText}>Desenvolvimento</Text>
          </View>
          <View style={styles.detailItem}>
            <Ionicons name="document-text-outline" size={20} color="#7C3AED" />
            <Text style={styles.detailText}>Certificado</Text>
          </View>
        </View>

        <TouchableOpacity 
          style={[
            styles.button, 
            cursoInscrito && styles.buttonInscrito
          ]}
          onPress={handleParticipar}
          disabled={cursoInscrito}
        >
          <Text style={styles.buttonText}>
            {cursoInscrito ? "Inscrição Confirmada" : "Participar do Curso"}
          </Text>
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>Conteúdo Programático</Text>

        {topicos.map((topico, index) => (
          <View key={index} style={styles.card}>
            <TouchableOpacity 
              onPress={() => toggleTopico(index)} 
              style={styles.cardHeader}
            >
              <View style={styles.cardHeaderContent}>
                <Ionicons name={topico.icon} size={24} color="#7C3AED" />
                <Text style={styles.cardTitle}>{topico.titulo}</Text>
              </View>
              <Ionicons 
                name={expandedIndex === index ? 'chevron-up' : 'chevron-down'} 
                size={20} 
                color="#6B7280" 
              />
            </TouchableOpacity>

            {expandedIndex === index && (
              <View style={styles.cardContent}>
                <Text style={styles.cardText}>{topico.conteudo}</Text>
              </View>
            )}
          </View>
        ))}

        <View style={styles.learningOutcomes}>
          <Text style={styles.sectionTitle}>O que você vai aprender</Text>
          {[
            "Priorizar tarefas com clareza",
            "Usar técnicas para manter o foco",
            "Criar rotinas de trabalho eficientes",
            "Equilibrar produtividade e bem-estar"
          ].map((item, index) => (
            <View key={index} style={styles.outcomeItem}>
              <Ionicons name="checkmark-circle" size={20} color="#10B981" />
              <Text style={styles.outcomeText}>{item}</Text>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Sidebar Menu */}
      <Modal
        visible={isSidebarOpen}
        transparent
        animationType="none"
        onRequestClose={() => setIsSidebarOpen(false)}
      >
        <Animated.View style={[styles.overlay, { opacity: fadeAnim }]}>
          <TouchableWithoutFeedback onPress={() => setIsSidebarOpen(false)}>
            <View style={styles.overlayTouch} />
          </TouchableWithoutFeedback>
        </Animated.View>
        
        <Animated.View style={[styles.sidebar, { left: slideAnim }]}>
          <View style={styles.sidebarContent}>
            <View style={styles.sidebarHeader}>
              <Text style={styles.userName}>Menu</Text>
            </View>

            <FlatList
              data={menuItems}
              renderItem={renderMenuItem}
              keyExtractor={(item) => item.id.toString()}
              scrollEnabled={false}
            />
          </View>
        </Animated.View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  gradientHeader: {
    padding: 20,
    borderRadius: 12,
    margin: 15,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: '#E9D5FF',
    lineHeight: 22,
  },
  detailsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    margin: 15,
  },
  detailItem: {
    alignItems: 'center',
    flex: 1,
  },
  detailText: {
    fontSize: 14,
    color: '#4B5563',
    marginTop: 5,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#7C3AED',
    padding: 16,
    borderRadius: 12,
    marginHorizontal: 15,
    marginVertical: 10,
  },
  buttonInscrito: {
    backgroundColor: '#10B981',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginHorizontal: 15,
    marginVertical: 15,
  },
  card: {
    marginHorizontal: 15,
    marginBottom: 10,
    borderRadius: 12,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  cardHeader: {
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
    marginLeft: 10,
    flexShrink: 1,
  },
  cardContent: {
    padding: 15,
    paddingTop: 0,
  },
  cardText: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 22,
  },
  learningOutcomes: {
    marginHorizontal: 15,
    marginTop: 10,
    marginBottom: 30,
  },
  outcomeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    paddingHorizontal: 5,
  },
  outcomeText: {
    fontSize: 14,
    color: '#374151',
    marginLeft: 10,
  },
  // Sidebar styles
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  sidebar: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: '75%',
    backgroundColor: 'white',
  },
  sidebarContent: {
    flex: 1,
  },
  sidebarHeader: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  userName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  menuItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuIcon: {
    marginRight: 10,
  },
  menuLabel: {
    fontSize: 16,
    color: '#1F2937',
  },
});

export default CursoProdutividade;