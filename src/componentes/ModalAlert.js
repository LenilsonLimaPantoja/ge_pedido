import { Image, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import app from '../../app.json';
import icon from '../../assets/icon.png';

const ModalAlert = ({ children, funcao, textoModal, openModal, flex, ocultarInfoGe, scroll, bgColor }) => {
    return (
        <Modal transparent={true} onRequestClose={() => funcao()} visible={openModal} animationType="slide">
            <TouchableOpacity onPress={() => funcao()} style={styles.fundoModal}></TouchableOpacity>
            <View style={styles.container}>
                <View style={[styles.area, { flex: flex, backgroundColor: bgColor ? bgColor : '#f8f8fa' }]}>
                    {scroll ?
                        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ rowGap: 15 }}>
                            {!ocultarInfoGe &&
                                < View style={styles.topo}>
                                    <Image source={icon} style={styles.img} />
                                    <View style={styles.areaTopo}>
                                        <Text style={styles.tituloTopo}>ge_pedido</Text>
                                        <Text style={styles.textTopo}>Versão: {app.expo.version}</Text>
                                        <Text style={styles.textTopo}>www.gepedido.com.br</Text>
                                    </View>
                                </View>
                            }
                            {textoModal &&
                                <>
                                    <Text style={styles.textModal}>{textoModal}</Text>
                                    <View style={{ borderBottomWidth: .5, borderColor: '#d9d9d5' }} />
                                </>
                            }
                            {children}
                        </ScrollView>
                        :
                        <>
                            {!ocultarInfoGe &&
                                < View style={styles.topo}>
                                    <Image source={icon} style={styles.img} />
                                    <View style={styles.areaTopo}>
                                        <Text style={styles.tituloTopo}>ge_pedido</Text>
                                        <Text style={styles.textTopo}>Versão: {app.expo.version}</Text>
                                        <Text style={styles.textTopo}>www.gepedido.com.br</Text>
                                    </View>
                                </View>
                            }
                            {textoModal &&
                                <>
                                    <Text style={styles.textModal}>{textoModal}</Text>
                                    <View style={{ borderBottomWidth: .5, borderColor: '#d9d9d5' }} />
                                </>
                            }
                            {children}
                        </>
                    }
                </View>
            </View>
        </Modal >
    )
}
export default ModalAlert;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-end',
        // padding: 10,
        alignItems: 'center',
    },
    area: {
        width: '100%',
        padding: 15,
        // borderRadius: 5,
        rowGap: 15,
        // minHeight: 200,
    },
    topo: {
        flexDirection: 'row',
        alignItems: 'center',
        columnGap: 10,
        borderBottomWidth: .5,
        borderColor: '#d9d8d8',
        paddingBottom: 20,
        paddingTop: 5
    },
    img: {
        width: 40,
        height: 40
    },
    areaTopo: {
        rowGap: 3
    },
    tituloTopo: {
        fontWeight: 'bold'
    },
    textTopo: {
        fontSize: 12,
        color: 'gray'
    },
    textModal: {
        fontSize: 14,
        width: '100%',
    },
    fundoModal: {
        backgroundColor: '#000',
        flex: 1,
        width: '100%',
        opacity: .6,
        position: 'absolute',
        height: '100%',
        top: 0,
        left: 0
    }
})