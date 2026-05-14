import ModalAlert from "../../componentes/ModalAlert";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { MaterialIcons, AntDesign } from 'react-native-vector-icons';
import AreaModalBtnInput from "../../componentes/AreaModalBtnInput";
import ButtonInput from "../../componentes/ButtonInput";
import { useContext } from "react";
import { ContextGlobal } from "../../context/GlobalContext";
import { MaterialCommunityIcons } from 'react-native-vector-icons';

const diasSemana = [
    { key: 'domingo', label: 'Domingo' },
    { key: 'segunda', label: 'Segunda-Feira' },
    { key: 'terca', label: 'Terça-Feira' },
    { key: 'quarta', label: 'Quarta-Feira' },
    { key: 'quinta', label: 'Quinta-Feira' },
    { key: 'sexta', label: 'Sexta-Feira' },
    { key: 'sabado', label: 'Sábado' },
];

const SelectDiaSemana = ({
    openClose,
    setOpenClose,
    setDiasSemanaSelected,
    tipoDiasSemanaSelected
}) => {

    const { verificarToken } = useContext(ContextGlobal);

    const toggleDia = (dia) => {
        verificarToken();

        setDiasSemanaSelected({
            ...tipoDiasSemanaSelected,
            [dia]: tipoDiasSemanaSelected[dia] === 1 ? 0 : 1
        });
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
                    SELECIONE OS DIAS DA SEMANA
                </Text>
            </View>

            <AreaModalBtnInput>
                {diasSemana.map((dia, index) => (
                    <ButtonInput
                        key={dia.key}
                        borderBottomWidth={index !== diasSemana.length - 1}
                        funcao={() => toggleDia(dia.key)}
                        texto={dia.label}
                    >
                        <MaterialIcons
                            style={styles.icone}
                            name={
                                tipoDiasSemanaSelected[dia.key] === 1
                                    ? "check-box"
                                    : "check-box-outline-blank"
                            }
                        />
                    </ButtonInput>
                ))}
            </AreaModalBtnInput>

            <ButtonInput color='#fff' texto='adicionar' bgColor='#3b97ee' funcao={() => setOpenClose(false)}>
                <MaterialCommunityIcons name='chevron-right' style={{ fontSize: 20, color: '#fff' }} />
            </ButtonInput>
        </ModalAlert>
    );
};

export default SelectDiaSemana;

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