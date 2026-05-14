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
const Item = ({ item, handleClickRota, index }) => (
    <TouchableOpacity activeOpacity={0.5} style={[styles.item, { borderTopWidth: index === 0 ? 1 : 0, borderColor: '#d9d9d5' }]} onPress={() => handleClickRota(item)}>
        <View style={styles.item.itemLeft}>
            <Text style={styles.item.itemLeft.idData}>#{item?.id} - {item?.created_at?.substring(0, 10).split('-').reverse().join('/')}</Text>
            <Text style={styles.item.itemLeft.descricao}>{item?.descricao}</Text>
            {item?.parcelamento == 1 && <Text style={styles.item.itemLeft.parcelamento}>PARCELAMENTO</Text>}
        </View>
    </TouchableOpacity>
);

const SelectRota = ({ openClose, setOpenClose, setRota }) => {
    const { verificarToken } = useContext(ContextGlobal);
    const [rotas, setRotas] = useState([]);
    const [loading, setLoading] = useState(false);
    const [openCloseModalFiltroRotas, setOpenCloseModalFiltroRotas] = useState(false);
    const [pesquisarRotasFiltro, setPesquisarRotasFiltro] = useState('');

    useFocusEffect(useCallback(() => {
        handleDataRota();
    }, []));

    const handleDataRota = async () => {
        setOpenCloseModalFiltroRotas(false);
        setLoading(true);
        try {
            const response = await axiosConfig.get(Apis.urlReadRotas, {});
            setRotas(response?.data.registros);
        } catch (error) {
            console.log(error.response?.data);
        } finally {
            setLoading(false);
        }
    };

    const handleClickRota = (item) => {
        verificarToken();
        setRota(item);
        setOpenClose(false);
    }
    return (
        <ModalAlert funcao={() => setOpenClose(false)} openModal={openClose} flex={1} ocultarInfoGe={true} bgColor='#fff'>
            {!loading ?
                <>
                    <SafeAreaView style={styles.container}>
                        <View style={{ rowGap: 15 }}>
                            <View style={styles.appBar}>
                                <TouchableOpacity onPress={() => setOpenClose(false)} style={styles.voltarAppbar}>
                                    <MaterialCommunityIcons name="close" style={{ fontSize: 25 }} />
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.voltarAppbar} onPress={() => setOpenCloseModalFiltroRotas(true)}>
                                    <Ionicons name="options-outline" style={{ fontSize: 25 }} />
                                </TouchableOpacity>
                            </View>
                        </View>
                        {rotas?.length > 0 ?
                            <FlatList data={rotas} showsVerticalScrollIndicator={false} renderItem={({ item, index }) => <Item item={item} handleClickRota={() => handleClickRota(item)} index={index} />} keyExtractor={item => item?.id} />
                            :
                            <NotFound />
                        }
                    </SafeAreaView>
                    <ModalAlert ocultarInfoGe={true} funcao={() => setOpenCloseModalFiltroRotas(false)} openModal={openCloseModalFiltroRotas}>
                        <AppBarModalClose funcao={() => setOpenCloseModalFiltroRotas(false)} texto='FILTRAR ROTAS' />
                        <AreaModalBtnInput>
                            <InputComponent setValor={setPesquisarRotasFiltro} valor={pesquisarRotasFiltro} placeholder='Digite para fazer a busca' />
                        </AreaModalBtnInput>
                        <ButtonInput bgColor='#3b97ee' color='#fff' texto='aplicar filtro' funcao={handleDataRota}>
                            <MaterialCommunityIcons name='filter-outline' style={[{ fontSize: 22, color: '#fff' }]} />
                        </ButtonInput>
                    </ModalAlert>
                </>
                :
                <Loading />
            }
        </ModalAlert>
    )
}
export default SelectRota;
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
    voltarAppbar: {
        flexDirection: 'row',
        alignItems: 'center',
        columnGap: 10
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
