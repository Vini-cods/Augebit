import React from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const CursosMenu = () => {
  const navigation = useNavigation();

  const cursos = [
    {
      id: 1,
      title: "Produtividade no Trabalho",
      icon: "rocket",
      screen: "CursoProdutividade",
    },
    {
      id: 2,
      title: "Gestão de Tempo",
      icon: "time",
      screen: "CursoGestaoTempo",
    },
    {
      id: 3,
      title: "Comunicação Eficaz",
      icon: "chatbubbles",
      screen: "CursoComunicacao",
    },
    {
      id: 4,
      title: "Equilíbrio Vida-Trabalho",
      icon: "balance",
      screen: "CursoEquilibrio",
    },
  ];
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Nossos Cursos</Text>
      </View>

      <FlatList
        data={cursos}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.cursoItem}
            onPress={() => navigation.navigate(item.screen)}
          >
            <Ionicons name={item.icon} size={24} color="#7C3AED" />
            <Text style={styles.cursoTitle}>{item.title}</Text>
            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#1F2937",
  },
  cursoItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  cursoTitle: {
    flex: 1,
    fontSize: 16,
    color: "#1F2937",
    marginLeft: 15,
  },
});

export default CursosMenu;
