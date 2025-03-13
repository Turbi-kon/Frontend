import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
        padding: 20,
        alignItems: 'center',
    },
    title: {
        color: '#00ffff',
        fontSize: 24,
        textAlign: 'center',
        marginBottom: 10,
    },
    searchInput: {
        height: 40,  // Высота для поля ввода
        width: '80%',  // Ширина будет 80% от контейнера
        borderColor: '#00ff99',  // Цвет рамки
        borderWidth: 1,  // Толщина рамки
        borderRadius: 5,  // Скругленные углы
        backgroundColor: '#1e1e1e',  // Фон для поля ввода
        color: '#fff',  // Цвет текста в поле
        paddingHorizontal: 10,  // Внутренние отступы по горизонтали
        marginBottom: 20,  // Отступ снизу
    },
    serviceCard: {
        backgroundColor: '#1e1e1e',
        borderWidth: 1,
        borderColor: '#00ff99',
        borderRadius: 10,
        padding: 15,
        width: 250,
        alignItems: 'center',
        marginBottom: 20,
    },
    serviceImage: {
        width: '100%',
        height: 75,
        borderRadius: 5,  // Радиус скругления для изображения
    },
    serviceName: {
        color: '#00ff99',
        fontSize: 20,
        marginTop: 10,
    },
    description: {
        color: '#00ffff',
        textAlign: 'center',
        marginTop: 5,
    },
    button: {
        marginTop: 10,
        paddingVertical: 10,
        paddingHorizontal: 15,
        backgroundColor: '#00ff99',
        borderRadius: 5,
    },
    buttonText: {
        color: '#000',
        fontSize: 16,
    },
    input: {
        width: '80%',
        padding: 10,
        borderColor: '#00ff99',
        borderWidth: 1,
        borderRadius: 5,
        backgroundColor: '#1e1e1e',
        color: '#fff',
        marginBottom: 10,
    },
    // Стили для изображения карточки (ссылка на изображение)
    image: {
        width: '100%',
        height: 100,
        borderRadius: 10,  // Скругление для изображений
        marginBottom: 10,
    },
    card: {
        marginBottom: 15,
        backgroundColor: '#1e1e1e',
        borderRadius: 10,
        padding: 15,
        width: '100%',  // Ширина карточки
        textAlign: 'center',
        borderWidth: 1,
        borderColor: '#00ff99',
        elevation: 5,
    },
    price: {
        fontSize: 16,
        color: '#00ff99',  // Цвет для цены
    },
});

export default styles;