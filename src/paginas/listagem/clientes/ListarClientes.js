import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useContext, useState } from 'react';
import Apis from '../../../Apis';
import { SafeAreaView, View, FlatList, StyleSheet, Text, TouchableOpacity, Alert } from 'react-native';
import Loading from '../../../componentes/Loading';
import { MaterialCommunityIcons, AntDesign } from "react-native-vector-icons";
import CadastrarClientes from '../../cadastro/clientes/CadastrarClientes';
import ModalAlert from '../../../componentes/ModalAlert';
import AreaModalBtnInput from '../../../componentes/AreaModalBtnInput';
import InputComponent from '../../../componentes/InputComponent';
import ButtonInput from '../../../componentes/ButtonInput';
import NotFound from '../../../componentes/NotFound';
import SelectStatusCliente from '../../select/SelectStatusCliente';
import ButtonFab from '../../../componentes/ButtonFab';
import FabButtons from '../../../componentes/FabButtons';
import AppBarModalClose from '../../../componentes/AppBarModalClose';
import { axiosConfig } from '../../../axiosConfig';
import { ContextGlobal } from '../../../context/GlobalContext';

const Item = ({ item, index, handleClienteInfo }) => (
    <TouchableOpacity onPress={() => handleClienteInfo(item)} activeOpacity={0.5} style={[styles.item, { borderTopWidth: index === 0 ? 1 : 0, borderColor: '#d9d9d5' }]}>
        <View style={styles.item.itemLeft}>
            <Text style={styles.item.itemLeft.idData}>#{item?.id} - {item?.created_at?.substring(0, 10).split('-').reverse().join('/')}</Text>
            <Text style={styles.item.itemLeft.nome}>{item?.nome}</Text>
            <Text style={styles.item.itemLeft.email}>{item?.email}</Text>
            <Text style={styles.item.itemLeft.cnpj_cpf}>{item?.cnpj_cpf}</Text>
        </View>
    </TouchableOpacity>
);

const ListarClientes = ({ navigation }) => {
    const { verificarToken } = useContext(ContextGlobal);
    const [clientes, setClientes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [reload, setReload] = useState(false);
    const [openCloseModalCadastrarCliente, setOpenCloseModalCadastrarCliente] = useState(false);
    const [openCloseModalFiltroCliente, setOpenCloseModalFiltroCliente] = useState(false);
    const [statusClienteSelected, setStatusClienteSelected] = useState('-1');
    const [pesquisarClienteFiltro, setPesquisarClienteFiltro] = useState('');
    const [openCloseModalStatusCliente, setOpenCloseModalStatusCliente] = useState(false);
    const [openCloseModalFabButtons, setOpenCloseModalFabButtons] = useState(false);

    useFocusEffect(useCallback(() => {
        verificarToken();
        handleDataClientes();
    }, [reload]));

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
            setClientes(response.data.registros);
        } catch (error) {
            console.log(error.response.data);
        } finally {
            setLoading(false);
        }
    };

    const arrayFuncFab = [
        {
            iconeName: 'sync',
            funcao: () => setReload(!reload)
        },
        {
            iconeName: 'options-outline',
            funcao: () => setOpenCloseModalFiltroCliente(true)
        },
        {
            iconeName: 'add',
            funcao: () => setOpenCloseModalCadastrarCliente(true)
        },
        {
            iconeName: 'close',
            funcao: () => setOpenCloseModalFabButtons(false)
        }
    ];


    const handleClienteInfo = async (cliente) => {
        setLoading(true);

        try {
            const response = await axiosConfig.get(`${Apis.urlReadClientesInadimplentes}/${cliente?.id}`);
            if (!response.data.retorno.sucesso) {
                Alert.alert(
                    'SUCESSO',
                    `${cliente?.nome} está em dia com os pagamentos.`,
                    [{ text: 'entendi' }]
                );
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
        <SafeAreaView style={styles.container}>
            {!loading ?
                <>
                    <View style={styles.appBar}>
                        <Text style={styles.textAppBar}>CLIENTES ({clientes?.length})</Text>
                        <TouchableOpacity onPress={() => navigation.goBack()}>
                            <AntDesign name="close" style={{ fontSize: 22 }} />
                        </TouchableOpacity>
                    </View>

                    {clientes?.length > 0 ?
                        <FlatList data={clientes} showsVerticalScrollIndicator={false} renderItem={({ item, index }) => <Item item={item} index={index} handleClienteInfo={handleClienteInfo} />} keyExtractor={item => item?.id} />
                        :
                        <NotFound />
                    }
                    <CadastrarClientes setReloadCliente={setReload} reloadCliente={reload} setOpenClose={setOpenCloseModalCadastrarCliente} openModal={openCloseModalCadastrarCliente} />

                    <ModalAlert ocultarInfoGe={true} scroll={true} funcao={() => setOpenCloseModalFiltroCliente(false)} openModal={openCloseModalFiltroCliente}>
                        <AppBarModalClose funcao={() => setOpenCloseModalFiltroCliente(false)} texto='FILTRAR CLIENTE' />
                        <AreaModalBtnInput>
                            <InputComponent setValor={setPesquisarClienteFiltro} valor={pesquisarClienteFiltro} placeholder='Digite para fazer a busca' borderBottomWidth={true} />
                            <ButtonInput funcao={() => setOpenCloseModalStatusCliente(true)} texto={`mostrar ${statusClienteSelected == -1 ? 'todos' : statusClienteSelected == 0 ? 'ativos' : 'inativos'}`}>
                                <MaterialCommunityIcons name='chevron-right' style={styles.iconeModal} />
                            </ButtonInput>
                        </AreaModalBtnInput>
                        <ButtonInput bgColor='#3b97ee' color='#fff' texto='aplicar filtro' funcao={handleDataClientes}>
                            <MaterialCommunityIcons name='filter-outline' style={[styles.iconeModal, { color: '#fff' }]} />
                        </ButtonInput>
                    </ModalAlert>

                    {!openCloseModalFabButtons &&
                        <ButtonFab fixedRight={true} iconeName='menu' bgColor='#3b97ee' colorIcone='#fff' onPress={() => setOpenCloseModalFabButtons(true)} />
                    }
                    <FabButtons openClose={openCloseModalFabButtons} setOpenClose={setOpenCloseModalFabButtons} arrayFuncFab={arrayFuncFab} />

                    <SelectStatusCliente setStatusClienteSelected={setStatusClienteSelected} statusClienteSelected={statusClienteSelected} setOpenClose={setOpenCloseModalStatusCliente} openClose={openCloseModalStatusCliente} />
                </>
                :
                <Loading />
            }
        </SafeAreaView>
    );
};

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
        fontSize: 20
    }
});

export default ListarClientes;