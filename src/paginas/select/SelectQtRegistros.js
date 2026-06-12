import ModalAlert from "../../componentes/ModalAlert";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { MaterialIcons, AntDesign } from 'react-native-vector-icons';
import AreaModalBtnInput from "../../componentes/AreaModalBtnInput";
import ButtonInput from "../../componentes/ButtonInput";
import { useContext } from "react";
import { ContextGlobal } from "../../context/GlobalContext";
import { MaterialCommunityIcons } from 'react-native-vector-icons';

const qtRegistros = [
    { key: '30', label: '30 Registros' },
    { key: '50', label: '50 Registros' },
    { key: '100', label: '100 Registros' },
    { key: '200', label: '200 Registros' }
];

const SelectQtRegistros = ({
    openClose,
    setOpenClose,
    setQtRegistrosSelected,
    qtRegistrosSelected
}) => {

    const toggleQtRegistros = (qt) => {
        setQtRegistrosSelected(qt);
        setOpenClose(false);
    };

    return (
        <ModalAlert
            ocultarInfoGe={true}
            funcao={() => setOpenClose(false)}
            openModal={openClose}
        >
            <View style={styles.appBar}>
                <TouchableOpacity onPress={() => setOpenClose(false)}>
                    <AntDesign name="close" style={{ fontSize: 22 }} />
                </TouchableOpacity>

                <Text style={styles.textAppBar}>
                    QUANTIDADE DE REGISTROS POR PÁGINA
                </Text>
            </View>

            <AreaModalBtnInput>
                {qtRegistros.map((qt, index) => (
                    <ButtonInput
                        key={qt.key}
                        borderBottomWidth={index !== qtRegistros.length - 1}
                        funcao={() => toggleQtRegistros(qt.key)}
                        texto={qt.label}
                    >
                        <MaterialIcons
                            style={styles.icone}
                            name={
                                qtRegistrosSelected === qt.key
                                    ? "check-box"
                                    : "check-box-outline-blank"
                            }
                        />
                    </ButtonInput>
                ))}
            </AreaModalBtnInput>
        </ModalAlert>
    );
};

export default SelectQtRegistros;

const styles = StyleSheet.create({
    appBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    textAppBar: {
        fontSize: 13,
    },

    icone: {
        fontSize: 20,
    },
});