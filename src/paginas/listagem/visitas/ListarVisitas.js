import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useContext, useState } from 'react';
import Apis from '../../../Apis';
import { SafeAreaView, View, FlatList, StyleSheet, Text, TouchableOpacity } from 'react-native';
import Loading from '../../../componentes/Loading';
import { AntDesign, MaterialCommunityIcons } from "react-native-vector-icons";
import CadastrarVisitas from '../../cadastro/visitas/CadastrarVisitas';
import ModalAlert from '../../../componentes/ModalAlert';
import AreaModalBtnInput from '../../../componentes/AreaModalBtnInput';
import Data from '../../../componentes/Data';
import InputComponent from '../../../componentes/InputComponent';
import ButtonInput from '../../../componentes/ButtonInput';
import NotFound from '../../../componentes/NotFound';
import ButtonFab from '../../../componentes/ButtonFab';
import FabButtons from '../../../componentes/FabButtons';
import { axiosConfig } from '../../../axiosConfig';
import { ContextGlobal } from '../../../context/GlobalContext';

const Item = ({ item, index }) => (
    <TouchableOpacity activeOpacity={0.5} style={[styles.item, { borderTopWidth: index === 0 ? 1 : 0, borderColor: '#d9d9d5' }]}>
        <View style={styles.item.itemLeft}>
            <Text style={styles.item.itemLeft.idmData}>#{item?.id} - {item?.data_hora?.substring(0, 11).split('-').reverse().join('/')}</Text>
            <Text style={styles.item.itemLeft.nome}>{item?.cliente?.nome}</Text>
            <Text style={styles.item.itemLeft.email}>{item?.obs}</Text>
            <Text style={styles.item.itemLeft.cnpj_cpf}>{item?.cliente?.cnpj_cpf}</Text>
        </View>
    </TouchableOpacity>
);

const ListarVisitas = ({ navigation }) => {
    const { verificarToken } = useContext(ContextGlobal);
    const [openCloseModalCadastrarVisitas, setOpenCloseModalCadastrarVisitas] = useState(false);
    const [openCloseModalFiltrarVisitas, setOpenCloseModalFiltrarVisitas] = useState(false);
    const [visitas, setVisitas] = useState([]);
    const [loading, setLoading] = useState(false);
    const [reload, setReload] = useState(false);
    const data = new Date();
    const ano = data.getFullYear();
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const dia = String(data.getDate()).padStart(2, '0');
    const [dataInicialFiltro, setDataInicialFiltro] = useState(`${ano}-${mes}-${dia}`);
    const [dataFinalFiltro, setDataFinalFiltro] = useState(`${ano}-${mes}-${dia}`);
    const [pesquisarVisitaFiltro, setPesquisarVisitaFiltro] = useState('');
    const [openCloseModalFabButtons, setOpenCloseModalFabButtons] = useState(false);

    useFocusEffect(useCallback(() => {
        verificarToken();
        handleDataVisitas();
    }, [reload]));

    const handleDataVisitas = async () => {
        setOpenCloseModalFiltrarVisitas(false);
        setLoading(true);
        try {
            const response = await axiosConfig.post(Apis.urlReadVisitas, { data_ini: dataInicialFiltro, data_fin: dataFinalFiltro, pesquisa: pesquisarVisitaFiltro, registros: 30 });
            setVisitas(response.data.registros);
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
            funcao: () => setOpenCloseModalFiltrarVisitas(true)
        },
        {
            iconeName: 'add',
            funcao: () => setOpenCloseModalCadastrarVisitas(true)
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
                        <Text style={styles.textAppBar}>VISITAS ({visitas.length})</Text>
                        <TouchableOpacity onPress={() => navigation.goBack()}>
                            <AntDesign name="close" style={{ fontSize: 22 }} />
                        </TouchableOpacity>
                    </View>

                    {visitas?.length > 0 ?
                        <FlatList data={visitas} showsVerticalScrollIndicator={false} renderItem={({ item, index }) => <Item item={item} index={index} />} keyExtractor={item => item?.id} />
                        :
                        <NotFound />
                    }
                    <CadastrarVisitas openClose={openCloseModalCadastrarVisitas} setOpenClose={setOpenCloseModalCadastrarVisitas} recarregar={reload} setRecarregar={setReload} />
                    <ModalAlert ocultarInfoGe={true} scroll={true} funcao={() => setOpenCloseModalFiltrarVisitas(false)} openModal={openCloseModalFiltrarVisitas}>
                        <View style={styles.appBar}>
                            <TouchableOpacity onPress={() => setOpenCloseModalFiltrarVisitas(false)}>
                                <AntDesign name="close" style={{ fontSize: 22 }} />
                            </TouchableOpacity>
                            <Text style={styles.textAppBar}>FILTRAR VISITA</Text>
                        </View>
                        <AreaModalBtnInput>
                            <Data setValor={setDataInicialFiltro} valor={dataInicialFiltro} />
                            <Data setValor={setDataFinalFiltro} valor={dataFinalFiltro} />
                            <InputComponent setValor={setPesquisarVisitaFiltro} valor={pesquisarVisitaFiltro} placeholder='Digite para fazer a busca' />
                        </AreaModalBtnInput>
                        <ButtonInput bgColor='#3b97ee' color='#fff' texto='aplicar filtro' funcao={handleDataVisitas}>
                            <MaterialCommunityIcons name='filter-outline' style={[{fontSize: 22, color: '#fff' }]} />
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
        alignItems: 'center',
    },
    textAppBar: {
        fontSize: 13,
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
            idmData: {
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
});

export default ListarVisitas;