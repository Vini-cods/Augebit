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
  Dimensions
} from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

const CursoEquilibrio = () => {
  const navigation = useNavigation();
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [cursoInscrito, setCursoInscrito] = useState(false);
  
  // Estados do menu lateral
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const slideAnim = useRef(new Animated.Value(-width)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const topicos = [
    { 
      titulo: 'Módulo 1: Compreendendo o Conceito de Equilíbrio', 
      conteudo: '• Sinais de desequilíbrio\n• Por que o equilíbrio é importante para a saúde mental e a carreira',
      icon: 'balance-outline'
    },
    { 
      titulo: 'Módulo 2: Avaliação da Rotina', 
      conteudo: '• Identificação das áreas da vida\n• Ferramenta da "Roda da Vida"\n• Reflexão: onde estou investindo mais/menos energia?',
      icon: 'analytics-outline'
    },
    { 
      titulo: 'Módulo 3: Organização, Prioridades e Limites', 
      conteudo: '• Como definir prioridades\n• Gestão do tempo\n• Estabelecer limites saudáveis\n• Aprendendo a dizer "não"',
      icon: 'filter-outline'
    },
    { 
      titulo: 'Módulo 4: Organização Pessoal e Ambiente', 
      conteudo: '• Organização de e-mails e tarefas\n• Ambiente físico e digital\n• Multitarefa: quando evitar',
      icon: 'file-tray-stacked-outline'
    },
    { 
      titulo: 'Módulo final: Hábitos e Rotina', 
      conteudo: '• Criar hábitos saudáveis\n• Rotina matinal\n• Lidar com imprevistos\n• Pausas estratégicas',
      icon: 'repeat-outline'
    },
  ];

  // Itens do menu lateral
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
        { text: "Cancelar", style: "cancel" },
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

  // Funções do menu lateral
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

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Header com botão de voltar e menu */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#7C3AED" />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>Equilíbrio Vida-Trabalho</Text>
        
        <TouchableOpacity onPress={toggleSidebar}>
          <MaterialIcons name="menu" size={28} color="#7C3AED" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <LinearGradient
          colors={['#8B5CF6', '#7C3AED']}
          style={styles.gradientHeader}
        >
          <Text style={styles.title}>Equilíbrio Vida-Trabalho</Text>
          <Text style={styles.description}>
            Aprenda a harmonizar suas demandas profissionais e pessoais
          </Text>
        </LinearGradient>

        <View style={styles.detailsContainer}>
          <View style={styles.detailItem}>
            <Ionicons name="time-outline" size={20} color="#7C3AED" />
            <Text style={styles.detailText}>6 horas</Text>
          </View>
          <View style={styles.detailItem}>
            <Ionicons name="person-outline" size={20} color="#7C3AED" />
            <Text style={styles.detailText}>Saúde Mental</Text>
          </View>
          <View style={styles.detailItem}>
            <Ionicons name="ribbon-outline" size={20} color="#7C3AED" />
            <Text style={styles.detailText}>Certificado</Text>
          </View>
        </View>

        <TouchableOpacity 
          style={cursoInscrito ? styles.buttonSecondary : styles.buttonPrimary}
          onPress={cursoInscrito ? null : handleParticipar}
        >
          <Text style={styles.buttonText}>
            {cursoInscrito ? "Inscrito" : "Participar do Curso"}
          </Text>
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>Conteúdo do Curso</Text>

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
            "Identificar sinais de desequilíbrio",
            "Aplicar a Roda da Vida",
            "Estabelecer limites saudáveis",
            "Criar rotinas equilibradas"
          ].map((item, index) => (
            <View key={index} style={styles.outcomeItem}>
              <Ionicons name="checkmark-circle" size={20} color="#10B981" />
              <Text style={styles.outcomeText}>{item}</Text>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Menu Lateral */}
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
  buttonPrimary: {
    backgroundColor: '#7C3AED',
    padding: 16,
    borderRadius: 12,
    marginHorizontal: 15,
    marginVertical: 10,
  },
  buttonSecondary: {
    backgroundColor: '#10B981',
    padding: 16,
    borderRadius: 12,
    marginHorizontal: 15,
    marginVertical: 10,
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
  // Estilos do menu lateral
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
  sidebarHeader: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  menuItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuLabel: {
    fontSize: 16,
    marginLeft: 10,
    color: '#1F2937',
  },
});

export default CursoEquilibrio;