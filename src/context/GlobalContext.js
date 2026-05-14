import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import axios from "axios";
import { createContext, useCallback, useState } from "react";
import Apis from "../Apis";
import { Alert } from "react-native";

export const ContextGlobal = createContext({});
const GlobalContext = ({ children }) => {
    const navigation = useNavigation();
    const [empresa, setEmpresa] = useState({});
    const [representante, setRepresentante] = useState({});

    const handleData = async () => {
        const empresaLocal = await AsyncStorage.getItem('@ge_pedido_online_empresa');
        const representanteNome = await AsyncStorage.getItem('@ge_pedido_online_representante_nome');
        const representanteId = await AsyncStorage.getItem('@ge_pedido_online_representante_id');
        setRepresentante({ "nome": representanteNome, "id": representanteId });
        setEmpresa(empresaLocal);
    }

    useFocusEffect(useCallback(() => {
        handleData();
    }, []));

    const logout = async () => {
        AsyncStorage.removeItem("@ge_pedido_online_empresa");
        AsyncStorage.removeItem("@ge_pedido_online_representante_id");
        AsyncStorage.removeItem("@ge_pedido_online_representante_nome");
        AsyncStorage.removeItem("@ge_pedido_online_token");
        navigation.reset({
            index: 1,
            routes: [{ name: "Login" }],
        });
    };


    // Função para verificar a validade do token
    const verificarToken = async () => {
        // const token = await "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE3Mjc0MDgwOTgsInVpZCI6MSwiaXNzIjoibG9jYWxob3N0IiwidGtlIjoiZmFjODE3M2MtODFlNC01YjQ5LTdmY2QtY2RkMzE4NzJkYjE2ZGU2ZGIzZjAiLCJuYW1lIjoiZ2VzdXBvcnRlbG9naWNvIiwiZW1haWwiOiJlbGlhc2RpY29udGlAZ21haWwuY29tIn0=.CaqKp2Vg1snByORv35b9ObS24ue3ZL+8WVVLBMEROR4=";
        const token = await AsyncStorage.getItem('@ge_pedido_online_token'); // Recupera o token válido
        
        if (!token) {
            Alert.alert('ATENÇÃO', 'O token de acesso não é valido ou expirou, faça login novamente para gerar um novo token.', [{ onPress: () => logout(), text: 'entendi' }]);
        }
        const requestOptions = { headers: { "Content-Type": "application/json", Accept: "application/json" } };
        try {
            const response = await axios.post(Apis.urlValidarToken, { token: token }, requestOptions);
            if (!response?.data) {
                Alert.alert('ATENÇÃO', 'O token de acesso não é valido ou expirou, faça login novamente para gerar um novo token.', [{ onPress: () => logout(), text: 'entendi' }]);
            }
        } catch (error) {
            console.error('Erro ao verificar o token:', error);
            Alert.alert('ATENÇÃO', 'O token de acesso não é valido ou expirou, faça login novamente para gerar um novo token.', [{ onPress: () => logout(), text: 'entendi' }]);
        }
    }

    return (
        <ContextGlobal.Provider value={{ empresa, representante, logout, verificarToken }}>
            {children}
        </ContextGlobal.Provider>
    )
}
export default GlobalContext;