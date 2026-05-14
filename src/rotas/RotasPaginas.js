import { createNativeStackNavigator } from '@react-navigation/native-stack';
import RotasDrawer from './RotasDrawer';
import PreLoad from '../paginas/preLoad/PreLoad';
import IndexLogin from '../paginas/login/IndexLogin';
import ListarPedidos from '../paginas/listagem/pedidos/ListarPedidos';
import ListarProdutos from '../paginas/listagem/produtos/ListarProdutos';
import ListarFoamasPagamento from '../paginas/listagem/formasPagamento/ListarFoamasPagamento';
import ListarClientes from '../paginas/listagem/clientes/ListarClientes';
import ListarVisitas from '../paginas/listagem/visitas/ListarVisitas';
import Info from '../paginas/info/Info';
import AlterarSenha from '../paginas/alteracao/info/AlterarSenha';

const Stack = createNativeStackNavigator();

const RotasPaginas = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false, animation: 'slide_from_bottom' }}>
            <Stack.Screen name="PreLoad" component={PreLoad} />
            <Stack.Screen name="RotasDrawer" component={RotasDrawer} />
            <Stack.Screen name="Login" component={IndexLogin} />
            <Stack.Screen name="ListarPedidos" component={ListarPedidos} />
            <Stack.Screen name="ListarProdutos" component={ListarProdutos} />
            <Stack.Screen name="ListarFoamasPagamento" component={ListarFoamasPagamento} />
            <Stack.Screen name="ListarClientes" component={ListarClientes} />
            <Stack.Screen name="ListarVisitas" component={ListarVisitas} />
            <Stack.Screen name="Info" component={Info} />
            <Stack.Screen name="AlterarSenha" component={AlterarSenha} />
        </Stack.Navigator>
    );
}

export default RotasPaginas;