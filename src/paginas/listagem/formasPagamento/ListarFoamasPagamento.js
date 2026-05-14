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
import ButtonFab from '../../../componentes/ButtonFab';
import FabButtons from '../../../componentes/FabButtons';
import AppBarModalClose from '../../../componentes/AppBarModalClose';
import { axiosConfig } from '../../../axiosConfig';
import { ContextGlobal } from '../../../context/GlobalContext';
const Item = ({ item, index }) => (
    <TouchableOpacity activeOpacity={0.5} style={[styles.item, { borderTopWidth: index === 0 ? 1 : 0, borderColor: '#d9d9d5' }]}>
        <View style={styles.item.itemLeft}>
            <Text style={styles.item.itemLeft.idData}>#{item?.id} - {item?.created_at?.substring(0, 10).split('-').reverse().join('/')}</Text>
            <Text style={styles.item.itemLeft.descricao}>{item?.descricao}</Text>
            {item?.parcelamento == 1 && <Text style={styles.item.itemLeft.parcelamento}>PARCELAMENTO</Text>}
        </View>
    </TouchableOpacity>
);

const ListarFoamasPagamento = ({ navigation }) => {
    const { verificarToken } = useContext(ContextGlobal);
    const [formasPgto, setFormasPgto] = useState([]);
    const [loading, setLoading] = useState(false);
    const [reload, setReload] = useState(false);
    const [openCloseModalFiltroFormaPagamento, setOpenCloseModalFiltroFormaPagamento] = useState(false);
    const [pesquisarFormaPagamentoFiltro, setPesquisarFormaPagamentoFiltro] = useState('');
    const [openCloseModalFabButtons, setOpenCloseModalFabButtons] = useState(false);

    useFocusEffect(useCallback(() => {
        verificarToken();
        handleDataFormasPgto();
    }, [reload]));

    const handleDataFormasPgto = async () => {
        setOpenCloseModalFiltroFormaPagamento(false);
        setLoading(true);
        try {
            const response = await axiosConfig.post(Apis.urlReadFormasPgto, {})
            setFormasPgto(response.data.registros);
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
            funcao: () => setOpenCloseModalFiltroFormaPagamento(true)
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
                        <Text style={styles.textAppBar}>FORMA PGTO ({formasPgto?.length})</Text>
                        <TouchableOpacity onPress={() => navigation.goBack()}>
                            <AntDesign name="close" style={{ fontSize: 22 }} />
                        </TouchableOpacity>
                    </View>

                    <FlatList data={formasPgto} showsVerticalScrollIndicator={false} renderItem={({ item, index }) => <Item item={item} index={index} />} keyExtractor={item => item?.id} />

                    <ModalAlert ocultarInfoGe={true} scroll={true} funcao={() => setOpenCloseModalFiltroFormaPagamento(false)} openModal={openCloseModalFiltroFormaPagamento}>
                        <AppBarModalClose funcao={() => setOpenCloseModalFiltroFormaPagamento(false)} texto='FILTRAR FORMAS DE PGTO' />
                        <AreaModalBtnInput>
                            <InputComponent setValor={setPesquisarFormaPagamentoFiltro} valor={pesquisarFormaPagamentoFiltro} placeholder='Digite para fazer a busca' />
                        </AreaModalBtnInput>
                        <ButtonInput bgColor='#3b97ee' color='#fff' texto='aplicar filtro' funcao={handleDataFormasPgto}>
                            <MaterialCommunityIcons name='filter-outline' style={[{ fontSize: 22, color: '#fff' }]} />
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
            parcelamento: {
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
});

export default ListarFoamasPagamento;