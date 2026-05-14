import { Alert, Linking, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import Loading from "../../componentes/Loading";
import { useCallback, useContext } from "react";
import { ContextLogin } from "../../context/LoginContext";
import { MaterialCommunityIcons } from "react-native-vector-icons";
import ModalAlert from "../../componentes/ModalAlert";
import AreaModalBtnInput from "../../componentes/AreaModalBtnInput";
import InputComponent from "../../componentes/InputComponent";
import ButtonInput from "../../componentes/ButtonInput";
import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
const Login = () => {
    const {
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
    } = useContext(ContextLogin);

    useFocusEffect(useCallback(() => {
        const handleDados = async () => {
            const cnpjLocal = await AsyncStorage.getItem("ge_pedido_online_cnpj");
            const emailLocal = await AsyncStorage.getItem("ge_pedido_online_email");
            if (cnpjLocal) {
                setCnpj(cnpjLocal);
                setSalvarDados(true);
            }
            if (emailLocal) {
                setEmail(emailLocal);
                setSalvarDados(true);
            }
        }
        handleDados();
    }, []));
    if (loading) {
        return <Loading />
    }
    return (
        <View style={{ backgroundColor: '#fff', flex: 1 }}>
            <ModalAlert scroll={true} funcao={() => null} openModal={true}>
                <AreaModalBtnInput>
                    <InputComponent borderBottomWidth={true} placeholder="CNPJ da empresa" setValor={setCnpj} valor={cnpj} type="numeric" />
                    <InputComponent borderBottomWidth={true} placeholder="Email" setValor={setEmail} valor={email} type="email-address" />
                    <InputComponent seguro={true} placeholder="Senha" setValor={setSenha} valor={senha} />
                </AreaModalBtnInput>
                <ButtonInput bgColor='#4ac795' color='#fff' texto='entrar' funcao={login} >
                    <MaterialCommunityIcons name='chevron-right' style={{ fontSize: 22, color: '#fff' }} />
                </ButtonInput>
                <TouchableOpacity style={{ flexDirection: 'row', columnGap: 2, alignItems: 'center' }} onPress={() => setSalvarDados(!salvarDados)}>
                    <MaterialCommunityIcons name={!salvarDados ? "checkbox-blank-outline" : "checkbox-outline"} style={{ fontSize: 20, color: 'gray' }} />
                    <Text style={{ color: 'gray' }}>Lembrar Meus Dados</Text>
                </TouchableOpacity>
                <View style={{ flexDirection: 'row', alignItems: 'center', columnGap: 10 }}>
                    <Text style={{ borderBottomWidth: 1, flex: 1, borderBottomColor: '#d9d8d8' }}></Text>
                    <Text>ou</Text>
                    <Text style={{ borderBottomWidth: 1, flex: 1, borderBottomColor: '#d9d8d8' }}></Text>
                </View>
                <ButtonInput bgColor='#3b97ee' color='#fff' texto='Solicitar Ajuda' funcao={() => Linking.openURL("https://api.whatsapp.com/send?phone=5567991986596&text=Ajuda%20com%20o%20GE%20Pedido%20Mobile")} >
                    <MaterialCommunityIcons name='chevron-right' style={{ fontSize: 22, color: '#fff' }} />
                </ButtonInput>
            </ModalAlert>
        </View >
    )
}
export default Login;
const styles = StyleSheet.create({
    iconeModal: {
        fontSize: 20
    },
});