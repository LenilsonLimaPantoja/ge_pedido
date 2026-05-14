import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { MaterialIcons } from 'react-native-vector-icons';
const ButtonInput = ({ children,borderBottomWidth, texto, funcao, bgColor, color }) => {
    return (
        <TouchableOpacity onPress={() => funcao(true)}
            style={[styles.container, { backgroundColor: bgColor ? bgColor : 'transparent', borderBottomWidth: borderBottomWidth ? 1 : 0}]}
        >
            <Text style={{ maxWidth: '85%', textTransform: 'capitalize', color: color ? color : '#000' }}>{texto}</Text>
            {children ? children : <MaterialIcons style={styles.icone} name="keyboard-arrow-down" />}
        </TouchableOpacity>
    )
}
export default ButtonInput;
const styles = StyleSheet.create({
    container: {
        minHeight: 50,
        padding: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderColor: '#d9d9d5',
    },
    text: {
        textTransform: 'capitalize',
        maxWidth: '85%'
    },
    icone: {
        fontSize: 20,
    }
})