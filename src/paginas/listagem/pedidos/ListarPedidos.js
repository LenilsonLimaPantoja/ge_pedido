import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useContext, useState } from 'react';
import Apis from '../../../Apis';
import { SafeAreaView, View, FlatList, StyleSheet, Text, TouchableOpacity, Alert } from 'react-native';
import Loading from '../../../componentes/Loading';
import { MaterialCommunityIcons, AntDesign, Foundation } from "react-native-vector-icons";
import { printComprovanteVenda, printToFileComprovanteVenda } from '../../../componentes/ComprovanteVenda';
import ModalAlert from '../../../componentes/ModalAlert';
import ButtonInput from '../../../componentes/ButtonInput';
import InputComponent from '../../../componentes/InputComponent';
import Data from '../../../componentes/Data';
import AreaModalBtnInput from '../../../componentes/AreaModalBtnInput';
import { ContextGlobal } from '../../../context/GlobalContext';
import NotFound from '../../../componentes/NotFound';
import CadastrarPedidos from '../../cadastro/pedido/CadastrarPedidos';
import { printRelatorioPedidos } from '../../../componentes/RelatorioPedidos';
import FabButtons from '../../../componentes/FabButtons';
import ButtonFab from '../../../componentes/ButtonFab';
import AppBarModalClose from '../../../componentes/AppBarModalClose';
import { axiosConfig } from '../../../axiosConfig';
import SelectFormaPagamento from '../../select/SelectFormaPagamento';
import Assinatura from '../../assinatura/Assinatura';
const Item = ({ item, handleClickPedido, index }) => (
    <TouchableOpacity activeOpacity={0.5} style={[styles.item, { borderTopWidth: index === 0 ? 1 : 0, borderColor: '#d9d9d5' }]} onPress={() => handleClickPedido(item)}>
        <View style={styles.item?.itemLeft}>
            <Text style={styles.item?.itemLeft.numData}>#{item?.numPedido} - {item?.data?.split('-').reverse().join('/')}</Text>
            <Text style={styles.item?.itemLeft.nome}>{item?.cliente?.nome}</Text>
            {item?.cliente?.email && <Text style={styles.item?.itemLeft.email}>{item?.cliente?.email}</Text>}
            <Text style={[styles.item?.itemLeft.situacao, { backgroundColor: item?.ident_operacao == 1 ? '#cbf8ec' : '#f3b543', color: item?.ident_operacao == 1 ? '#25d399' : '#fff' }]}>{item?.ident_operacao == 1 ? 'VENDA' : 'TROCA'}</Text>
        </View>
        <Text style={styles.item?.total}>R$ {parseFloat(parseFloat(item?.total) - parseFloat(item?.total_desconto)).toFixed(2)}</Text>
    </TouchableOpacity>
);

const ListarPedidos = ({ navigation }) => {
    const { verificarToken } = useContext(ContextGlobal);
    const [openCloseModalClickPedido, setOpenCloseModalClickPedido] = useState(false);
    const [openCloseModalAssinarComprovante, setOpenCloseModalAssinarComprovante] = useState(false);
    const [openCloseModalAlterarPedido, setOpenCloseModalAlterarPedido] = useState(false);
    const [openCloseModalFormaPagamento, setOpenCloseModalFormaPagamento] = useState(false);
    const [dadosAlterarPedido, setDadosAlterarPedido] = useState({});
    const [openCloseModalOpcoesAndFiltros, setOpenCloseModalOpcoesAndFiltros] = useState(false);
    const [openCloseModalCadastrarPedido, setOpenCloseModalCadastrarPedido] = useState(false);
    const [openCloseModalFabButtons, setOpenCloseModalFabButtons] = useState(false);
    const [pedidos, setPedidos] = useState([]);
    const [pedidoClicado, setPedidoClicado] = useState({});
    const [loading, setLoading] = useState(false);
    const [reload, setReload] = useState(false);
    const data = new Date();
    const ano = data.getFullYear();
    const dia = String(data.getDate()).padStart(2, '0');
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const [dataInicialFiltro, setDataInicialFiltro] = useState(`${ano}-${mes}-01`);
    const [dataFinalFiltro, setDataFinalFiltro] = useState(`${ano}-${mes}-${dia}`);
    const [pesquisarPedidoFiltro, setPesquisarPedidoFiltro] = useState('');

    const handleDataPedidos = async () => {
        setLoading(true);
        setOpenCloseModalOpcoesAndFiltros(false);
        try {
            const response = await axiosConfig.post(Apis.urlListarPedidos, {
                representante_id: await AsyncStorage.getItem('@ge_pedido_online_representante_id'),
                data_inicial: dataInicialFiltro,
                data_final: dataFinalFiltro,
                qt_registros: 30,
                texto: pesquisarPedidoFiltro
            });

            setPedidos(response?.data.registros);
        } catch (error) {
            console.log(error.response);
        } finally {
            setLoading(false);
        }
    };
    useFocusEffect(useCallback(() => {
        verificarToken();
        handleDataPedidos();
    }, [reload]));

    const handleClickPedido = (pedido) => {
        try {
            setOpenCloseModalClickPedido(true);
            setPedidoClicado(pedido);
        } catch (error) {
            Alert.alert('ATENÇÃO', 'Erro consultar pedido, tente novamente', [{ onPress: () => null, text: 'entendi' }])
        }
    }

    const handleGerarRelatorio = async () => {
        verificarToken();
        setLoading(true);
        setOpenCloseModalOpcoesAndFiltros(false);

        const body = {
            "data_inicial": dataInicialFiltro,
            "data_final": dataFinalFiltro,
            "representante_id": await AsyncStorage.getItem('@ge_pedido_online_representante_id'),
        }

        try {
            const response = await axiosConfig.post(Apis.urlRelatorioPedidoVenda, body);
            await printRelatorioPedidos(response?.data.dados);
        } catch (error) {
            console.log(JSON.stringify(error.response?.data));
            Alert.alert('ATENÇÃO', error.response?.data.retorno?.mensagem, [{ onPress: () => null, text: 'entendi' }]);
        } finally {
            setReload(!reload);
        }
    }

    const handleVisualizarComprovante = async () => {
        setLoading(true);
        setOpenCloseModalClickPedido(false);
        try {
            await printComprovanteVenda(pedidoClicado);
        } catch (error) {
            console.log(error);
            Alert.alert('ATENÇÃO', 'Erro ao gerar comprovante, tente novamente', [{ onPress: () => null, text: 'entendi' }])
        } finally {
            setLoading(false);
        }
    }

    const handleComprovanteAssinatura = async () => {
        setOpenCloseModalAssinarComprovante(true);
    }

    const handleEnviarComprovante = async (img) => {
        setLoading(true);
        setOpenCloseModalAssinarComprovante(false);
        setOpenCloseModalClickPedido(false);
        try {
            await printToFileComprovanteVenda(pedidoClicado, img);
        } catch (error) {
            console.log(error);
            Alert.alert('ATENÇÃO', 'Erro ao gerar comprovante, tente novamente', [{ onPress: () => null, text: 'entendi' }])
        } finally {
            setLoading(false);
        }
    }

    const handleOpenAlterarPedido = () => {
        setDadosAlterarPedido({
            id: pedidoClicado?.forma_pagto_id,
            descricao: pedidoClicado?.forma_pagto_descricao
        });
        setOpenCloseModalClickPedido(false);
        setOpenCloseModalAlterarPedido(true);
    }

    const handleRequestAlterarPedido = async () => {
        try {
            setLoading(true);
            setOpenCloseModalAlterarPedido(false);
            const dadosRequest = {
                forma_pagamento_id: dadosAlterarPedido?.id,
                id: pedidoClicado?.id
            }

            const response = await axiosConfig.put(Apis.urlUpdateFormaPgto, dadosRequest);
            Alert.alert('SUCESSO', response?.data.retorno.mensagem, [{ text: 'confirmar', onPress: () => setReload(!reload) }]);
        } catch (error) {
            Alert.alert('ATENÇÃO', error.response?.data.retorno.mensagem, [{ text: 'confirmar', onPress: () => setReload(!reload) }]);
        }

    }

    const arrayFuncFab = [
        {
            iconeName: 'sync',
            funcao: () => setReload(!reload)
        },
        {
            iconeName: 'options-outline',
            funcao: () => setOpenCloseModalOpcoesAndFiltros(true)
        },
        {
            iconeName: 'add',
            funcao: () => setOpenCloseModalCadastrarPedido(true)
        },
        {
            iconeName: 'close',
            funcao: () => setOpenCloseModalFabButtons(false)
        }
    ];

    return (
        <SafeAreaView style={styles.container}>
            {!loading ?
                <>
                    <View style={styles.appBar}>
                        <Text style={styles.textAppBar}>PEDIDOS ({pedidos?.length})</Text>
                        <TouchableOpacity onPress={() => navigation.goBack()}>
                            <AntDesign name="close" style={{ fontSize: 22 }} />
                        </TouchableOpacity>
                    </View>
                    {pedidos?.length > 0 ?
                        <FlatList data={pedidos} showsVerticalScrollIndicator={false} renderItem={({ item, index }) => <Item item={item} handleClickPedido={() => handleClickPedido(item)} index={index} />} keyExtractor={item => item?.id} />
                        :
                        <NotFound />
                    }
                    {/* modal gerar/enviar comprovante */}
                    <ModalAlert ocultarInfoGe={true} funcao={() => setOpenCloseModalClickPedido(false)} openModal={openCloseModalClickPedido}>
                        <AppBarModalClose funcao={() => setOpenCloseModalClickPedido(false)} texto='COMPROVANTE DE VENDA' />
                        <ButtonInput bgColor='#3b97ee' color='#fff' texto='visualizar comprovante' funcao={handleVisualizarComprovante}>
                            <MaterialCommunityIcons name='file-document-outline' style={[styles.iconeModal, { color: '#fff' }]} />
                        </ButtonInput>
                        <ButtonInput texto='enviar comprovante' bgColor='#4ac795' color='#fff' funcao={handleComprovanteAssinatura}>
                            <MaterialCommunityIcons name='send' style={[styles.iconeModal, { color: '#fff' }]} />
                        </ButtonInput>
                        {pedidoClicado?.ident_operacao == 1 &&
                            <>
                                <ButtonInput bgColor='orange' color='#fff' texto='alterar pedido' funcao={handleOpenAlterarPedido}>
                                    <Foundation name='page-edit' style={[styles.iconeModal, { color: '#fff' }]} />
                                </ButtonInput>
                            </>
                        }
                    </ModalAlert>

                    {/* modal assinar comprovante */}

                    <Assinatura openCloseModal={openCloseModalAssinarComprovante} setOpenCloseModal={setOpenCloseModalAssinarComprovante} handleEnviarComprovante={handleEnviarComprovante} />

                    {/* modal alterar pedido */}
                    <ModalAlert ocultarInfoGe={true} funcao={() => setOpenCloseModalAlterarPedido(false)} openModal={openCloseModalAlterarPedido}>
                        <AppBarModalClose funcao={() => setOpenCloseModalAlterarPedido(false)} texto='ALTERAÇÃO DE PEDIDO' />
                        <AreaModalBtnInput>
                            <ButtonInput texto={dadosAlterarPedido?.descricao} funcao={() => setOpenCloseModalFormaPagamento(true)} />
                        </AreaModalBtnInput>
                        <ButtonInput texto='enviar dados' bgColor='#4ac795' color='#fff' funcao={handleRequestAlterarPedido}>
                            <MaterialCommunityIcons name='content-save-outline' style={[styles.iconeModal, { color: '#fff' }]} />
                        </ButtonInput>
                    </ModalAlert>

                    <SelectFormaPagamento openClose={openCloseModalFormaPagamento} setOpenClose={() => setOpenCloseModalFormaPagamento(false)} setFormaPagamento={setDadosAlterarPedido} />

                    {/* modal opções e filtros */}
                    <ModalAlert ocultarInfoGe={true} scroll={true} funcao={() => setOpenCloseModalOpcoesAndFiltros(false)} openModal={openCloseModalOpcoesAndFiltros}>
                        <AppBarModalClose funcao={() => setOpenCloseModalOpcoesAndFiltros(false)} texto='FILTRAR PEDIDO' />
                        <AreaModalBtnInput>
                            <Data valor={dataInicialFiltro} setValor={setDataInicialFiltro} />
                            <Data valor={dataFinalFiltro} setValor={setDataFinalFiltro} />
                            <InputComponent setValor={setPesquisarPedidoFiltro} valor={pesquisarPedidoFiltro} placeholder='Digite para fazer a busca' />
                        </AreaModalBtnInput>
                        <ButtonInput bgColor='#3b97ee' color='#fff' texto='aplicar filtro' funcao={handleDataPedidos}>
                            <MaterialCommunityIcons name='filter-outline' style={[styles.iconeModal, { color: '#fff' }]} />
                        </ButtonInput>
                        <ButtonInput texto='gerar relatório' color='#fff' bgColor='#fd6c03' funcao={handleGerarRelatorio}>
                            <MaterialCommunityIcons name='file-document-outline' style={[styles.iconeModal, { color: '#fff' }]} />
                        </ButtonInput>
                    </ModalAlert>

                    {!openCloseModalFabButtons &&
                        <ButtonFab fixedRight={true} iconeName='menu' bgColor='#3b97ee' colorIcone='#fff' onPress={() => setOpenCloseModalFabButtons(true)} />
                    }
                    <FabButtons openClose={openCloseModalFabButtons} setOpenClose={setOpenCloseModalFabButtons} arrayFuncFab={arrayFuncFab} />

                    <CadastrarPedidos reloadPedido={reload} setReloadPedido={setReload} funcao={() => setOpenCloseModalCadastrarPedido(false)} openModal={openCloseModalCadastrarPedido} />
                </>
                : <Loading />
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
        alignItems: 'center',
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
            numData: {
                color: 'gray',
                marginBottom: 10,
                fontSize: 10
            },
            nome: {
                fontWeight: '900',
                fontSize: 12,
                flex: 1,
                maxWidth: '85%',
                textTransform: 'uppercase'
            },
            email: {
                color: 'gray',
                fontSize: 10
            },
            situacao: {
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
        total: {
            fontSize: 12,
            fontWeight: '900',
        }
    },
    iconeModal: {
        fontSize: 22,
    }
});

export default ListarPedidos;