import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import styles from './styles';

type Service = {
    id: number;
    name: string;
    price: string;
    image: string;
    status: string;
};

type RootStackParamList = {
    Home: undefined;
    Service: { service: Service };
};

// Вместо Props, типизируем пропсы напрямую
const ServiceScreen: React.FC<NativeStackScreenProps<RootStackParamList, 'Service'>> = ({ route }) => {
    const { service } = route.params;

    const BASE_URL = 'http://192.168.1.183:8000'; // Можно вынести это в конфиг, если хотите

    return (
        <View style={styles.container}>
            <Image source={{ uri: `${BASE_URL}${service.image}` }} style={styles.image} />
            <Text style={styles.title}>{service.name}</Text>
            <Text style={styles.price}>{`Цена: ${service.price}₽`}</Text>
            <Text style={styles.description}>
                {service.status === 'active' ? 'Услуга доступна' : 'Услуга недоступна'}
            </Text>
        </View>
    );
};

export default ServiceScreen;
