import { createNativeStackNavigator } from "@react-navigation/native-stack";

import ClasesScreen from "../screens/ClasesScreen.js";

const Stack = createNativeStackNavigator();

export default function ClaseStack() {
    return(
        <Stack.Navigator>
            <Stack.Screen 
                name="ClasesScreen" 
                component={ClasesScreen} 
                options={{
                    title: 'Clases de inglés', 
                    headerShown: false
                    }}
            />
        </Stack.Navigator>
    )
}