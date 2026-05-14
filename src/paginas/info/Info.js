import { useState } from 'react';
import ModalAlert from '../../componentes/ModalAlert';
import app from '../../../app.json';
import { StyleSheet, Text, View } from 'react-native';
const Info = ({ navigation }) => {
    const [openCloseModal, setOpenCloseModal] = useState(true);
    const handleVoltar = async () => {
        await navigation.goBack();
        setOpenCloseModal(false);
    }
    return (
        <ModalAlert flex={1} funcao={handleVoltar} openModal={openCloseModal} scroll={true}>
            <View style={styles.container}>
                <Text style={styles.titulo}>GE Pedido - Gerenciamento de Pedidos e Vendas Simplificado</Text>
                <Text style={styles.subTitulo}>O aplicativo <Text style={{ fontWeight: 'bold', color: '#000' }}>GE Pedido</Text> oferece um conjunto completo de funcionalidades para facilitar o controle de pedidos, clientes e visitas, além de permitir o acesso rápido a relatórios e comprovantes de venda. Aqui estão as principais funções do app:</Text>
                <Text style={styles.funcaoApp}>Funções do Aplicativo</Text>
                <View style={{ rowGap: 10 }}>
                    <View style={styles.containerFuncao}>
                        <Text style={styles.funcao}>Pedidos:</Text>
                        <Text style={styles.descricao}>Criar e visualizar pedidos com facilidade.</Text>
                        <Text style={styles.descricao}>Após criar um pedido, você pode visualizar os detalhes ou enviar o comprovante de venda ao cliente.</Text>
                        <Text style={styles.descricao}>Geração de relatórios de venda resumida por período, onde as vendas são agrupadas por produto, indicando quantas vendas foram feitas com cada item e os valores correspondentes.</Text>
                    </View>
                    <View style={styles.containerFuncao}>
                        <Text style={styles.funcao}>Visitas:</Text>
                        <Text style={styles.descricao}>Criar e visualizar visitas, usadas para registrar quando o vendedor visita o cliente, mas por algum motivo o cliente não realiza a compra.</Text>
                    </View>
                    <View style={styles.containerFuncao}>
                        <Text style={styles.funcao}>Clientes:</Text>
                        <Text style={styles.descricao}>Criar e visualizar dados dos clientes, permitindo gerenciar sua base de clientes com eficiência.</Text>
                    </View>
                    <View style={styles.containerFuncao}>
                        <Text style={styles.funcao}>Formas de Pagamento:</Text>
                        <Text style={styles.descricao}>Visualizar as formas de pagamento disponíveis.</Text>
                    </View>
                    <View style={styles.containerFuncao}>
                        <Text style={styles.funcao}>Produtos:</Text>
                        <Text style={styles.descricao}>Visualizar os produtos cadastrados para uso nos pedidos.</Text>
                    </View>
                    <View style={styles.containerFuncao}>
                        <Text style={styles.funcao}>Usuário:</Text>
                        <Text style={styles.descricao}>Visualizar dados de usuário e alterar a senha da conta, mantendo a segurança.</Text>
                    </View>
                    <View style={styles.containerFuncao}>
                        <Text style={styles.funcao}>Tela Inicial:</Text>
                        <Text style={styles.descricao}>A tela inicial do app destaca as principais funções de maneira prática, além de exibir uma lista com os <Text style={{ fontWeight: 'bold', color: '#000' }}>10 últimos pedidos criados,</Text> garantindo que você tenha acesso rápido às informações mais recentes.</Text>
                    </View>
                </View>
                <Text style={styles.subTitulo}>O <Text style={{ fontWeight: 'bold', color: '#000' }}>GE Pedido</Text> simplifica o processo de gestão de vendas, visitas e clientes, tornando seu trabalho mais ágil e eficiente.</Text>
                <Text style={styles.versao}>v{app.expo?.version}</Text>
            </View>
        </ModalAlert>
    )
}
export default Info;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        rowGap: 20
    },
    titulo: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    subTitulo: {
        color: 'gray',
        fontSize: 13
    },
    funcaoApp: {
        fontSize: 15,
        fontWeight: 'bold',
    },
    containerFuncao: {
        rowGap: 10
    },
    funcao: {
        marginLeft: 10,
        fontSize: 15,
        fontWeight: 'bold'
    },
    descricao: {
        marginLeft: 20,
        color: 'gray',
        fontSize: 13
    },
    versao: {
        textAlign: 'center',
        color: 'gray',
        fontSize: 13,
        marginTop: 20
    }
});