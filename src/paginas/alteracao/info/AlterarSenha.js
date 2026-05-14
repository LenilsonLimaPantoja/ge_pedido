import ModalAlert from '../../../componentes/ModalAlert';
import AreaModalBtnInput from '../../../componentes/AreaModalBtnInput';
import ButtonInput from '../../../componentes/ButtonInput';
import InputComponent from '../../../componentes/InputComponent';
import { Alert, StyleSheet } from 'react-native';
import { useCallback, useContext, useState } from 'react';
import { ContextGlobal } from '../../../context/GlobalContext';
import Apis from '../../../Apis';
import Loading from '../../../componentes/Loading';
import { MaterialCommunityIcons } from 'react-native-vector-icons';
import AppBarModalClose from '../../../componentes/AppBarModalClose';
import { axiosConfig } from '../../../axiosConfig';
import { useFocusEffect } from '@react-navigation/native';
const AlterarSenha = ({ navigation }) => {
    const { representante, verificarToken } = useContext(ContextGlobal);
    const [senha, setSenha] = useState('');
    const [confirmarSenha, setConfirmarSenha] = useState('');
    const [loading, setLoading] = useState(false);
    useFocusEffect(useCallback(() => {
        verificarToken();
    }, []));
    const handleAlteSenha = async () => {
        if (senha === '' || senha.length < 4 || confirmarSenha === '' || confirmarSenha.length < 4 || senha != confirmarSenha) {
            if (senha != confirmarSenha) {
                Alert.alert('ATENÇÃO', 'Os campos senha e confirmar senha devem ser iguais', [{ onPress: () => null, text: 'entendi' }])
                return
            }
            Alert.alert('ATENÇÃO', 'Todos os campos devem ser preenchidos com pelo menos 4 digitos', [{ onPress: () => null, text: 'entendi' }])
            return
        }
        const body = { "senha": senha, "id": representante?.id };
        verificarToken();
        setLoading(true);
        try {
            const response = await axiosConfig.put(Apis.urlUpdateRepresentante, body);
            Alert.alert('SUCESSO', response.data.retorno.mensagem, [{ onPress: () => handleGoBack(), text: 'confirmar' }]);
            setSenha('');
            setConfirmarSenha('');
        } catch (error) {
            Alert.alert('ATENÇÃO', error.response.data.retorno.mensagem, [{ onPress: () => setLoading(false), text: 'entendi' }])
        }
    }
    const handleGoBack = () => {
        navigation.goBack();
        setLoading(false);
    }
    return (
        <>
            {loading ?
                <Loading />
                :
                <ModalAlert ocultarInfoGe={true} funcao={() => navigation.goBack()}>
                    <AppBarModalClose funcao={handleGoBack} texto='ALTERAR DADOS' />
                    <AreaModalBtnInput>
                        <ButtonInput borderBottomWidth={true} texto={representante?.nome} funcao={() => null} >
                            <MaterialCommunityIcons name='chevron-right' style={{ fontSize: 22 }} />
                        </ButtonInput>
                        <InputComponent borderBottomWidth={true} placeholder='Nova Senha' seguro={true} setValor={setSenha} valor={senha} />
                        <InputComponent placeholder='Confirmar Nova Senha' seguro={true} setValor={setConfirmarSenha} valor={confirmarSenha} />
                    </AreaModalBtnInput>
                    <ButtonInput bgColor='#4ac795' color='#fff' texto='finalizar' funcao={handleAlteSenha} >
                        <MaterialCommunityIcons name='content-save-outline' style={{ fontSize: 22, color: '#fff' }} />
                    </ButtonInput>
                </ModalAlert>
            }
        </>
    )
}
export default AlterarSenha;
const styles = StyleSheet.create({
    appBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    textAppBar: {
        fontSize: 13,
        // fontWeight: 'bold'
    },
});