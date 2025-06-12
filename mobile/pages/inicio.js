import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  Dimensions,
  StyleSheet,
  ScrollView,
  TouchableWithoutFeedback,
  SafeAreaView,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useRoute } from '@react-navigation/native';


const { width: screenWidth } = Dimensions.get('window');

// Componente Carrossel
const Carousel = ({ data, autoPlay = true, autoPlayInterval = 3000, navigation }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollViewRef = useRef(null);
  const intervalRef = useRef(null);

  // Dados de exemplo se não fornecidos
  const defaultData = [
    {
      id: 1,
      image: 'https://via.placeholder.com/400x200/FF6B6B/FFFFFF?text=Slide+1',
      title: 'Primeiro Slide',
      description: 'Descrição do primeiro slide',
      navigationTarget: 'BemVindo', // Nome da tela para navegar
    },
    {
      id: 2,
      image: 'https://via.placeholder.com/400x200/4ECDC4/FFFFFF?text=Slide+2',
      title: 'Segundo Slide',
      description: 'Descrição do segundo slide',
      navigationTarget: 'ProductDetails',
      params: { productId: 2 }
    },
    {
      id: 3,
      image: 'https://via.placeholder.com/400x200/45B7D1/FFFFFF?text=Slide+3',
      title: 'Terceiro Slide',
      description: 'Descrição do terceiro slide',
      navigationTarget: 'ProductDetails',
      params: { productId: 3 }
    },
    {
      id: 4,
      image: 'https://via.placeholder.com/400x200/96CEB4/FFFFFF?text=Slide+4',
      title: 'Quarto Slide',
      description: 'Descrição do quarto slide',
      navigationTarget: 'ProductDetails',
      params: { productId: 4 }
    },
  ];

  const carouselData = data || defaultData;

  // Auto play functionality
  useEffect(() => {
    if (autoPlay) {
      startAutoPlay();
    }
    return () => stopAutoPlay();
  }, [autoPlay, currentIndex]);

  const startAutoPlay = () => {
    stopAutoPlay();
    intervalRef.current = setInterval(() => {
      goToNext();
    }, autoPlayInterval);
  };

  const stopAutoPlay = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const goToNext = () => {
    const nextIndex = (currentIndex + 1) % carouselData.length;
    setCurrentIndex(nextIndex);
    scrollViewRef.current?.scrollTo({
      x: nextIndex * (screenWidth - 40),
      animated: true,
    });
  };

  const goToPrevious = () => {
    const prevIndex = currentIndex === 0 ? carouselData.length - 1 : currentIndex - 1;
    setCurrentIndex(prevIndex);
    scrollViewRef.current?.scrollTo({
      x: prevIndex * (screenWidth - 40),
      animated: true,
    });
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
    scrollViewRef.current?.scrollTo({
      x: index * (screenWidth - 40),
      animated: true,
    });
  };

  const handleScroll = (event) => {
    const slideSize = screenWidth - 40;
    const index = Math.round(event.nativeEvent.contentOffset.x / slideSize);
    if (index !== currentIndex) {
      setCurrentIndex(index);
    }
  };

  const handleSlidePress = (item) => {
    if (navigation && item.navigationTarget) {
      // Para quando o usuário toca na imagem/slide
      stopAutoPlay();
      
      // Navega para a tela especificada
      navigation.navigate(item.navigationTarget, item.params || {});
    }
  };

  const renderSlide = (item, index) => (
    <TouchableOpacity 
      key={item.id} 
      style={[styles.slide, { width: screenWidth - 40 }]}
      onPress={() => handleSlidePress(item)}
      activeOpacity={0.9}
    >
      <Image source={{ uri: item.image }} style={styles.image} />
      <View style={styles.textContainer}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.description}>{item.description}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderIndicators = () => (
    <View style={styles.indicatorContainer}>
      {carouselData.map((_, index) => (
        <TouchableOpacity
          key={index}
          style={[
            styles.indicator,
            { backgroundColor: index === currentIndex ? '#007AFF' : '#C7C7CC' }
          ]}
          onPress={() => goToSlide(index)}
        />
      ))}
    </View>
  );

  const renderNavigationButtons = () => (
    <View style={styles.navigationContainer}>
      <TouchableOpacity
        style={[styles.navButton, styles.prevButton]}
        onPress={goToPrevious}
      >
        <Text style={styles.navButtonText}>‹</Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={[styles.navButton, styles.nextButton]}
        onPress={goToNext}
      >
        <Text style={styles.navButtonText}>›</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.carouselContainer}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled={false}
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        onTouchStart={stopAutoPlay}
        onTouchEnd={autoPlay ? startAutoPlay : undefined}
        snapToInterval={screenWidth - 40}
        snapToAlignment="center"
        decelerationRate="fast"
      >
        {carouselData.map(renderSlide)}
      </ScrollView>
      
      {renderIndicators()}
      {renderNavigationButtons()}
    </View>
    
  );
};

//MENU!!!!!!!!!!!!

// Componente principal SidebarMenu
const SidebarMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const slideAnimation = useRef(new Animated.Value(-250)).current;
  const overlayAnimation = useRef(new Animated.Value(0)).current;
  const navigation = useNavigation();
  const route = useRoute();

  // Carregar dados do usuário ao iniciar a tela
  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      // Primeiro, tenta pegar os dados passados pela navegação
      if (route.params?.user) {
        setUserData(route.params.user);
        return;
      }

      // Se não tem na navegação, busca no AsyncStorage
      const storedUser = await AsyncStorage.getItem('usuarioLogado');
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setUserData(parsedUser);
      }
    } catch (error) {
      console.error('Erro ao carregar dados do usuário:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('usuarioLogado');
      navigation.replace('Login'); 
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  const toggleSidebar = () => {
    if (isOpen) {
      closeSidebar();
    } else {
      openSidebar();
    }
  };

  const openSidebar = () => {
    setIsOpen(true);
    Animated.parallel([
      Animated.timing(slideAnimation, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(overlayAnimation, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const closeSidebar = () => {
    Animated.parallel([
      Animated.timing(slideAnimation, {
        toValue: -250,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(overlayAnimation, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setIsOpen(false);
    });
  };

  const menuItems = [
    { icon: 'grid', label: 'Dashboard' },
    { icon: 'package', label: 'Products' },
    { icon: 'calendar', label: 'Schedule' },
    { icon: 'check-square', label: 'My Task' },
    { icon: 'bar-chart-2', label: 'Reporting' },
  ];

  const accountItems = [
    { icon: 'user', label: 'User' },
    { icon: 'message-square', label: 'Messages' },
  ];

  const MenuItem = ({ icon, label, onPress }) => (
    <TouchableOpacity style={styles.menuItem} onPress={onPress} activeOpacity={0.7}>
      <Icon name={icon} size={20} color="#000" style={styles.menuIcon} />
      <Text style={styles.menuLabel}>{label}</Text>
    </TouchableOpacity>
  );

  
  const getUserName = () => {
    if (!userData) return 'Usuário';
    return userData.nome || userData.Nome || 'Usuário';
  };

  const getUserInitial = () => {
  if (!userData) return 'U'; // Letra padrão caso não haja dados
  const nome = userData.nome || userData.Nome || 'Usuário';
  return nome.charAt(0).toUpperCase();
};


  const getUserEmail = () => {
    if (!userData) return '';
    return userData.email || '';
  };
  return (
    <SafeAreaView style={styles.container}>
      {/* Botão Hamburguer */}
      {!isOpen && (
        <TouchableOpacity
          style={styles.hamburgerButton}
          onPress={toggleSidebar}
          activeOpacity={0.8}
        >
          <View style={styles.hamburgerLine} />
          <View style={styles.hamburgerLine} />
          <View style={styles.hamburgerLine} />
        </TouchableOpacity>
      )}

      {/* Overlay */}
      {isOpen && (
        <TouchableWithoutFeedback onPress={closeSidebar}>
          <Animated.View
            style={[
              styles.overlay,
              {
                opacity: overlayAnimation,
              },
            ]}
          />
        </TouchableWithoutFeedback>
      )}

      {/* Sidebar */}
      <Animated.View
        style={[
          styles.sidebar,
          {
            transform: [{ translateX: slideAnimation }],
          },
        ]}
      >
        <ScrollView style={styles.sidebarContent} showsVerticalScrollIndicator={false}>
          {/* Botão X */}
          <TouchableOpacity
            style={styles.closeButton}
            onPress={closeSidebar}
            activeOpacity={0.7}
          >
            <Icon name="x" size={20} color="#000" />
          </TouchableOpacity>

          {/* Logo */}
          <View style={styles.logoContainer}>
            <View style={styles.logoIcon}>
              <Text style={styles.logoText}>{getUserInitial()}</Text>
            </View>
            <Text style={styles.logoLabel}> {getUserName()} </Text>
          </View>

          {/* Menu Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>MENU</Text>
            {menuItems.map((item, index) => (
              <MenuItem
                key={index}
                icon={item.icon}
                label={item.label}
                onPress={() => {
                  console.log(`Clicou em ${item.label}`);
                  closeSidebar();
                }}
              />
            ))}
          </View>

          {/* Account Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>ACCOUNT</Text>
            {accountItems.map((item, index) => (
              <MenuItem
                key={index}
                icon={item.icon}
                label={item.label}
                onPress={() => {
                  console.log(`Clicou em ${item.label}`);
                  closeSidebar();
                }}
              />
            ))}
          </View>
        </ScrollView>
      </Animated.View>

      {/* Conteúdo Principal com Carrossel */}
      <ScrollView style={styles.mainContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.mainTitle}>
          Olá {getUserName()}, tudo bem?
        </Text>
        
        {/* Carrossel integrado */}
        <View style={styles.carouselSection}>
          <Carousel 
            autoPlay={true}
            autoPlayInterval={4000}
            navigation={navigation}
          />
        </View>
      </ScrollView>
      <View>
          <Image style={styles.logoSegunda} source={require('../assets/AugebitQualidade.png')}/>
          <Text style={styles.teext}>
          Conheça um pouco sobre a empresa
        </Text>
            <Text style={styles.textoComum}> 
            A Augebit é uma empresa de tecnologia que oferece soluções personalizadas em TI com foco em inovação, eficiência e resultados. Atuamos com compromisso e transparência para impulsionar o crescimento dos nossos clientes.
            </Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  hamburgerButton: {
    position: 'absolute',
    top: 60,
    left: 16,
    zIndex: 1000,
    padding: 12,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
 
  },
  hamburgerLine: {
    width: 20,
    height: 2,
    backgroundColor: 'white',
    marginVertical: 2,
    backgroundColor: '#000',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 998,
  },
  sidebar: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    width: 250,
    backgroundColor: 'white',
    zIndex: 999,
    shadowColor: '#000',
    shadowOffset: {
      width: 2,
      height: 0,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  sidebarContent: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 80,
  },
  closeButton: {
    position: 'absolute',
    top: 20,
    right: 16,
    zIndex: 1001,
    padding: 4,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 60,
    marginBottom: 32,
  },
  logoIcon: {
    width: 32,
    height: 32,
    backgroundColor: '#7C3AED',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  logoText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  logoLabel: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '500',
    color: '#000',
    letterSpacing: 1,
    marginBottom: 16,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 4,
  },
  menuIcon: {
    marginRight: 12,
  },
  menuLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
  },
  mainContent: {
    flex: 1,
    paddingTop: 120 ,
    paddingHorizontal: 20,
  },
  mainTitle: {
    fontSize: 25,
    fontWeight: 'semibold',
    color: '#6E6EFF',
    marginBottom: 16,
    marginTop:16,
    fontFamily:'oi'
  },
  mainText: {
    fontSize: 16,
    color: '#6B7280',
    lineHeight: 24,
    marginBottom: 24,
  },

  sectionTitleMain: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
  },
  // Estilos do Carrossel
  carouselContainer: {
    position: 'relative',
    height: 200,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  slide: {
    height: 200,
    position: 'relative',
    marginRight: 0,
  },
  image: {
    width: '100%',
    height: '70%',
    resizeMode: 'cover',
  },
  textContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 15,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 5,
  },
  description: {
    fontSize: 12,
    color: '#E0E0E0',
    lineHeight: 16,
    marginBottom: 4,
  },
  tapHint: {
    fontSize: 10,
    color: '#FFFFFF',
    fontStyle: 'italic',
    opacity: 0.8,
  },
  indicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 8,
    left: 0,
    right: 0,
  },
  indicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginHorizontal: 3,
  },
  navigationContainer: {
    position: 'absolute',
    top: '50%',
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    transform: [{ translateY: -15 }],
  },
  navButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  navButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: -2,
  },
  prevButton: {
    alignSelf: 'flex-start',
  },
  nextButton: {
    alignSelf: 'flex-end',
  },

  logoSegunda: {
    width: 200,
    height: 40,
    marginLeft: 50,
    bottom: 370, 
    left: 50
  },

  carouselSection: {
    top: 30
  },

  teext: {
    marginLeft: 50,
    bottom: 360, 
    left: 20,
    color: '#6E6EFF',
    fontWeight: 'semibold',
    fontFamily: 'oi'
  },

  textoComum: {
    fontFamily: 'Popi',
    fontSize: 10,
    width: 300,
    left: 20,
    bottom: 360, 
    fontWeight: 600
  }
});

export default SidebarMenu;