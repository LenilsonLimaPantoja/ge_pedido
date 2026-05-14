import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useContext, useState } from 'react';
import Apis from '../../../Apis';
import { SafeAreaView, View, FlatList, StyleSheet, Text, TouchableOpacity } from 'react-native';
import Loading from '../../../componentes/Loading';
import { MaterialCommunityIcons, AntDesign } from "react-native-vector-icons";
import ModalAlert from '../../../componentes/ModalAlert';
import AreaModalBtnInput from '../../../componentes/AreaModalBtnInput';
import InputComponent from '../../../componentes/InputComponent';
import ButtonInput from '../../../componentes/ButtonInput';
import NotFound from '../../../componentes/NotFound';
import ButtonFab from '../../../componentes/ButtonFab';
import FabButtons from '../../../componentes/FabButtons';
import AppBarModalClose from '../../../componentes/AppBarModalClose';
import { axiosConfig } from '../../../axiosConfig';
import { ContextGlobal } from '../../../context/GlobalContext';
const Item = ({ item, index }) => (
    <TouchableOpacity activeOpacity={0.5} style={[styles.item, { borderTopWidth: index === 0 ? 1 : 0, borderColor: '#d9d9d5' }]}>
        <View style={styles.item.itemLeft}>
            <Text style={styles.item.itemLeft.idData}>#{item?.id} - {item?.updated_at}</Text>
            <Text style={styles.item.itemLeft.descricao}>{item?.descricao}</Text>
            <Text style={styles.item.itemLeft.estoque}>ESTOQUE: {item?.estoque}</Text>
            <Text style={styles.item.itemLeft.siglaUnidade}>{item?.sigla}</Text>
        </View>
        <Text style={styles.item.preco}>R$ {parseFloat(item?.preco).toFixed(2)}</Text>
    </TouchableOpacity>
);

const ListarProdutos = ({ navigation }) => {
    const { verificarToken } = useContext(ContextGlobal);
    const [produtos, setProdutos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [reload, setReload] = useState(false);
    const [openCloseModalFiltroProduto, setOpenCloseModalFiltroProduto] = useState(false);
    const [pesquisarProdutoFiltro, setPesquisarProdutoFiltro] = useState('');
    const [openCloseModalFabButtons, setOpenCloseModalFabButtons] = useState(false);

    useFocusEffect(useCallback(() => {
        verificarToken();
        handleDataProdutos();
    }, [reload]));

    const handleDataProdutos = async () => {
        setOpenCloseModalFiltroProduto(false);
        setLoading(true);
        try {
            const response = await axiosConfig.post(Apis.urlReadProdutos, { "tipo_produto": "0,4", "status": 0, pesquisa: pesquisarProdutoFiltro, registros: 30 });
            setProdutos(response?.data?.registros);
        } catch (error) {
            console.log(error);
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
            funcao: () => setOpenCloseModalFiltroProduto(true)
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
                        <Text style={styles.textAppBar}>PRODUTOS ({produtos?.length || 0})</Text>
                        <TouchableOpacity onPress={() => navigation.goBack()}>
                            <AntDesign name="close" style={{ fontSize: 22 }} />
                        </TouchableOpacity>
                    </View>

                    {produtos?.length > 0 ?
                        <FlatList data={produtos} showsVerticalScrollIndicator={false} renderItem={({ item, index }) => <Item item={item} index={index} />} keyExtractor={item => item?.id} />
                        :
                        <NotFound />
                    }
                    <ModalAlert ocultarInfoGe={true} funcao={() => setOpenCloseModalFiltroProduto(false)} openModal={openCloseModalFiltroProduto}>
                        <AppBarModalClose funcao={() => setOpenCloseModalFiltroProduto(false)} texto='FILTRAR PRODUTOS' />

                        <AreaModalBtnInput>
                            <InputComponent setValor={setPesquisarProdutoFiltro} valor={pesquisarProdutoFiltro} placeholder='Digite para fazer a busca' />
                        </AreaModalBtnInput>
                        <ButtonInput bgColor='#3b97ee' color='#fff' texto='aplicar filtro' funcao={handleDataProdutos}>
                            <MaterialCommunityIcons name='filter-outline' style={[styles.iconeModal, { color: '#fff' }]} />
                        </ButtonInput>
                    </ModalAlert>
                    {!openCloseModalFabButtons &&
                        <ButtonFab fixedRight={true} iconeName='menu' bgColor='#3b97ee' colorIcone='#fff' onPress={() => setOpenCloseModalFabButtons(true)} />
                    }
                    <FabButtons openClose={openCloseModalFabButtons} setOpenClose={setOpenCloseModalFabButtons} arrayFuncFab={arrayFuncFab} />
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
        fontSize: 20
    }
});

export default ListarProdutos;