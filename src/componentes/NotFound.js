import { StyleSheet, Text, View } from 'react-native';

const NotFound = () => {
    return (
        <View style={styles.container}>
                <Text style={styles.text}>Nenhuma informação foi encontrada, tente novamente</Text>
        </View>
    )
}
export default NotFound;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    text: {
        fontSize: 12,
        color: 'gray',
        maxWidth: 220,
        textAlign: 'center'
    }
});