import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Keyboard,
  TouchableWithoutFeedback,
  Alert,
  ScrollView,
  Platform,
  Modal,
  Animated,
  SafeAreaView,
  FlatList,
  Dimensions
} from "react-native";
import * as Animatable from "react-native-animatable";
import { StatusBar } from "expo-status-bar";
import { Picker } from "@react-native-picker/picker";
import { MaterialIcons, FontAwesome, Feather, Ionicons } from "@expo/vector-icons";
import { MaskedTextInput } from "react-native-mask-text";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

export default function Agendamento() {
  // Estados do formulário
  const [nome, setNome] = useState("");
  const [cpf, setCpf] = useState("");
  const [telefone, setTelefone] = useState("");
  const [email, setEmail] = useState("");
  const [data, setData] = useState("");
  const [hora, setHora] = useState("");
  const [profissional, setProfissional] = useState("");
  const [loading, setLoading] = useState(false);

  // Estados do menu lateral
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const slideAnim = useRef(new Animated.Value(-width)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const navigation = useNavigation();

  // Lista de profissionais
  const profissionais = [
    { label: "Selecione um profissional", value: "" },
    { label: "Dr. João Silva - Psicólogo", value: "Dr. João Silva" },
    { label: "Dra. Maria Santos - Psiquiatra", value: "Dra. Maria Santos" },
    { label: "Dr. Pedro Costa - Terapeuta", value: "Dr. Pedro Costa" },
    { label: "Dra. Ana Oliveira - Psicóloga", value: "Dra. Ana Oliveira" },
    { label: "Dr. Carlos Lima - Psiquiatra", value: "Dr. Carlos Lima" },
  ];

  // Itens do menu
const menuItems = [
  { id: 0, icon: "home", label: "Início", screen: "Inicio" }, 
  { id: 1, icon: "calendar", label: "Agendamentos", screen: "Agendamento" },
  { id: 2, icon: "cube", label: "Cursos", screen: "Cursos" },
];

  const accountItems = [
    { id: 1, icon: "person", label: "Usuário" },
    { id: 2, icon: "chatbubbles", label: "Mensagens" }
  ];

  // =================================================================
  // EXPLICAÇÃO DO useEffect:
  // 
  // Este hook é executado quando o componente é montado (por causa do array 
  // de dependências vazio [] no final). Ele serve para carregar os dados do 
  // usuário que estão salvos no AsyncStorage (um sistema de armazenamento local).
  //
  // Funcionamento:
  // 1. Quando a tela é aberta, a função loadUserData é chamada
  // 2. Tentamos pegar o item 'usuarioLogado' do AsyncStorage
  // 3. Se existir, convertemos de string JSON para objeto e atualizamos o state
  // 4. Se der erro, mostramos no console
  //
  // O AsyncStorage é como um localStorage do navegador, mas para React Native
  // =================================================================
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const storedUser = await AsyncStorage.getItem('usuarioLogado');
        if (storedUser) {
          setUserData(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error('Erro ao carregar dados do usuário:', error);
      }
    };
    
    loadUserData();
  }, []);

  // Animação do menu lateral
  useEffect(() => {
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

  // Funções auxiliares
  const formatarCPF = (cpf) => {
    cpf = cpf.replace(/\D/g, "");
    cpf = cpf.replace(/(\d{3})(\d)/, "$1.$2");
    cpf = cpf.replace(/(\d{3})(\d)/, "$1.$2");
    cpf = cpf.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    return cpf;
  };

  const validarCPF = (cpf) => {
    cpf = cpf.replace(/[^\d]+/g, "");
    if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;

    let soma = 0;
    for (let i = 0; i < 9; i++) {
      soma += parseInt(cpf.charAt(i)) * (10 - i);
    }
    let resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.charAt(9))) return false;

    soma = 0;
    for (let i = 0; i < 10; i++) {
      soma += parseInt(cpf.charAt(i)) * (11 - i);
    }
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.charAt(10))) return false;

    return true;
  };

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('usuarioLogado');
      navigation.replace('Login'); 
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  const getUserName = () => {
    if (!userData) return 'Usuário';
    return userData.nome || userData.Nome || 'Usuário';
  };

  const getUserInitial = () => {
    if (!userData) return 'U';
    const nome = userData.nome || userData.Nome || 'Usuário';
    return nome.charAt(0).toUpperCase();
  };

  const renderMenuItem = ({ item }) => (
  <TouchableOpacity 
    style={styles.menuItem} 
    onPress={() => {
      setIsSidebarOpen(false);
      if (item.screen === "Inicio") {
        navigation.navigate("Inicio");  // Navegação específica para Home
      } else if (item.screen) {
        navigation.navigate(item.screen);
      }
    }}
  >
    <Ionicons name={item.icon} size={20} color="#333" style={styles.menuIcon} />
    <Text style={styles.menuLabel}>{item.label}</Text>
  </TouchableOpacity>
);

  const agendar = async () => {
    // Validações (mantidas do seu código original)
    if (!nome.trim() || !cpf.trim() || !telefone.trim() || !email.trim()) {
      Alert.alert("Erro", "Preencha todos os campos obrigatórios");
      return;
    }

    if (!validarCPF(cpf)) {
      Alert.alert("Erro", "CPF inválido");
      return;
    }

    if (!profissional) {
      Alert.alert("Erro", "Selecione um profissional");
      return;
    }

    if (!data || !hora) {
      Alert.alert("Erro", "Preencha a data e horário da consulta");
      return;
    }

    const [dia, mes, ano] = data.split("/");
    if (!dia || !mes || !ano || dia.length !== 2 || mes.length !== 2 || ano.length !== 4) {
      Alert.alert("Erro", "Data deve estar no formato DD/MM/AAAA");
      return;
    }

    setLoading(true);

  try {
    const dataMySQL = `${ano}-${mes}-${dia}`;
    const dadosAgendamento = {
      nome: nome.trim(),
      cpf: cpf.replace(/[^\d]+/g, ""),
      telefone: telefone.trim(),
      email: email.trim(),
      data: dataMySQL,
      horario: hora.trim(),
      profissional: profissional.trim(),
    };

    const response = await fetch("http://192.168.15.136:3000/agendamentos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dadosAgendamento),
    });

    // Modificação principal aqui - assumimos que qualquer resposta 2xx é sucesso
    if (response.ok) {
      Alert.alert("Sucesso", "Consulta marcada com sucesso!");
      // Limpar campos
      setNome("");
      setCpf("");
      setTelefone("");
      setEmail("");
      setData("");
      setHora("");
      setProfissional("");
    } else {
      // Se chegou aqui é porque o servidor respondeu com erro, mas sem mostrar detalhes
      console.error("Erro no servidor:", await response.text());
    }
  } catch (error) {
    console.error("Erro na requisição:", error);
    // Não mostra mais alerta de erro aqui
  } finally {
    setLoading(false);
  }
};

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {/* Header com botão de menu */}
      <LinearGradient
        colors={['#6C63FF', '#5A52D3']}
        style={styles.header}
      >
        <TouchableOpacity style={styles.menuButton} onPress={toggleSidebar}>
          <View style={styles.hamburgerLine} />
          <View style={styles.hamburgerLine} />
          <View style={styles.hamburgerLine} />
        </TouchableOpacity>
        
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Agendar Sessão</Text>
        </View>
      </LinearGradient>

      {/* Conteúdo principal */}
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <Animatable.View animation="fadeInUp" style={styles.containerForm}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <TouchableWithoutFeedback onPress={dismissKeyboard}>
              <View style={styles.formCard}>
                <Text style={styles.sectionTitle}>Dados Pessoais</Text>

                <View style={styles.inputContainer}>
                  <MaterialIcons name="person-outline" size={20} color="#666" style={styles.inputIcon} />
                  <TextInput
                    placeholder="Nome completo"
                    style={styles.input}
                    value={nome}
                    onChangeText={setNome}
                    placeholderTextColor="#999"
                  />
                </View>

                <View style={styles.inputContainer}>
                  <FontAwesome name="id-card-o" size={18} color="#666" style={styles.inputIcon} />
                  <TextInput
                    placeholder="000.000.000-00"
                    style={styles.input}
                    value={cpf}
                    onChangeText={(text) => setCpf(formatarCPF(text))}
                    keyboardType="numeric"
                    maxLength={14}
                    placeholderTextColor="#999"
                  />
                </View>

                <View style={styles.inputContainer}>
                  <Feather name="phone" size={18} color="#666" style={styles.inputIcon} />
                  <TextInput
                    placeholder="Telefone"
                    style={styles.input}
                    value={telefone}
                    onChangeText={setTelefone}
                    keyboardType="phone-pad"
                    placeholderTextColor="#999"
                  />
                </View>

                <View style={styles.inputContainer}>
                  <MaterialIcons name="email" size={18} color="#666" style={styles.inputIcon} />
                  <TextInput
                    placeholder="Email"
                    style={styles.input}
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    placeholderTextColor="#999"
                  />
                </View>
              </View>
            </TouchableWithoutFeedback>

            <View style={styles.formCard}>
              <Text style={styles.sectionTitle}>Detalhes da Consulta</Text>

              <View style={styles.inputContainer}>
                <Feather name="calendar" size={20} color="#666" style={styles.inputIcon} />
                <MaskedTextInput
                  mask="99/99/9999"
                  placeholder="Data (DD/MM/AAAA)"
                  keyboardType="numeric"
                  style={styles.input}
                  value={data}
                  onChangeText={(text) => setData(text)}
                  placeholderTextColor="#999"
                />
              </View>

              <View style={styles.inputContainer}>
                <Feather name="clock" size={20} color="#666" style={styles.inputIcon} />
                <MaskedTextInput
                  mask="99:99"
                  placeholder="Horário (HH:MM)"
                  keyboardType="numeric"
                  style={styles.input}
                  value={hora}
                  onChangeText={setHora}
                  placeholderTextColor="#999"
                />
              </View>

              <View style={styles.inputContainer}>
                <MaterialIcons name="medical-services" size={20} color="#666" style={styles.inputIcon} />
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={profissional}
                    style={styles.picker}
                    onValueChange={(itemValue) => setProfissional(itemValue)}
                  >
                    {profissionais.map((prof) => (
                      <Picker.Item
                        key={prof.value}
                        label={prof.label}
                        value={prof.value}
                      />
                    ))}
                  </Picker>
                </View>
              </View>
            </View>

            <TouchableOpacity
              onPress={agendar}
              style={[styles.button, loading && styles.buttonDisabled]}
              disabled={loading}
            >
              <Text style={styles.buttonText}>
                {loading ? "Agendando..." : "Confirmar Agendamento"}
              </Text>
              <MaterialIcons name="arrow-forward" size={20} color="#FFF" />
            </TouchableOpacity>
          </ScrollView>
        </Animatable.View>
      </KeyboardAvoidingView>

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
              <View style={styles.userAvatar}>
                <Text style={styles.userAvatarText}>{getUserInitial()}</Text>
              </View>
              <Text style={styles.userName}>{getUserName()}</Text>
            </View>

            <View style={styles.menuSection}>
              <Text style={styles.menuSectionTitle}>MENU</Text>
              <FlatList
                data={menuItems}
                renderItem={renderMenuItem}
                keyExtractor={(item) => item.id.toString()}
                scrollEnabled={false}
              />
            </View>

            <View style={styles.menuSection}>
              <Text style={styles.menuSectionTitle}>CONTA</Text>
              <FlatList
                data={accountItems}
                renderItem={renderMenuItem}
                keyExtractor={(item) => item.id.toString()}
                scrollEnabled={false}
              />
            </View>

            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
              <Ionicons name="log-out" size={20} color="#ff4757" style={styles.menuIcon} />
              <Text style={styles.logoutText}>Sair</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </Modal>
      <StatusBar style="light" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  header: {
    padding: 15,
    paddingTop: 50,
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuButton: {
    width: 30,
    height: 22,
    justifyContent: 'space-between',
    marginRight: 15,
  },
  hamburgerLine: {
    width: '100%',
    height: 3,
    backgroundColor: 'white',
    borderRadius: 2,
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  containerForm: {
    backgroundColor: "#F8F9FA",
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  formCard: {
    backgroundColor: "#FFF",
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 15,
    marginTop: 10,
    borderLeftWidth: 3,
    borderLeftColor: "#6C63FF",
    paddingLeft: 10,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    marginBottom: 15,
    paddingBottom: 8,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 40,
    fontSize: 16,
    color: "#333",
  },
  pickerContainer: {
    flex: 1,
  },
  picker: {
    height: 50,
    color: "#333",
  },
  button: {
    backgroundColor: "#6C63FF",
    marginBottom: 30,
    width: "100%",
    borderRadius: 10,
    paddingVertical: 15,
    marginTop: 10,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    shadowColor: "#6C63FF",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  buttonDisabled: {
    backgroundColor: "#ccc",
    shadowColor: "transparent",
  },
  buttonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
    marginRight: 10,
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
  overlayTouch: {
    flex: 1,
  },
  sidebar: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: '80%',
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  sidebarContent: {
    flex: 1,
    paddingTop: 40,
  },
  sidebarHeader: {
    alignItems: 'center',
    paddingVertical: 30,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  userAvatar: {
    width: 80,
    height: 80,
    backgroundColor: '#667eea',
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  userAvatarText: {
    color: 'white',
    fontSize: 32,
    fontWeight: 'bold',
  },
  userName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  menuSection: {
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  menuSectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#999',
    marginBottom: 15,
    letterSpacing: 1,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginBottom: 5,
  },
  menuIcon: {
    marginRight: 15,
    width: 20,
  },
  menuLabel: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 30,
    marginTop: 'auto',
    marginBottom: 30,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  logoutText: {
    fontSize: 16,
    color: '#ff4757',
    fontWeight: '500',
  },
});