import ModalAlert from "../../componentes/ModalAlert";
import { StyleSheet } from "react-native";
import { MaterialIcons } from 'react-native-vector-icons';
import AreaModalBtnInput from "../../componentes/AreaModalBtnInput";
import ButtonInput from "../../componentes/ButtonInput";
import AppBarModalClose from "../../componentes/AppBarModalClose";
import { useContext } from "react";
import { ContextGlobal } from "../../context/GlobalContext";

const SelectStatusCliente = ({ openClose, setOpenClose, setStatusClienteSelected, statusClienteSelected }) => {
    const { verificarToken } = useContext(ContextGlobal);
    const handleClickMotivoVisita = (tipo) => {
        verificarToken();
        setStatusClienteSelected(tipo);
        setOpenClose(false);
    }
    return (
        <ModalAlert ocultarInfoGe={true} funcao={() => setOpenClose(false)} openModal={openClose}>
            <AppBarModalClose funcao={() => setOpenClose(false)} texto='STATUS DO CLIENTE' />
            <AreaModalBtnInput>
                <ButtonInput borderBottomWidth={true} funcao={() => handleClickMotivoVisita('-1')} texto='mostrar todos' >
                    {statusClienteSelected == '-1' ?
                        <MaterialIcons style={styles.icone} name="check-box" />
                        :
                        <MaterialIcons style={styles.icone} name="check-box-outline-blank" />
                    }
                </ButtonInput>
                <ButtonInput borderBottomWidth={true} funcao={() => handleClickMotivoVisita('0')} texto='mostrar ativos' >
                    {statusClienteSelected == '0' ?
                        <MaterialIcons style={styles.icone} name="check-box" />
                        :
                        <MaterialIcons style={styles.icone} name="check-box-outline-blank" />
                    }
                </ButtonInput>
                <ButtonInput funcao={() => handleClickMotivoVisita('1')} texto='mostrar inativos'>
                    {statusClienteSelected == '1' ?
                        <MaterialIcons style={styles.icone} name="check-box" />
                        :
                        <MaterialIcons style={styles.icone} name="check-box-outline-blank" />
                    }
                </ButtonInput>
            </AreaModalBtnInput>
        </ModalAlert>
    )
}
export default SelectStatusCliente;
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
