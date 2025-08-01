import { createStackNavigator } from "@react-navigation/stack";
import Bem_Vindo from "./pages/index";
import Inicio from "./pages/inicio";
import Agendamento from "./pages/Agendamento";
import CursosMenu from "./pages/CursosMenu";
import CursoProdutividade from "./pages/CursoProdutividade";
import CursoEquilibrio from "./pages/CursoEquilibrio";

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
      <Stack.Screen
        name="CursosMenu"
        component={CursosMenu}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="CursoProdutividade"
        component={CursoProdutividade}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="CursoEquilibrio"
        component={CursoEquilibrio}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
