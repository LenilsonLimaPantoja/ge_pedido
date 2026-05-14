import { createDrawerNavigator } from '@react-navigation/drawer';
import Menu from '../componentes/Menu';
import Home from '../paginas/home/Home';

const Drawer = createDrawerNavigator();

export default function RotasDrawer() {
    return (
        <Drawer.Navigator screenOptions={{ drawerStyle: { width: '90%', }, headerShown: false }} initialRouteName="Home" drawerContent={(props) => <Menu {...props} />}>
            <Drawer.Screen name="Home" component={Home} />
        </Drawer.Navigator>
    );
}