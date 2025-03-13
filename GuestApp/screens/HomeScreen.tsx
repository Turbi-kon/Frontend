import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, Image, TouchableOpacity, StyleSheet } from 'react-native';
import axios from 'axios';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import styles from './styles';

// Описываем структуру данных для сервиса
type Service = {
  id: number;
  name: string;
  price: string;
  image: string; // Обновили это поле на 'image' для корректной работы с ответом
  status: string;
};

// Определяем параметры навигации
type RootStackParamList = {
  Home: undefined;
  Service: { service: Service };
};

// Описываем тип пропсов, которые принимает экран
type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

const BASE_URL = 'http://192.168.1.183:8000'; // Ваш базовый URL сервера

const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const [services, setServices] = useState<Service[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/services/`);
      setServices(response.data);
    } catch (error) {
      console.error('Ошибка при загрузке данных:', error);
    }
  };

  // Фильтрация услуг по поисковому запросу
  const filteredServices = services.filter((service) =>
    service.name.toLowerCase().includes(search.toLowerCase())
  );

  const renderItem = ({ item }: { item: Service }) => (
    <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('Service', { service: item })}>
      <Image
        source={{ uri: `${BASE_URL}${item.image}` }} // Формируем полный URL для изображения
        style={styles.image}
        resizeMode="cover"
      />
      <Text style={styles.title}>{item.name}</Text>
      <Text style={styles.price}>{`Цена: ${item.price}₽`}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Поиск услуг..."
        value={search}
        onChangeText={setSearch}
      />
      <FlatList
        data={filteredServices}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
};


export default HomeScreen;
