import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Para recuperar o token

export let axiosConfig = axios.create(); // Cria uma instância do Axios para evitar conflitos globais

// Configura o interceptor no Axios
axiosConfig.interceptors.request.use(
    async (config) => {
        const token = await AsyncStorage.getItem('@ge_pedido_online_token'); // Recupera o token válido
        config.headers['Authorization'] = `${token}`; // Anexa o token ao cabeçalho de todas as requisições
        config.headers['Content-Type'] = 'application/json';
        config.headers['Accept'] = 'application/json';
        return config; // Continua a requisição
    },
    (error) => {
        return Promise.reject(error);
    }
);