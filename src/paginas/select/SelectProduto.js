import { useCallback, useContext, useState } from "react";
import ModalAlert from "../../componentes/ModalAlert";
import { useFocusEffect } from "@react-navigation/native";
import Apis from "../../Apis";
import { FlatList, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Loading from "../../componentes/Loading";
import { MaterialCommunityIcons, Ionicons } from 'react-native-vector-icons';
import InputComponent from "../../componentes/InputComponent";
import AreaModalBtnInput from "../../componentes/AreaModalBtnInput";
import ButtonInput from "../../componentes/ButtonInput";
import NotFound from "../../componentes/NotFound";
import AppBarModalClose from "../../componentes/AppBarModalClose";
import { axiosConfig } from "../../axiosConfig";
import { ContextGlobal } from "../../context/GlobalContext";
const Item = ({ item, handleClickProduto, index }) => (
    <TouchableOpacity activeOpacity={0.5} style={[styles.item, { borderTopWidth: index === 0 ? 1 : 0, borderColor: '#d9d9d5' }]} onPress={() => handleClickProduto(item)}>
        <View style={styles.item.itemLeft}>
            <Text style={styles.item.itemLeft.idData}>#{item?.id} - {item?.updated_at}</Text>
            <Text style={styles.item.itemLeft.descricao}>{item?.descricao}</Text>
            {item?.estoque && <Text style={styles.item.itemLeft.estoque}>ESTOQUE: {parseFloat(item?.estoque).toFixed(2)}</Text>}
            <Text style={styles.item.itemLeft.siglaUnidade}>{item?.sigla}</Text>
        </View>
        <Text style={styles.item.preco}>R$ {parseFloat(item?.preco).toFixed(2)}</Text>
    </TouchableOpacity>
);

const SelectProduto = ({ openClose, setOpenClose, setProduto, tabela_preco_id, setOpenCloseModalInformacaoProduto, setPreco, setPrecoCopy, dataParametros, setLoadingCadPedido }) => {
    const { verificarToken } = useContext(ContextGlobal);
    const [produtos, setProdutos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [openCloseModalFiltroProduto, setOpenCloseModalFiltroProdutos] = useState(false);
    const [pesquisarProdutoFiltro, setPesquisarProdutoFiltro] = useState('');

    useFocusEffect(useCallback(() => {
        handleDataProdutos();
    }, [tabela_preco_id]));

    const handleDataProdutos = async () => {
        setOpenCloseModalFiltroProdutos(false);
        setLoading(true);

        try {
            const response = await axiosConfig.post(Apis.urlReadProdutos, { "tipo_produto": "0,4", "status": 0, "pesquisa": pesquisarProdutoFiltro, "registros": 30 });
            setProdutos(response?.data.registros);

        } catch (error) {
            console.log(error.response?.data);
        } finally {
            setLoading(false);
        }
    };

    const handleClickProduto = async (item) => {
        verificarToken();
        let precoTabela = {};
        setLoadingCadPedido(true);
        try {
            const response = await axiosConfig.get(`${Apis.utlReadOneItemTabelaPreco}?codpro=${item.codigo}&tabela_preco_id=${tabela_preco_id}`);
            precoTabela = response?.data.retorno;
        } catch (error) {
            console.log(error.response?.data);
            precoTabela = {};
        } finally {
            if (precoTabela?.preco) {
                item.preco = precoTabela?.preco;
            }
            setPrecoCopy(parseFloat(item?.preco).toFixed(2));
            setPreco(parseFloat(item?.preco).toFixed(2));
            dataParametros();
            setProduto(item);
            setLoadingCadPedido(false);
            setOpenClose(false);
            setOpenCloseModalInformacaoProduto(true);
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
                                <TouchableOpacity onPress={() => setOpenCloseModalFiltroProdutos(true)}>
                                    <Ionicons name="options-outline" style={{ fontSize: 25 }} />
                                </TouchableOpacity>
                            </View>
                        </View>
                        {produtos?.length > 0 ?
                            <FlatList data={produtos} showsVerticalScrollIndicator={false} renderItem={({ item, index }) => <Item item={item} handleClickProduto={() => handleClickProduto(item)} index={index} />} keyExtractor={item => item?.id} />
                            :
                            <NotFound />
                        }
                    </SafeAreaView>
                    <ModalAlert ocultarInfoGe={true} funcao={() => setOpenCloseModalFiltroProdutos(false)} openModal={openCloseModalFiltroProduto}>
                        <AppBarModalClose funcao={() => setOpenCloseModalFiltroProdutos(false)} texto='FILTRAR PRODUTO' />

                        <AreaModalBtnInput>
                            <InputComponent setValor={setPesquisarProdutoFiltro} valor={pesquisarProdutoFiltro} placeholder='Digite para fazer a busca' />
                        </AreaModalBtnInput>
                        <ButtonInput bgColor='#3b97ee' color='#fff' funcao={handleDataProdutos} texto='aplicar filtro' borderBottomWidth={true}>
                            <MaterialCommunityIcons name='filter-outline' style={[styles.iconeModal, { color: '#fff' }]} />
                        </ButtonInput>
                    </ModalAlert>
                </>
                :
                <Loading />
            }
        </ModalAlert>
    )
}
export default SelectProduto;
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
            descricao: {
                fontWeight: '900',
                fontSize: 12,
                flex: 1,
                maxWidth: '85%',
            },
            estoque: {
                color: 'gray',
                fontSize: 10
            },
            siglaUnidade: {
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
        preco: {
            fontSize: 12,
            fontWeight: '900',
        }
    },
    iconeModal: {
        fontSize: 22
    }
});
