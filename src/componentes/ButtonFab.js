import { StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from 'react-native-vector-icons';

const ButtonFab = ({ iconeName, onPress, bgColor, colorIcone, setCloseFab, fixedRight }) => {
    const handleClick = () => {
        if (setCloseFab) {
            setCloseFab(false);
        }
        onPress();
    }
    return (
        <TouchableOpacity activeOpacity={.5} style={[styles.btn, { backgroundColor: bgColor || '#fff', elevation: 1, position: fixedRight ? 'absolute' : 'static', right: fixedRight ? 15 : 0, bottom: fixedRight ? 15 : 0 }]} onPress={handleClick}>
            <Ionicons name={iconeName} style={[styles.icones, { color: colorIcone || '#000' }]} />
        </TouchableOpacity>
    )
}
export default ButtonFab;
const styles = StyleSheet.create({
    btn: {
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
    },
    icones: {
        fontSize: 25
    }
});