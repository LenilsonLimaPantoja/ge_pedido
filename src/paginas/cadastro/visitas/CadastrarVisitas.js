import { Alert, Modal, StyleSheet, TouchableOpacity } from "react-native"
import ModalAlert from "../../../componentes/ModalAlert";
import Data from "../../../componentes/Data";
import { useContext, useState } from "react";
import SelectCliente from "../../select/SelectCliente";
import SelectMotivoVisita from "../../select/SelectMotivoVisita";
import * as Location from "expo-location";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Loading from "../../../componentes/Loading";
import Apis from "../../../Apis";
import ButtonInput from "../../../componentes/ButtonInput";
import { MaterialCommunityIcons } from 'react-native-vector-icons';
import AreaModalBtnInput from "../../../componentes/AreaModalBtnInput";
import AppBarModalClose from "../../../componentes/AppBarModalClose";
import { axiosConfig } from "../../../axiosConfig";
import { ContextGlobal } from "../../../context/GlobalContext";

const CadastrarVisitas = ({ openClose, setOpenClose, recarregar, setRecarregar }) => {
    const { verificarToken } = useContext(ContextGlobal);
    const data = new Date();
    const ano = data.getFullYear();
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const dia = String(data.getDate()).padStart(2, '0');
    const [dataVisita, setDataVisita] = useState(`${ano}-${mes}-${dia}`);
    const [openCloseModalClientes, setOpenCloseModalClientes] = useState(false);
    const [openCloseModalMotivoVisita, setOpenCloseModalMotivoVisita] = useState(false);
    const [cliente, setCliente] = useState({});
    const [motivoVisita, setMotivoVisita] = useState({});
    const [loadingVisita, setLoadingVisita] = useState(false);

    const handleRequestVisita = async () => {
        setLoadingVisita(true);
        verificarToken();
        let { status } = await Location.requestForegroundPermissionsAsync();
        let location = {};
        const representante_id = await AsyncStorage.getItem('@ge_pedido_online_representante_id');
        try {
            const responseLocation = await Location.getCurrentPositionAsync();
            location = {
                latitude: responseLocation?.coords?.latitude,
                longitude: responseLocation?.coords?.longitude,
            };
        } catch (error) {
            console.log(error);
            Alert.alert(
                'ATENÇÃO',
                `${error}`,
                [
                    {
                        onPress: () => setLoadingVisita(false),
                        text: 'entendi'
                    }
                ],
            );
            return
        }

        const dadosVisita = [
            {
                representante_id: representante_id,
                data_hora: dataVisita,
                obs: motivoVisita?.descricao,
                cliente_id: cliente?.id,
                latitude: location?.latitude,
                longitude: location?.longitude,
            }
        ];

        if (representante_id && cliente.id && motivoVisita.descricao && cliente) {
            try {
                const response = await axiosConfig.post(Apis.urlCreateVisitas, dadosVisita);
                setOpenClose(false);
                Alert.alert(
                    'SUCESSO',
                    response?.data.retorno.mensagem,
                    [
                        {
                            onPress: () => setLoadingVisita(false),
                            text: 'entendi'
                        }
                    ],
                );
                setCliente({});
                setMotivoVisita({});
                setRecarregar(!recarregar);
            } catch (error) {
                console.log(error.response?.data);
                setLoadingVisita(false);
            }

        } else {
            Alert.alert(
                'ATENÇÃO',
                'Todos os campos devem ser preenchidos',
                [
                    {
                        onPress: () => setLoadingVisita(false),
                        text: 'entendi'
                    }
                ],
            );
        }

    }

    const handleSelectCliente = () => {
        verificarToken();
        setOpenCloseModalClientes(true);
    }
    const handleSelectMotivo = () => {
        verificarToken();
        setOpenCloseModalMotivoVisita(true);
    }
    return (
        <>
            {loadingVisita ?
                <Modal visible={loadingVisita} onRequestClose={() => setLoadingVisita(false)}>
                    <Loading />
                </Modal>
                :
                <>
                    <ModalAlert ocultarInfoGe={true} funcao={() => setOpenClose(false)} openModal={openClose}>
                        <AppBarModalClose funcao={() => setOpenClose(false)} texto='CRIAR VISITA' />
                        <TouchableOpacity style={{ backgroundColor: '#3a97ed', height: 5, width: `100%` }} />
                        <AreaModalBtnInput>
                            <Data setValor={setDataVisita} valor={dataVisita} />
                            <ButtonInput borderBottomWidth={true} funcao={handleSelectCliente} texto={cliente?.nome || 'adicionar cliente'} />
                            <ButtonInput funcao={handleSelectMotivo} texto={motivoVisita?.descricao || 'selecionar o motivo'} />
                        </AreaModalBtnInput>
                        <ButtonInput bgColor='#4ac795' color='#fff' funcao={handleRequestVisita} texto='finalizar' >
                            <MaterialCommunityIcons name='content-save-outline' style={{ fontSize: 22, color: '#fff' }} />
                        </ButtonInput>
                    </ModalAlert>
                    <SelectCliente openClose={openCloseModalClientes} setOpenClose={setOpenCloseModalClientes} setCliente={setCliente} />
                    <SelectMotivoVisita openClose={openCloseModalMotivoVisita} setOpenClose={setOpenCloseModalMotivoVisita} setMotivoVisitaSelected={setMotivoVisita} />
                </>
            }
        </>
    )
}
export default CadastrarVisitas;
const styles = StyleSheet.create({
    container: {
        padding: 15,
        rowGap: 15,
        backgroundColor: '#fff',
        flex: 1,
    },
    appBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    textAppBar: {
        fontSize: 13,
        // fontWeight: 'bold'
    }
})