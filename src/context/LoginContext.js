import React, { createContext, useState } from "react";
import Apis from "../Apis";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { axiosConfig } from "../axiosConfig";
import { Alert } from "react-native";
export const ContextLogin = createContext({});
const LoginContext = ({ children }) => {
  const [cnpj, setCnpj] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [salvarDados, setSalvarDados] = useState(false);
  // const [cnpj, setCnpj] = useState("22714341000161");
  // const [email, setEmail] = useState("vendasas.carvaoreal@gmail.com");
  // const [senha, setSenha] = useState("1234");
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  const login = async () => {
    if (cnpj != "" && email != "" && senha != "") {
      setLoading(true);
      await AsyncStorage.clear();
      if (salvarDados) {
        await AsyncStorage.setItem("ge_pedido_online_cnpj", cnpj);
        await AsyncStorage.setItem("ge_pedido_online_email", email);
      }
      const body = {
        cnpj_empresa: cnpj,
        emailUsuario: email,
        senha: senha,
        id_dispositivo: '',
      };
      try {
        const response = await axiosConfig.post(Apis.urlLogin, body);
        
        AsyncStorage.setItem("@ge_pedido_online_empresa", JSON.stringify(response.data.retorno.empresa));
        AsyncStorage.setItem("@ge_pedido_online_logo_empresa", JSON.stringify(response.data.retorno.logo_empresa));
        AsyncStorage.setItem("@ge_pedido_online_representante_id", response.data.retorno.representante_id);
        AsyncStorage.setItem("@ge_pedido_online_representante_nome", response.data.retorno.representante_nome);
        AsyncStorage.setItem("@ge_pedido_online_token", response.data.retorno.token);
        setCnpj("");
        setEmail("");
        setSenha("");
        navigation.reset({
          index: 1,
          routes: [{ name: "RotasDrawer" }],
        });
        // Alert.alert('ATENÇÃO', response.data.retorno.mensagem, [{ onPress: () => setLoading(false), text: 'entendi' }]);
      } catch (error) {
        console.log(error.response);
        Alert.alert('ATENÇÃO', error.response.data.retorno.mensagem, [{ onPress: () => setLoading(false), text: 'entendi' }]);
      }

    } else {
      Alert.alert('ATENÇÃO', 'Todos os campos devem ser preenchidos', [{ onPress: () => setLoading(false), text: 'entendi' }]);
    }
  };
  return (
    <ContextLogin.Provider
      value={{
        cnpj,
        setCnpj,
        email,
        setEmail,
        senha,
        setSenha,
        login,
        loading,
        salvarDados,
        setSalvarDados
      }}
    >
      {children}
    </ContextLogin.Provider>
  );
};
export default LoginContext;
