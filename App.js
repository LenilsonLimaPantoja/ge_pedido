import 'react-native-gesture-handler';
import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import RotasPaginas from './src/rotas/RotasPaginas';
import GlobalContext from './src/context/GlobalContext';

export default function App() {
  return (
    <NavigationContainer>
      <GlobalContext>
        <RotasPaginas />
      </GlobalContext>
      <StatusBar backgroundColor="#000" barStyle="light-content" />
    </NavigationContainer>
  );
}