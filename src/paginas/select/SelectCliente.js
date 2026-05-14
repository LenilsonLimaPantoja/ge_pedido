import { useCallback, useContext, useState } from "react";
import ModalAlert from "../../componentes/ModalAlert";
import { useFocusEffect } from "@react-navigation/native";
import Apis from "../../Apis";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert, FlatList, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Loading from "../../componentes/Loading";
import { MaterialCommunityIcons, Ionicons } from 'react-native-vector-icons';
import InputComponent from "../../componentes/InputComponent";
import AreaModalBtnInput from "../../componentes/AreaModalBtnInput";
import ButtonInput from "../../componentes/ButtonInput";
import SelectStatusCliente from "./SelectStatusCliente";
import NotFound from "../../componentes/NotFound";
import AppBarModalClose from "../../componentes/AppBarModalClose";
import { axiosConfig } from "../../axiosConfig";
import { ContextGlobal } from "../../context/GlobalContext";
const Item = ({ item, handleClickCliente, index }) => (
    <TouchableOpacity activeOpacity={0.5} style={[styles.item, { borderTopWidth: index === 0 ? 1 : 0, borderColor: '#d9d9d5' }]} onPress={() => handleClickCliente(item)}>
        <View style={styles.item.itemLeft}>
            <Text style={styles.item.itemLeft.idData}>#{item?.id} - {item?.created_at?.substring(0, 10).split('-').reverse().join('/')}</Text>
            <Text style={styles.item.itemLeft.nome}>{item?.nome}</Text>
            <Text style={styles.item.itemLeft.email}>{item?.email}</Text>
            <Text style={styles.item.itemLeft.cnpj_cpf}>{item?.cnpj_cpf}</Text>
        </View>
    </TouchableOpacity>
);

const SelectCliente = ({ openClose, setOpenClose, setCliente }) => {
    const { verificarToken } = useContext(ContextGlobal);
    const [clientes, setClientes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [openCloseModalFiltroCliente, setOpenCloseModalFiltroCliente] = useState(false);
    const [pesquisarClienteFiltro, setPesquisarClienteFiltro] = useState('');
    const [statusClienteSelected, setStatusClienteSelected] = useState('-1');
    const [openCloseModalStatusCliente, setOpenCloseModalStatusCliente] = useState(false);

    useFocusEffect(useCallback(() => {
        handleDataClientes();
    }, []));
    const handleDataClientes = async () => {
        setOpenCloseModalFiltroCliente(false);
        setLoading(true);
        const body = JSON.stringify({
            representante_id: await AsyncStorage.getItem(
                "@ge_pedido_online_representante_id"
            ),
            pesquisa: pesquisarClienteFiltro,
            regPag: 30,
            status: statusClienteSelected, //-1 = TODOS, 0 = ATIVOS e 1 = INATIVOS
        });
        try {
            const response = await axiosConfig.post(Apis.urlReadClientes, body);
            setClientes(response?.data.registros);
        } catch (error) {
            console.log(error.response?.data);
        } finally {
            setLoading(false);
        }
    };

    const handleClickCliente = async (item) => {
        verificarToken();

        setLoading(true);

        try {
            const response = await axiosConfig.get(`${Apis.urlReadClientesInadimplentes}/${item?.id}`);
            if (!response.data.retorno.sucesso) {
                setCliente(item);
                setOpenClose(false);
                return
            }

            const mensagem = response.data.registros
                ?.map((item, index) => {
                    return `#${index + 1}\n     Doc: ${item?.doc}\n     Data Doc: ${String(item?.data_doc).split('-').reverse().join('/')}\n     Vencimento: ${String(item?.vencimento).split('-').reverse().join('/')}\n     Valor:R$ ${item?.valor}`;
                })
                .join('\n\n');

            Alert.alert(
                'INADIMPLÊNCIAS',
                mensagem,
                [{ text: 'Entendi' }]
            );

        } catch (error) {
            Alert.alert(
                'Erro',
                error?.response?.data?.mensagem || 'Não foi possível verificar as informações do cliente. Por favor, tente novamente.',
                [{ text: 'entendi' }]
            );
            console.log(error?.response?.data);
        } finally {
            setLoading(false);
        }

    }
    return (
        <ModalAlert funcao={() => setOpenClose(false)} openModal={openClose} flex={1} ocultarInfoGe={true} bgColor='#fff'>
            {!loading ?
                <>
                    <SafeAreaView style={styles.container}>
                        <View style={{ rowGap: 15 }}>
                            <View style={styles.appBar}>
                                <TouchableOpacity onPress={() => setOpenClose(false)}>
                                    <MaterialCommunityIcons name="close" style={{ fontSize: 25 }} />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => setOpenCloseModalFiltroCliente(true)}>
                                    <Ionicons name="options-outline" style={{ fontSize: 25 }} />
                                </TouchableOpacity>
                            </View>
                        </View>
                        {clientes?.length > 0 ?
                            <FlatList data={clientes} showsVerticalScrollIndicator={false} renderItem={({ item, index }) => <Item item={item} handleClickCliente={() => handleClickCliente(item)} index={index} />} keyExtractor={item => item?.id} />
                            :
                            <NotFound />
                        }
                    </SafeAreaView>
                    <ModalAlert ocultarInfoGe={true} funcao={() => setOpenCloseModalFiltroCliente(false)} openModal={openCloseModalFiltroCliente}>
                        <AppBarModalClose funcao={() => setOpenCloseModalFiltroCliente(false)} texto='FILTRAR CLIENTE' />

                        <AreaModalBtnInput>
                            <InputComponent setValor={setPesquisarClienteFiltro} valor={pesquisarClienteFiltro} placeholder='Digite para fazer a busca' borderBottomWidth={true} />
                            <ButtonInput funcao={() => setOpenCloseModalStatusCliente(true)} texto={`mostrar ${statusClienteSelected == -1 ? 'todos' : statusClienteSelected == 0 ? 'ativos' : 'inativos'}`}>
                                <MaterialCommunityIcons name='chevron-right' style={styles.iconeModal} />
                            </ButtonInput>
                        </AreaModalBtnInput>
                        <ButtonInput bgColor='#3b97ee' color='#fff' funcao={handleDataClientes} texto='aplicar filtro' borderBottomWidth={true}>
                            <MaterialCommunityIcons name='filter-outline' style={[styles.iconeModal, { color: '#fff' }]} />
                        </ButtonInput>
                    </ModalAlert>
                    <SelectStatusCliente setStatusClienteSelected={setStatusClienteSelected} statusClienteSelected={statusClienteSelected} setOpenClose={setOpenCloseModalStatusCliente} openClose={openCloseModalStatusCliente} />
                </>
                :
                <Loading />
            }
        </ModalAlert>
    )
}
export default SelectCliente;
const styles = StyleSheet.create({
    container: {
        rowGap: 15,
        flex: 1,
        height: '100%'
    },
    appBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    textAppBar: {
        fontSize: 13,
        // fontWeight: 'bold'
    },
    item: {
        paddingTop: 15,
        paddingBottom: 15,
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderColor: '#dbd7d7',
        itemLeft: {
            flex: 1,
            idData: {
                color: 'gray',
                marginBottom: 10,
                fontSize: 10
            },
            nome: {
                fontWeight: '900',
                fontSize: 12,
                flex: 1,
                maxWidth: '85%',
            },
            email: {
                color: 'gray',
                fontSize: 10
            },
            cnpj_cpf: {
                color: '#25d399',
                backgroundColor: '#cbf8ec',
                width: 100,
                textAlign: 'center',
                padding: 3,
                borderRadius: 5,
                marginTop: 10,
                fontSize: 10
            },
        },
    },
    iconeModal: {
        fontSize: 22
    }
});
