import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Animated,
  Dimensions,
  StatusBar,
  StyleSheet,
  SafeAreaView,
  Modal,
  FlatList,
  Image,
  TouchableWithoutFeedback
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialIcons, FontAwesome } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useRoute } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

// Componente Carrossel Integrado
const IntegratedCarousel = ({ data, autoPlay = true, autoPlayInterval = 3000, navigation }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollViewRef = useRef(null);
  const intervalRef = useRef(null);

  // Dados de exemplo se não fornecidos
  const defaultData = [
    {
      id: 1,
      image: 'https://via.placeholder.com/400x200/FF6B6B/FFFFFF?text=Novidades+2024',
      title: 'Novidades 2024',
      description: 'Descubra as últimas funcionalidades da plataforma',
      navigationTarget: 'Novidades',
    },
    {
      id: 2,
      image: 'https://via.placeholder.com/400x200/4ECDC4/FFFFFF?text=Agendamentos',
      title: 'Agendamentos Inteligentes',
      description: 'Sistema automatizado de consultas e sessões',
      navigationTarget: 'Agendamento',
      params: { feature: 'smart' }
    },
    {
      id: 3,
      image: 'https://via.placeholder.com/400x200/45B7D1/FFFFFF?text=Cursos+Online',
      title: 'Cursos Mentais',
      description: 'Aprenda técnicas de bem-estar e desenvolvimento',
      navigationTarget: 'Cursos',
      params: { category: 'mental' }
    },
    {
      id: 4,
      image: 'https://via.placeholder.com/400x200/96CEB4/FFFFFF?text=Suporte+24h',
      title: 'Suporte 24h',
      description: 'Atendimento especializado sempre disponível',
      navigationTarget: 'Suporte',
      params: { type: 'premium' }
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
      x: nextIndex * (width * 0.9),
      animated: true,
    });
  };

  const goToPrevious = () => {
    const prevIndex = currentIndex === 0 ? carouselData.length - 1 : currentIndex - 1;
    setCurrentIndex(prevIndex);
    scrollViewRef.current?.scrollTo({
      x: prevIndex * (width * 0.9),
      animated: true,
    });
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
    scrollViewRef.current?.scrollTo({
      x: index * (width * 0.9),
      animated: true,
    });
  };

  const handleScroll = (event) => {
    const slideSize = width * 0.9;
    const index = Math.round(event.nativeEvent.contentOffset.x / slideSize);
    if (index !== currentIndex && index >= 0 && index < carouselData.length) {
      setCurrentIndex(index);
    }
  };

  const handleSlidePress = (item) => {
    if (navigation && item.navigationTarget) {
      stopAutoPlay();
      navigation.navigate(item.navigationTarget, item.params || {});
    }
  };

  const renderSlide = (item, index) => (
    <TouchableOpacity 
      key={item.id} 
      style={[styles.carouselSlide, { width: width * 0.9 }]}
      onPress={() => handleSlidePress(item)}
      activeOpacity={0.9}
    >
      <Image source={{ uri: item.image }} style={styles.carouselImage} />
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.8)']}
        style={styles.carouselGradient}
      >
        <Text style={styles.carouselTitle}>{item.title}</Text>
        <Text style={styles.carouselDescription}>{item.description}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );

  const renderIndicators = () => (
    <View style={styles.carouselIndicatorContainer}>
      {carouselData.map((_, index) => (
        <TouchableOpacity
          key={index}
          style={[
            styles.carouselIndicator,
            { backgroundColor: index === currentIndex ? '#fff' : 'rgba(255,255,255,0.5)' }
          ]}
          onPress={() => goToSlide(index)}
        />
      ))}
    </View>
  );

  const renderNavigationButtons = () => (
    <View style={styles.carouselNavigationContainer}>
      <TouchableOpacity
        style={styles.carouselNavButton}
        onPress={goToPrevious}
      >
        <Ionicons name="chevron-back" size={20} color="white" />
      </TouchableOpacity>
      
      <TouchableOpacity
        style={styles.carouselNavButton}
        onPress={goToNext}
      >
        <Ionicons name="chevron-forward" size={20} color="white" />
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
        snapToInterval={width * 0.9}
        snapToAlignment="center"
        decelerationRate="fast"
        contentContainerStyle={{ paddingHorizontal: (width - width * 0.9) / 2 }}
      >
        {carouselData.map(renderSlide)}
      </ScrollView>
      
      {renderIndicators()}
      {renderNavigationButtons()}
    </View>
  );
};

const AugebitApp = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [userData, setUserData] = useState(null);
  const slideAnim = useRef(new Animated.Value(-width)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const navigation = useNavigation();
  const route = useRoute();

  const testimonials = [
    {
      id: 1,
      name: "Maria Silva",
      avatar: "MS",
      rating: 5,
      text: "Aplicativo excelente! Muito fácil de usar e prático para agendar consultas."
    },
    {
      id: 2,
      name: "João Santos",
      avatar: "JS",
      rating: 5,
      text: "Interface intuitiva e atendimento rápido. Recomendo para todos!"
    },
    {
      id: 3,
      name: "Ana Costa",
      avatar: "AC",
      rating: 4,
      text: "Ótima ferramenta para gestão de consultas. Economiza muito tempo."
    },
    {
      id: 4,
      name: "Pedro Lima",
      avatar: "PL",
      rating: 5,
      text: "App bem desenvolvido e funcional. Parabéns à equipe!"
    }
  ];

  const resources = [
    {
      id: 1,
      icon: "calendar",
      title: "Agendamento de sessões",
      description: "Agende suas consultas de forma prática e rápida"
    },
    {
      id: 2,
      icon: "chatbubbles",
      title: "Chat interno",
      description: "Comunique-se diretamente com profissionais"
    },
    {
      id: 3,
      icon: "person-circle",
      title: "Cursos Mentais",
      description: "Gerencie seu perfil e histórico médico"
    }
  ];

const menuItems = [
  { id: 0, icon: "home", label: "Início", screen: "Inicio" },  
  { id: 1, icon: "calendar", label: "Agendamentos", screen: "Agendamento" },
  { id: 2, icon: "book", label: "Cursos", screen: "CursosMenu" },
];

  const accountItems = [
    { id: 1, icon: "person", label: "Usuário" },
    { id: 2, icon: "chatbubbles", label: "Mensagens" }
  ];

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

  const getUserName = () => {
    if (!userData) return 'Usuário';
    return userData.nome || userData.Nome || 'Usuário';
  };

  const getUserInitial = () => {
    if (!userData) return 'U';
    const nome = userData.nome || userData.Nome || 'Usuário';
    return nome.charAt(0).toUpperCase();
  };

  // Testimonial auto-rotation
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial(prev => (prev + 1) % testimonials.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Sidebar animations
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

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const nextTestimonial = () => {
    setCurrentTestimonial(prev => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial(prev => prev === 0 ? testimonials.length - 1 : prev - 1);
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <FontAwesome
        key={i}
        name={i < rating ? "star" : "star-o"}
        size={16}
        color="#FFD700"
        style={{ marginHorizontal: 2 }}
      />
    ));
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

  const renderResourceCard = ({ item, index }) => (
    <View style={[styles.resourceCard, { marginLeft: index === 0 ? 20 : 10, marginRight: index === resources.length - 1 ? 20 : 10 }]}>
      <LinearGradient
        colors={['#22d3ee', '#06b6d4']}
        style={styles.resourceGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Ionicons name={item.icon} size={48} color="white" style={styles.resourceIcon} />
        <Text style={styles.resourceTitle}>{item.title}</Text>
        <Text style={styles.resourceDescription}>{item.description}</Text>
      </LinearGradient>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#667eea" />
      
      {/* Header */}
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <TouchableOpacity style={styles.menuButton} onPress={toggleSidebar}>
          <View style={styles.hamburgerLine} />
          <View style={styles.hamburgerLine} />
          <View style={styles.hamburgerLine} />
        </TouchableOpacity>
        
        <View style={styles.headerContent}>
          <MaterialIcons name="view-in-ar" size={40} color="white" />
          <Text style={styles.greeting}>Olá {getUserName()}, tudo bem?</Text>
        </View>
      </LinearGradient>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Red Banner with Integrated Carousel */}
        <LinearGradient
          colors={['#667eea', 'transparent']}
          style={styles.redBanner}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <IntegratedCarousel 
            autoPlay={true}
            autoPlayInterval={4000}
            navigation={navigation}
          />
        </LinearGradient>

        {/* Company Section */}
        <View style={styles.companySection}>
          <Text style={styles.companyLogo}>AUGEBIT</Text>
          <Text style={styles.companyTitle}>Conheça um pouco sobre a empresa</Text>
          <Text style={styles.companyDescription}>
            A Augebit é uma empresa de tecnologia que oferece soluções personalizadas em TI com foco em inovação, eficiência e resultados. Atuamos com compromisso e transparência para impulsionar o crescimento dos nossos clientes.
          </Text>
        </View>

        {/* Resources Section */}
        <View style={styles.resourcesSection}>
          <Text style={styles.sectionTitle}>Nossos recursos</Text>
          <FlatList
            data={resources}
            renderItem={renderResourceCard}
            keyExtractor={(item) => item.id.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.resourcesList}
          />
        </View>

        {/* Testimonials Section */}
        <LinearGradient
          colors={['#1f2937', '#374151']}
          style={styles.testimonialsSection}
        >
          <Text style={styles.testimonialsTitle}>O que dizem sobre nós</Text>
          
          <View style={styles.testimonialContainer}>
            <View style={styles.testimonialCard}>
              <View style={styles.testimonialAvatar}>
                <Text style={styles.avatarText}>
                  {testimonials[currentTestimonial].avatar}
                </Text>
              </View>
              <Text style={styles.testimonialName}>
                {testimonials[currentTestimonial].name}
              </Text>
              <View style={styles.starsContainer}>
                {renderStars(testimonials[currentTestimonial].rating)}
              </View>
              <Text style={styles.testimonialText}>
                "{testimonials[currentTestimonial].text}"
              </Text>
            </View>

            <View style={styles.testimonialNav}>
              <TouchableOpacity style={styles.navButton} onPress={prevTestimonial}>
                <Ionicons name="chevron-back" size={24} color="white" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.navButton} onPress={nextTestimonial}>
                <Ionicons name="chevron-forward" size={24} color="white" />
              </TouchableOpacity>
            </View>

            <View style={styles.indicators}>
              {testimonials.map((_, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.indicator,
                    index === currentTestimonial && styles.activeIndicator
                  ]}
                  onPress={() => setCurrentTestimonial(index)}
                />
              ))}
            </View>
          </View>
        </LinearGradient>

        {/* Nova Seção Roxa */}
        <LinearGradient
          colors={['#8B5A9F', '#6A4C93']}
          style={styles.purpleSection}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.purpleSectionContent}>
            <Text style={styles.purpleSectionTitle}>Augebit - 2024</Text>
            <Text style={styles.purpleSectionSubtitle}>
              Transformando ideias em soluções tecnológicas inovadoras
            </Text>
            <View style={styles.purpleDivider} />
            <Text style={styles.purpleSectionDescription}>
              Nossa missão é proporcionar experiências digitais excepcionais que conectam pessoas e empresas através da tecnologia.
            </Text>
            <View style={styles.purpleFeatures}>
              <View style={styles.purpleFeatureItem}>
                <Ionicons name="rocket" size={24} color="white" />
                <Text style={styles.purpleFeatureText}>Inovação</Text>
              </View>
              <View style={styles.purpleFeatureItem}>
                <Ionicons name="shield-checkmark" size={24} color="white" />
                <Text style={styles.purpleFeatureText}>Segurança</Text>
              </View>
              <View style={styles.purpleFeatureItem}>
                <Ionicons name="people" size={24} color="white" />
                <Text style={styles.purpleFeatureText}>Suporte</Text>
              </View>
            </View>
          </View>
        </LinearGradient>
      </ScrollView>

      {/* Sidebar Modal */}
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
              <Text style={styles.menuSectionTitle}>ACCOUNT</Text>
              <FlatList
                data={accountItems}
                renderItem={renderMenuItem}
                keyExtractor={(item) => item.id.toString()}
                scrollEnabled={false}
              />
            </View>

            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
              <Ionicons name="log-out" size={20} color="#ff4757" style={styles.menuIcon} />
              <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    padding: 20,
    paddingTop: 60,
    alignItems: 'center',
    position: 'relative',
  },
  menuButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    backgroundColor: 'white',
    width: 50,
    height: 50,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  hamburgerLine: {
    width: 20,
    height: 2,
    backgroundColor: '#333',
    marginVertical: 2,
  },
  headerContent: {
    alignItems: 'center',
    marginTop: 20,
  },
  greeting: {
    fontSize: 18,
    color: 'white',
    marginTop: 10,
    opacity: 0.9,
  },
  scrollView: {
    flex: 1,
  },
  redBanner: {
    height: 250,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  
  // Estilos do Carrossel Integrado
  carouselContainer: {
    width: '100%',
    height: 200,
    position: 'relative',
  },
  carouselSlide: {
    height: 200,
    position: 'relative',
    marginRight: 0,
    borderRadius: 15,
    overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  carouselImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  carouselGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '50%',
    justifyContent: 'flex-end',
    padding: 15,
  },
  carouselTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 5,
  },
  carouselDescription: {
    fontSize: 14,
    color: '#E0E0E0',
    lineHeight: 18,
  },
  carouselIndicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 10,
    left: 0,
    right: 0,
  },
  carouselIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  carouselNavigationContainer: {
    position: 'absolute',
    top: '50%',
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    transform: [{ translateY: -15 }],
  },
  carouselNavButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  companySection: {
    backgroundColor: '#f8f9fa',
    padding: 30,
    alignItems: 'center',
  },
  companyLogo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    letterSpacing: 3,
    marginBottom: 10,
  },
  companyTitle: {
    color: '#667eea',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 20,
  },
  companyDescription: {
    textAlign: 'center',
    color: '#666',
    fontSize: 16,
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  resourcesSection: {
    paddingVertical: 40,
    backgroundColor: 'white',
  },
  sectionTitle: {
    textAlign: 'center',
    fontSize: 24,
    color: '#333',
    marginBottom: 30,
    fontWeight: '600',
  },
  resourcesList: {
    paddingVertical: 10,
  },
  resourceCard: {
    width: width * 0.8,
    height: 200,
    marginHorizontal: 10,
  },
  resourceGradient: {
    flex: 1,
    borderRadius: 15,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#22d3ee',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 10,
  },
  resourceIcon: {
    marginBottom: 15,
  },
  resourceTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  resourceDescription: {
    color: 'white',
    opacity: 0.9,
    textAlign: 'center',
    lineHeight: 20,
  },
  testimonialsSection: {
    padding: 40,
    alignItems: 'center',
  },
  testimonialsTitle: {
    fontSize: 24,
    color: 'white',
    marginBottom: 40,
    fontWeight: '600',
  },
  testimonialContainer: {
    width: '100%',
    maxWidth: 400,
  },
  testimonialCard: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    padding: 30,
    borderRadius: 15,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  testimonialAvatar: {
    width: 60,
    height: 60,
    backgroundColor: '#22d3ee',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  avatarText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  testimonialName: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  starsContainer: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  testimonialText: {
    color: 'white',
    opacity: 0.9,
    textAlign: 'center',
    fontStyle: 'italic',
    lineHeight: 22,
  },
  testimonialNav: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    marginTop: 20,
  },
  navButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  indicators: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    marginTop: 20,
  },
  indicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  activeIndicator: {
    backgroundColor: '#22d3ee',
  },
purpleSection: {
    paddingVertical: 50,
    paddingHorizontal: 30,
  },
  purpleSectionContent: {
    alignItems: 'center',
  },
  purpleSectionTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
    textAlign: 'center',
  },
  purpleSectionSubtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    marginBottom: 20,
    fontStyle: 'italic',
  },
  purpleDivider: {
    width: 60,
    height: 3,
    backgroundColor: 'white',
    marginBottom: 25,
    borderRadius: 2,
  },
  purpleSectionDescription: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.85)',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 35,
    paddingHorizontal: 10,
  },
  purpleFeatures: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    maxWidth: 300,
  },
  purpleFeatureItem: {
    alignItems: 'center',
    flex: 1,
  },
  purpleFeatureText: {
    fontSize: 14,
    color: 'white',
    marginTop: 8,
    fontWeight: '500',
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
  overlayTouch: {
    flex: 1,
  },
  sidebar: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: width * 0.8,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  sidebarContent: {
    flex: 1,
    paddingTop: 60,
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
    paddingVertical: 20,
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
    paddingVertical: 15,
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
    marginBottom: 40,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  logoutText: {
    fontSize: 16,
    color: '#ff4757',
    fontWeight: '500',
  },
});

export default AugebitApp;