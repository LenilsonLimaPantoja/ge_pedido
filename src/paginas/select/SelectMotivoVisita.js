import { useCallback, useContext, useState } from "react";
import ModalAlert from "../../componentes/ModalAlert";
import { useFocusEffect } from "@react-navigation/native";
import Apis from "../../Apis";
import { MaterialCommunityIcons } from 'react-native-vector-icons';
import { FlatList, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Loading from "../../componentes/Loading";
import { axiosConfig } from "../../axiosConfig";
import { ContextGlobal } from "../../context/GlobalContext";
const Item = ({ item, handleClickMotivoVisita, index }) => (
    <TouchableOpacity activeOpacity={0.5} style={[styles.item, { borderTopWidth: index === 0 ? 1 : 0, borderColor: '#d9d9d5' }]} onPress={() => handleClickMotivoVisita(item)}>
        <View style={styles.item.itemLeft}>
            <Text style={styles.item.itemLeft.codigo}>#{item?.codigo}</Text>
            <Text style={styles.item.itemLeft.descricao}>{item?.descricao}</Text>
        </View>
    </TouchableOpacity>
);

const SelectMotivoVisita = ({ openClose, setOpenClose, setMotivoVisitaSelected }) => {
    const { verificarToken } = useContext(ContextGlobal);
    const [motivoVisita, setMotivoVisita] = useState([]);
    const [loading, setLoading] = useState(false);

    useFocusEffect(useCallback(() => {
        handleDataMotivosVisita();
    }, []));

    const handleDataMotivosVisita = async () => {
        setLoading(true);
        try {
            const response = await axiosConfig.post(Apis.urlReadMotivoVisitas, {});
            setMotivoVisita(response?.data);
        } catch (error) {
            console.log(error.response?.data);
        } finally {
            setLoading(false);
        }
    };
    const handleClickMotivoVisita = (item) => {
        verificarToken();
        setMotivoVisitaSelected(item);
        setOpenClose(false);
    }
    return (
        <ModalAlert bgColor='#fff' funcao={() => setOpenClose(false)} openModal={openClose} flex={0} ocultarInfoGe={true}>
            <SafeAreaView style={styles.container}>
                <View style={styles.appBar}>
                    <TouchableOpacity onPress={() => setOpenClose(false)}>
                        <MaterialCommunityIcons name="close" style={{ fontSize: 25 }} />
                    </TouchableOpacity>
                </View>
                {!loading ? <FlatList data={motivoVisita} showsVerticalScrollIndicator={false} renderItem={({ item, index }) => <Item item={item} handleClickMotivoVisita={() => handleClickMotivoVisita(item)} index={index} />} keyExtractor={item => item?.codigo} /> : <Loading />}
            </SafeAreaView>
        </ModalAlert>
    )
}
export default SelectMotivoVisita;
const styles = StyleSheet.create({
    container: {
        rowGap: 15,
        height: '100%',
    },
    appBar: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center'
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
            codigo: {
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
        },
    },
});
