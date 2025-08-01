import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Keyboard,
  TouchableWithoutFeedback,
  Image,
  Alert,
} from "react-native";
import React, { useState, useEffect } from "react";
import * as Animatable from "react-native-animatable";
import { useNavigation } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import 'react-native-gesture-handler';

SplashScreen.preventAutoHideAsync();

export default function LoginScreen() {
  const navigation = useNavigation();

  const [fontsLoaded] = useFonts({
    'Popi': require('../assets/fonts/Poppins-Regular.ttf'),
    'oi': require('../assets/fonts/Poppins-SemiBold.ttf'),
  });

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showNotification, setShowNotification] = useState(false);

  const api = axios.create({
    baseURL: "http://192.168.15.136:3000",
    timeout: 10000,
    headers: {
      "Content-Type": "application/json",
    },
  });

  // Função para mostrar notificação de erro
  const showErrorNotification = (message) => {
    setError(message);
    setShowNotification(true);
    
    // Auto-ocultar após 4 segundos
    setTimeout(() => {
      setShowNotification(false);
    }, 4000);
  };

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Erro", "Por favor, preencha todos os campos");
      return;
    }

    setIsLoading(true);
    setError("");
    setShowNotification(false);

    try {
      const response = await api.post("/login", {
        email: email.trim(),
        senha: password.trim(),
      });

      if (response.data.success) {
        const user = response.data.user;
        await AsyncStorage.setItem("usuarioLogado", JSON.stringify(user));
        
        // Navegar para a próxima tela passando os dados do usuário e flag de welcome
        navigation.replace("Inicio", { 
          user, 
          showWelcome: true,
          welcomeMessage: `Bem-vindo, ${user.nome || user.Nome}!`
        });
        
      } else {
        showErrorNotification("Email ou senha inválidos");
      }

    } catch (error) {
      let errorMessage = "Erro de conexão desconhecido";
      if (error.response) {
        errorMessage = error.response.data.message || "Erro no servidor";
      } else if (error.request) {
        errorMessage = "Servidor não respondeu. Verifique sua conexão com o servidor.";
      } else {
        errorMessage = error.message;
      }
      showErrorNotification(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <StatusBar style="light" />
          
          {/* Notificação de erro */}
          {showNotification && (
            <Animatable.View 
              animation="slideInDown" 
              duration={500}
              style={styles.notification}
            >
              <View style={styles.notificationContent}>
                <Text style={styles.notificationIcon}>⚠️</Text>
                <Text style={styles.notificationText}>{error}</Text>
                <TouchableOpacity 
                  onPress={() => setShowNotification(false)}
                  style={styles.closeButton}
                >
                  <Text style={styles.closeButtonText}>✕</Text>
                </TouchableOpacity>
              </View>
            </Animatable.View>
          )}

          <Image
            source={require("../assets/LogoInicial.png")}
            style={styles.topRightImage}
          />

          <Animatable.View animation="fadeInLeft" delay={500} style={styles.containerHeader}>
            <Text style={styles.message}>Olá!</Text>
            <Text style={styles.text}>Seja bem-vindo à Augebit.</Text>
          </Animatable.View>

          <Animatable.View animation="fadeInUp" style={styles.containerForm}>
            <TextInput
              placeholder="E-mail"
              style={styles.input}
              onChangeText={setEmail}
              value={email}
            />
            <TextInput
              placeholder="Senha"
              style={styles.input}
              onChangeText={setPassword}
              secureTextEntry
              value={password}
            />

            <TouchableOpacity
              onPress={() => navigation.navigate("cadastro")}
              style={styles.buttonRegister}
            >
              <Text style={styles.registerText}>Esqueceu sua senha?</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={handleLogin} style={styles.button}>
              <Text style={styles.buttonText}>{isLoading ? "Carregando..." : "Login"}</Text>
            </TouchableOpacity>
          </Animatable.View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  containerHeader: {
    paddingTop: "20%",
    marginTop: "14%",
    marginBottom: "30%",
    paddingStart: "5%",
  },
  message: {
    fontSize: 45,
    color: "#000000",
    fontFamily: "Popi",
    fontWeight: "600",
    paddingLeft: 25,
  },
  containerForm: {
    backgroundColor: "#6E6EFF",
    flex: 2,
    borderTopLeftRadius: 100,
    borderTopRightRadius: 100,
    paddingStart: "5%",
    paddingEnd: "5%",
    justifyContent: "center",
  },
  input: {
    height: 50,
    marginBottom: 35,
    fontSize: 16,
    backgroundColor: "#ffffff",
    paddingLeft: 30,
    marginLeft: 15,
    borderRadius: 15,
    fontFamily: "Popi",
    paddingTop: 15,
    width: 340,
  },
  button: {
    backgroundColor: "#ffffff",
    width: 190,
    height: 50,
    borderRadius: 15,
    paddingVertical: 8,
    marginTop: 14,
    marginLeft: "22.5%",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "#000",
    fontSize: 18,
    fontFamily: "Popi",
    fontWeight: "400",
    paddingTop: 4,
  },
  buttonRegister: {
    marginTop: 14,
    alignSelf: "flex-end",
    marginRight: 20,
  },
  registerText: {
    marginTop: -41,
    color: "#fff",
    fontFamily: "Popi",
  },
  text: {
    fontSize: 20,
    fontFamily: "Popi",
    paddingLeft: 25,
    lineHeight: 25,
  },
  topRightImage: {
    position: "absolute",
    width: 70,
    height: 70,
    top: 45,
    right: 25,
    resizeMode: "contain",
    zIndex: 10,
  },
  // Estilos da notificação
  notification: {
    position: "absolute",
    top: 60,
    left: 20,
    right: 20,
    zIndex: 1000,
  },
  notificationContent: {
    backgroundColor: "#ff4757",
    borderRadius: 12,
    padding: 15,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  notificationIcon: {
    fontSize: 20,
    marginRight: 10,
  },
  notificationText: {
    color: "#fff",
    fontFamily: "Popi",
    fontSize: 14,
    flex: 1,
    fontWeight: "500",
  },
  closeButton: {
    padding: 5,
  },
  closeButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});