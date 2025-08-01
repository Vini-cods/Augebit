import { createStackNavigator } from '@react-navigation/stack';
import Bem_Vindo from './pages/index';
import Inicio from './pages/inicio';
import Agendamento from './pages/Agendamento';

const Stack = createStackNavigator();

export default function Routes() {
    return (
        <Stack.Navigator initialRouteName="BemVindo">
            <Stack.Screen
                name="BemVindo"
                component={Bem_Vindo}
                options={{ headerShown: false }}
            />

            <Stack.Screen
                name="Inicio"
                component={Inicio}
                options={{ headerShown: false }}
            />

            <Stack.Screen
                name="Agendamento"
                component={Agendamento}
                options={{ headerShown: false }}
            />

        </Stack.Navigator>
    );
}