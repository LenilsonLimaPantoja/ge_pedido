import ModalAlert from "../../componentes/ModalAlert";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { MaterialIcons, AntDesign } from 'react-native-vector-icons';
import AreaModalBtnInput from "../../componentes/AreaModalBtnInput";
import ButtonInput from "../../componentes/ButtonInput";
import { useContext } from "react";
import { ContextGlobal } from "../../context/GlobalContext";

const SelectTipoPedido = ({ openClose, setOpenClose, setTipoPedidoSelected, tipoPedidoSelected }) => {
    const { verificarToken } = useContext(ContextGlobal);
    const handleClickMotivoVisita = (tipo) => {
        verificarToken();
        setTipoPedidoSelected(tipo);
        setOpenClose(false);
    }
    return (
        <ModalAlert ocultarInfoGe={true} funcao={() => setOpenClose(false)} openModal={openClose}>
            <View style={styles.appBar}>
                <TouchableOpacity onPress={() => setOpenClose(false)}>
                    <AntDesign name="close" style={{ fontSize: 22 }} />
                </TouchableOpacity>
                <Text style={styles.textAppBar}>SELECIONE O TIPO DO PEDIDO</Text>
            </View>
            <AreaModalBtnInput>
                <ButtonInput borderBottomWidth={true} funcao={() => handleClickMotivoVisita(0)} texto='pedido de venda' >
                    {tipoPedidoSelected === 0 ?
                        <MaterialIcons style={styles.icone} name="check-box" />
                        :
                        <MaterialIcons style={styles.icone} name="check-box-outline-blank" />
                    }
                </ButtonInput>
                <ButtonInput funcao={() => handleClickMotivoVisita(1)} texto='pedido de troca' >
                    {tipoPedidoSelected === 1 ?
                        <MaterialIcons style={styles.icone} name="check-box" />
                        :
                        <MaterialIcons style={styles.icone} name="check-box-outline-blank" />
                    }
                </ButtonInput>
            </AreaModalBtnInput>
        </ModalAlert>
    )
}
export default SelectTipoPedido;
const styles = StyleSheet.create({
    appBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    textAppBar: {
        fontSize: 13,
    },
    btnTipo: {
        padding: 10,
        minHeight: 50,
        borderRadius: 5,
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#d9d8d8'
    },
    icone: {
        fontSize: 20,
    },
    viewBtn: {
        flexDirection: 'row',
        columnGap: 20
    }
});
