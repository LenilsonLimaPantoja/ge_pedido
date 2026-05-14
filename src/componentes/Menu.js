import { FlatList, Image, Linking, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native"
import { AntDesign } from "react-native-vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useContext, useState } from "react";
import whatsapp from '../../assets/whatsapp.webp';
import conta from '../../assets/conta.webp';
import home from '../../assets/home.webp';
import pedido from '../../assets/pedido.webp';
import visita from '../../assets/visita.webp';
import cliente from '../../assets/cliente.webp';
import produto from '../../assets/produto.webp';
import forma_pagamento from '../../assets/forma_pagamento.webp';
import info from '../../assets/info.webp';
import sair from '../../assets/sair.webp';
import { ContextGlobal } from "../context/GlobalContext";
const lista = [
    {
        id: 8,
        img: conta,
        rota: 'AlterarSenha',
        center: {
            titulo: 'Central de Conta',
            subTitulo: 'Senha, segurança e dados pessoais'
        }
    },
    {
        id: 1,
        img: home,
        rota: 'Home',
        center: {
            titulo: 'Home',
            subTitulo: 'Explore as opções e controle suas atividades'
        }
    },
    {
        id: 2,
        img: pedido,
        rota: 'ListarPedidos',
        center: {
            titulo: 'Pedidos',
            subTitulo: 'Incluir e visualizar pedidos'
        }
    },
    {
        id: 3,
        img: visita,
        rota: 'ListarVisitas',
        center: {
            titulo: 'Visitas',
            subTitulo: 'Incluir e visualizar visitas'
        }
    },
    {
        id: 4,
        img: cliente,
        rota: 'ListarClientes',
        center: {
            titulo: 'Clientes',
            subTitulo: 'Incluir e visualizar clientes'
        }
    },
    {
        id: 5,
        img: produto,
        rota: 'ListarProdutos',
        center: {
            titulo: 'Produtos',
            subTitulo: 'Visualizar Produtos'
        }
    },
    {
        id: 6,
        img: forma_pagamento,
        rota: 'ListarFoamasPagamento',
        center: {
            titulo: 'Formas de Pgto',
            subTitulo: 'Visualizar formas de pagamentos'
        }
    },
    {
        id: 9,
        img: info,
        rota: 'Info',
        center: {
            titulo: 'Info',
            subTitulo: 'Notas de atualização, versão do aplicativo e informações'
        }
    },
    {
        id: 10,
        img: sair,
        rota: 'Login',
        center: {
            titulo: 'Sair',
            subTitulo: 'Deslogar do aplicativo'
        }
    }
];

const Item = ({ item, index, navigation, logout }) => (
    <>
        {index === 0 &&
            <>
                <TouchableOpacity onPress={() => Linking.openURL("https://api.whatsapp.com/send?phone=5567991986596&text=Ajuda%20com%20o%20GE%20Pedido%20Mobile")} style={{ marginBottom: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#efefef', padding: 20, borderRadius: 10, columnGap: 20, flexWrap: 'wrap' }}>
                    <Image source={whatsapp} style={{ width: 35, height: 35 }} />
                    <View style={{ flex: 1 }}>
                        <Text style={{ fontWeight: 'bold' }}>Ajuda no Whatsapp!</Text>
                        <Text style={{ color: 'gray', fontSize: 13 }}>Solicite ajuda através do whatsapp</Text>
                    </View>
                    <AntDesign name="right" style={styles.cardMenu.iconeRight} />
                </TouchableOpacity>
                <View style={styles.dividir} />
            </>
        }
        <TouchableOpacity style={styles.cardMenu} onPress={item?.rota === 'Login' ? logout : () => navigation.navigate(item?.rota)}>
            <Image source={item?.img} style={{ width: 25, height: 25 }} />
            <View style={styles.cardMenu.center}>
                <Text style={styles.cardMenu.center?.title}>{item?.center?.titulo}</Text>
                <Text style={styles.cardMenu.center?.subTitulo}>{item?.center?.subTitulo}</Text>
            </View>
            <AntDesign name="right" style={styles.cardMenu.iconeRight} />
        </TouchableOpacity>
        <View style={styles.dividir} />
    </>
);

const Menu = ({ navigation }) => {
    const { logout } = useContext(ContextGlobal);
    const [pesquisar, setPesquisar] = useState('');
    const [dados, setDados] = useState(lista);
    useFocusEffect(useCallback(() => {
        const handleData = () => {
            var listaCopy = lista?.filter((item) => {
                if (pesquisar === "") {
                    return item;
                }
                if (pesquisar !== "" && item?.center?.titulo?.toLowerCase().includes(pesquisar.toLowerCase())) {
                    return item;
                }
                if (pesquisar !== "" && item?.center?.subTitulo?.toLowerCase().includes(pesquisar.toLowerCase())) {
                    return item;
                }
            });
            setDados(listaCopy);
        }
        handleData()
    }, [pesquisar]));

    const renderItem = ({ item, index }) => (
        <Item item={item} navigation={navigation} index={index} logout={logout} />
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.area}>
                <View style={styles.cabecalho}>
                    <Text style={styles.cabecalho.text}>MENU E CONFIGURAÇÕES</Text>
                    <TouchableOpacity onPress={() => navigation.closeDrawer()}>
                        <AntDesign style={styles.cabecalho.icone} name="close" />
                    </TouchableOpacity>
                </View>
                <TouchableOpacity style={styles.pesquisar}>
                    <AntDesign style={styles.pesquisar.icone} name="search1" />
                    <TextInput style={styles.pesquisar.TextInput} placeholder="Pesquisar" onChangeText={setPesquisar} />
                </TouchableOpacity>
            </View>
            <FlatList showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1 }} data={dados} renderItem={renderItem} keyExtractor={(item) => item?.id} />
        </SafeAreaView>
    )
}
export default Menu;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 15,
        rowGap: 15
    },
    area: {
        rowGap: 15
    },
    cabecalho: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        text: {
            fontSize: 15,
            fontWeight: 'bold',
        },
        icone: {
            fontSize: 25,
        }
    },
    pesquisar: {
        backgroundColor: '#efefef',
        borderRadius: 10,
        flexDirection: 'row',
        alignItems: 'center',
        icone: {
            fontSize: 18,
            padding: 10,
            color: 'gray'
        },
        TextInput: {
            width: '100%',
            height: '100%',
            color: 'gray',
        }
    },
    cardMenu: {
        paddingBottom: 20,
        paddingTop: 20,
        titulo: {
            color: 'gray'
        },
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        columnGap: 20,
        iconeUser: {
            fontSize: 35,
            color: 'gray'
        },
        iconeRight: {
            fontSize: 15,
            color: 'gray'
        },
        center: {
            rowGap: 3,
            flex: 1,
            title: {
                fontSize: 16,
                fontWeight: 'bold'
            },
            subTitulo: {
                color: 'gray',
                fontSize: 13
            }
        }
    },
    dividir: {
        width: '100%',
        height: 1,
        backgroundColor: '#efefef'
    }
});