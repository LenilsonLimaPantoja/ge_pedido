import { StyleSheet } from "react-native";
import { TextInput } from "react-native"

const InputComponent = ({ borderBottomWidth, placeholder, valor, setValor, type, seguro }) => {
    return (
        <TextInput
            secureTextEntry={seguro}
            onChangeText={setValor} value={valor} keyboardType={type} placeholderTextColor='gray' placeholder={placeholder}
            style={[styles.input, { borderBottomWidth: borderBottomWidth ? 1 : 0, borderColor: '#d9d9d5' }]} />
    )
}
export default InputComponent;
const styles = StyleSheet.create({
    input: {
        borderWidth: 0,
        padding: 10,
        minHeight: 50,
        backgroundColor: '#fff'
    }
});