import { Alert, Image, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { MaterialCommunityIcons, Ionicons, Foundation } from 'react-native-vector-icons';
import icon from '../../../assets/icon.png';
import app from '../../../app.json';
import AreaModalBtnInput from "../../componentes/AreaModalBtnInput";
import ButtonInput from "../../componentes/ButtonInput";
import CadastrarClientes from "../cadastro/clientes/CadastrarClientes";
import { useCallback, useContext, useState } from "react";
import CadastrarVisitas from "../cadastro/visitas/CadastrarVisitas";
import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Apis from "../../Apis";
import Loading from "../../componentes/Loading";
import CadastrarPedidos from "../cadastro/pedido/CadastrarPedidos";
import ModalAlert from "../../componentes/ModalAlert";
import Data from "../../componentes/Data";
import InputComponent from "../../componentes/InputComponent";
import { printComprovanteVenda, printToFileComprovanteVenda } from "../../componentes/ComprovanteVenda";
import { ContextGlobal } from "../../context/GlobalContext";
import pedido from '../../../assets/pedido.webp';
import produto from '../../../assets/produto.webp';
import cliente from '../../../assets/cliente.webp';
import visita from '../../../assets/visita.webp';
import AppBarModalClose from "../../componentes/AppBarModalClose";
import { axiosConfig } from "../../axiosConfig";
import Assinatura from "../assinatura/Assinatura";

let opcoesListar = [
    { titulo: "Listar Pedidos", img: pedido, rota: 'ListarPedidos' },
    { titulo: "Listar Produtos", img: produto, rota: 'ListarProdutos' },
    { titulo: "Listar Visitas", img: visita, rota: 'ListarVisitas' },
    { titulo: "Listar Clientes", img: cliente, rota: 'ListarClientes' }
];
const Home = ({ navigation }) => {
    const { verificarToken } = useContext(ContextGlobal);
    const [openCloseModalCadastrarCliente, setOpenCloseModalCadastrarCliente] = useState(false);
    const [openCloseModalAssinarComprovante, setOpenCloseModalAssinarComprovante] = useState(false);
    const [openCloseModalCadastrarVisitas, setOpenCloseModalCadastrarVisitas] = useState(false);
    const [openCloseModalCadastrarPedidos, setOpenCloseModalCadastrarPedidos] = useState(false);
    const [openCloseModalFiltroPedidos, setOpenCloseModalFiltroPedidos] = useState(false);
    const [openCloseModalClickPedido, setOpenCloseModalClickPedido] = useState(false);
    const data = new Date();
    const dia = String(data.getDate()).padStart(2, '0');
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const ano = data.getFullYear();
    const [dataInicialFiltro, setDataInicialFiltro] = useState(`${ano}-${mes}-01`);
    const [dataFinalFiltro, setDataFinalFiltro] = useState(`${ano}-${mes}-${dia}`);
    const [loading, setLoading] = useState(true);
    const [reload, setReload] = useState(false);
    const [pedidos, setPedidos] = useState([]);
    const [pesquisarPedidoFiltro, setPesquisarPedidoFiltro] = useState('');
    const [pedidoClicado, setPedidoClicado] = useState({});

    const handleDataPedidos = async () => {
        setLoading(true);
        setOpenCloseModalFiltroPedidos(false);
        try {
            const response = await axiosConfig.post(Apis.urlListarPedidos, {
                representante_id: await AsyncStorage.getItem('@ge_pedido_online_representante_id'),
                data_inicial: dataInicialFiltro,
                data_final: dataFinalFiltro,
                qt_registros: 10,
                texto: pesquisarPedidoFiltro,
            });
            setPedidos(response?.data?.registros);
        } catch (error) {
            console.log(error.response?.data);
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(useCallback(() => {
        verificarToken();
        handleDataPedidos();
    }, [reload]));

    const handleClickPedido = async (pedido) => {
        try {
            setOpenCloseModalClickPedido(true);
            setPedidoClicado(pedido);
        } catch (error) {
            Alert.alert('ATENÇÃO', 'Erro consultar pedido, tente novamente', [{ onPress: () => null, text: 'entendi' }])
        }
    }

    const handleVisualizarComprovante = async () => {
        setLoading(true);
        setOpenCloseModalClickPedido(false);
        try {
            await printComprovanteVenda(pedidoClicado);
        } catch (error) {
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
            Alert.alert('ATENÇÃO', 'Erro ao gerar comprovante, tente novamente', [{ onPress: () => null, text: 'entendi' }])
        } finally {
            setLoading(false);
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            {!loading ?
                <>
                    <View style={{ backgroundColor: '#fff', rowGap: 10 }}>
                        < View style={styles.topo}>
                            <Image source={icon} style={styles.img} />
                            <View style={styles.areaTopo}>
                                <Text style={styles.tituloTopo}>ge_pedido</Text>
                                <Text style={styles.textTopo}>Versão: {app.expo.version}</Text>
                                <Text style={styles.textTopo}>www.gepedido.com.br</Text>
                            </View>
                        </View>
                        <View style={styles.appBarMenu}>
                            <TouchableOpacity onPress={() => navigation.openDrawer()}>
                                <MaterialCommunityIcons style={{ fontSize: 25 }} name="menu" />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => setOpenCloseModalFiltroPedidos(true)}>
                                <Ionicons name="options-outline" style={{ fontSize: 25 }} />
                            </TouchableOpacity>
                        </View>
                    </View>
                    <ScrollView contentContainerStyle={styles.scrollPedidos}>
                        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                            <View style={styles.containerOpcoesLista}>
                                {opcoesListar?.map((item, index) => (
                                    <TouchableOpacity onPress={() => navigation.navigate(item?.rota)} key={index} style={styles.btnOpcoesLista}>
                                        <Image source={item?.img} style={styles.imgOpcoesLista} />
                                        <Text style={styles.textOpcoesLista}>{item?.titulo}</Text>
                                    </TouchableOpacity>
                                ))
                                }
                            </View>
                        </ScrollView>
                        <AreaModalBtnInput>
                            <ButtonInput funcao={() => setOpenCloseModalCadastrarPedidos(true)} borderBottomWidth={true} texto='adicionar pedido'>
                                <MaterialCommunityIcons style={{ fontSize: 20 }} name="plus" />
                            </ButtonInput>
                            <ButtonInput funcao={() => setOpenCloseModalCadastrarCliente(true)} borderBottomWidth={true} texto='adicionar cliente'>
                                <MaterialCommunityIcons style={{ fontSize: 20 }} name="plus" />
                            </ButtonInput>
                            <ButtonInput funcao={() => setOpenCloseModalCadastrarVisitas(true)} texto='adicionar visita'>
                                <MaterialCommunityIcons style={{ fontSize: 20 }} name="plus" />
                            </ButtonInput>
                        </AreaModalBtnInput>
                        {pedidos?.length > 0 ?
                            <>
                                <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }} onPress={() => setReload(!reload)}>
                                    <Text style={{ fontSize: 13 }}>Histórico de Pedidos</Text>
                                    <MaterialCommunityIcons style={{ fontSize: 20, }} name="history" />
                                </TouchableOpacity>
                                {pedidos?.map((item, index) => (
                                    <TouchableOpacity key={index} activeOpacity={0.5} onPress={() => handleClickPedido(item)} style={[styles.item, { borderTopWidth: index === 0 ? 1 : 0, borderColor: '#d9d9d5' }]}>
                                        <View style={styles.item?.itemLeft}>
                                            <Text style={styles.item?.itemLeft.numData}>#{item?.numPedido} - {item?.data?.split('-').reverse().join('/')}</Text>
                                            <Text style={styles.item?.itemLeft.nome}>{item?.cliente?.nome}</Text>
                                            {item?.cliente?.email && <Text style={styles.item?.itemLeft.email}>{item?.cliente?.email}</Text>}
                                            <Text style={[styles.item?.itemLeft.situacao, { backgroundColor: item?.ident_operacao == 1 ? '#cbf8ec' : '#f3b543', color: item?.ident_operacao == 1 ? '#25d399' : '#fff' }]}>{item?.ident_operacao == 1 ? 'VENDA' : 'TROCA'}</Text>
                                        </View>
                                        <Text style={styles.item?.total}>R$ {parseFloat(parseFloat(item?.total) - parseFloat(item?.total_desconto)).toFixed(2)}</Text>
                                    </TouchableOpacity>
                                ))}
                            </>
                            :
                            <View style={styles.containerSemDados}>
                                <Text style={styles.textSemDados}>seu histórico de pedidos aparecerá aqui, no momento nenhum registro foi localizado.</Text>
                            </View>
                        }
                    </ScrollView>
                    <CadastrarClientes setOpenClose={setOpenCloseModalCadastrarCliente} openModal={openCloseModalCadastrarCliente} setReloadCliente={setReload} reloadCliente={reload} />
                    <CadastrarVisitas setOpenClose={() => setOpenCloseModalCadastrarVisitas(false)} openClose={openCloseModalCadastrarVisitas} />
                    <CadastrarPedidos reloadPedido={reload} setReloadPedido={setReload} funcao={() => setOpenCloseModalCadastrarPedidos(false)} openModal={openCloseModalCadastrarPedidos} />

                    <ModalAlert ocultarInfoGe={true} funcao={() => setOpenCloseModalFiltroPedidos(false)} openModal={openCloseModalFiltroPedidos} scroll={true}>
                        <AppBarModalClose funcao={() => setOpenCloseModalFiltroPedidos(false)} texto='FILTRAR DADOS' />
                        <AreaModalBtnInput>
                            <Data setValor={setDataInicialFiltro} valor={dataInicialFiltro} />
                            <Data setValor={setDataFinalFiltro} valor={dataFinalFiltro} />
                            <InputComponent placeholder='Digite para fazer a busca' setValor={setPesquisarPedidoFiltro} valor={pesquisarPedidoFiltro} />
                        </AreaModalBtnInput>
                        <ButtonInput bgColor='#3b97ee' color='#fff' texto='aplicar filtro' funcao={() => setReload(!reload)}>
                            <MaterialCommunityIcons name='filter-outline' style={[styles.iconeModal, { color: '#fff' }]} />
                        </ButtonInput>
                    </ModalAlert>

                    {/* modal gerar/enviar comprovante */}
                    <ModalAlert ocultarInfoGe={true} funcao={() => setOpenCloseModalClickPedido(false)} openModal={openCloseModalClickPedido}>
                        <AppBarModalClose funcao={() => setOpenCloseModalClickPedido(false)} texto='COMPROVANTE DE VENDA' />
                        <ButtonInput bgColor='#3b97ee' color='#fff' texto='visualizar comprovante' funcao={handleVisualizarComprovante}>
                            <MaterialCommunityIcons name='file-document-outline' style={[styles.iconeModal, { color: '#fff' }]} />
                        </ButtonInput>
                        <ButtonInput texto='enviar comprovante' bgColor='#4ac795' color='#fff' funcao={handleComprovanteAssinatura}>
                            <MaterialCommunityIcons name='send' style={[styles.iconeModal, { color: '#fff' }]} />
                        </ButtonInput>
                    </ModalAlert>
                    <Assinatura openCloseModal={openCloseModalAssinarComprovante} setOpenCloseModal={setOpenCloseModalAssinarComprovante} handleEnviarComprovante={handleEnviarComprovante} />
                </>
                :
                <Loading />
            }
        </SafeAreaView>
    )
}
export default Home;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        position: 'relative',
        padding: 10,
        rowGap: 10,
        backgroundColor: '#fff'
    },
    appBarMenu: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 10,
        borderWidth: 1,
        borderColor: '#d9d9d5',
        alignItems: 'center'
    },
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
        fontWeight: 'bold'
    },
    scrollPedidos: {
        borderWidth: 1,
        borderColor: '#d9d9d5',
        padding: 10,
        rowGap: 15,
        backgroundColor: '#fff',
    },
    topo: {
        flexDirection: 'row',
        alignItems: 'center',
        columnGap: 10,
        borderBottomWidth: 1,
        borderColor: '#d9d8d8',
        paddingBottom: 20,
        paddingTop: 5
    },
    img: {
        width: 40,
        height: 40
    },
    areaTopo: {
        rowGap: 3
    },
    tituloTopo: {
        fontWeight: 'bold'
    },
    textTopo: {
        fontSize: 12,
        color: 'gray'
    },
    item: {
        paddingTop: 15,
        paddingBottom: 15,
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderColor: '#d9d9d5',
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
    containerOpcoesLista: {
        flexDirection: 'row',
        columnGap: 10
    },
    btnOpcoesLista: {
        padding: 10,
        width: 130,
        borderWidth: 1,
        borderColor: '#d9d9d5',
        backgroundColor: '#f7f7f7',
        justifyContent: 'center',
        alignItems: 'center',
        rowGap: 10
    },
    imgOpcoesLista: {
        width: 25,
        height: 25
    },
    textOpcoesLista: {
        textAlign: 'center',
        fontSize: 13
    },
    containerSemDados: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        borderTopWidth: 1,
        borderColor: '#d9d9d5'
    },
    textSemDados: {
        color: 'gray',
        fontSize: 12,
        maxWidth: 230,
        textAlign: 'center'
    },
    iconeModal: {
        fontSize: 22,
    }
})