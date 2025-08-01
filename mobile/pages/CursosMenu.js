import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Animated,
  Modal,
  TouchableWithoutFeedback,
  Dimensions
} from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

const CursosMenu = () => {
  const navigation = useNavigation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const slideAnim = useRef(new Animated.Value(-width)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const cursos = [
    { id: 1, title: 'Produtividade no Trabalho', icon: 'rocket', screen: 'CursoProdutividade' },
    { id: 2, title: 'Equilíbrio Vida-Trabalho', icon: 'balance', screen: 'CursoEquilibrio' },
  ];

  const menuItems = [
    { id: 1, icon: "home", label: "Início", screen: "Inicio" },
    { id: 2, icon: "calendar", label: "Agendamentos", screen: "Agendamento" },
    { id: 3, icon: "book", label: "Cursos", screen: "CursosMenu" },
  ];

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
        <Text style={styles.headerTitle}>Nossos Cursos</Text>
        <TouchableOpacity onPress={toggleSidebar}>
          <MaterialIcons name="menu" size={28} color="#7C3AED" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={cursos}
        contentContainerStyle={styles.listContent}
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
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  listContent: {
    padding: 15,
  },
  cursoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    marginBottom: 10,
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  cursoTitle: {
    flex: 1,
    fontSize: 16,
    color: '#1F2937',
    marginLeft: 15,
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
    paddingTop: 20,
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

export default CursosMenu;