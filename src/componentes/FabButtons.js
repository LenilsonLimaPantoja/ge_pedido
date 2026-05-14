import { Modal, StyleSheet, TouchableOpacity, View } from "react-native";
import ButtonFab from "./ButtonFab";
const FabButtons = ({ openClose, setOpenClose, arrayFuncFab }) => {

    return (
        <Modal transparent={true} visible={openClose} onRequestClose={() => setOpenClose(false)} animationType="fade">
            <TouchableOpacity onPress={() => setOpenClose(false)} style={styles.fundoModal}></TouchableOpacity>
            <View style={styles.container}>
                <View style={styles.containerBnt}>
                    {arrayFuncFab?.map((item, index) => (
                        <ButtonFab iconeName={item?.iconeName} onPress={item?.funcao} setCloseFab={setOpenClose} key={index} />
                    ))}
                </View>
            </View>
        </Modal>
    )
}
export default FabButtons;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    fundoModal: {
        backgroundColor: '#000',
        flex: 1,
        width: '100%',
        opacity: .4,
        position: 'absolute',
        height: '100%',
        top: 0,
        left: 0
    },
    containerBnt: {
        position: 'absolute',
        right: 15,
        bottom: 15,
        rowGap: 15,
    },
});