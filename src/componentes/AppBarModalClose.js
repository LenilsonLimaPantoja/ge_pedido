import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { AntDesign } from 'react-native-vector-icons';
const AppBarModalClose = ({ funcao, texto }) => {
    return (
        <View style={[styles.appBar, { borderBottomWidth: 1, paddingBottom: 10, borderColor: '#d9d9d5' }]}>
            <TouchableOpacity onPress={funcao}>
                <AntDesign name="close" style={{ fontSize: 22 }} />
            </TouchableOpacity>
            <Text style={styles.textAppBar}>{texto}</Text>
        </View>
    )
}
export default AppBarModalClose;
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
        alignItems: 'center'
    },
    textAppBar: {
        fontSize: 13,
        // fontWeight: 'bold'
    },
});