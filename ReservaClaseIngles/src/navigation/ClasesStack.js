import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import ClasesScreen from '../screens/ClasesScreen';

const Stack = createNativeStackNavigator();

export default function ClasesStack() {
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
            <Stack.Screen 
                name="DetalleClaseScreen" 
                component={DetalleClaseScreen} 
                options={{
                    title: 'Detalle de la clase', 
                    headerShown: true,
                    headerBackTitle: 'Volver',
                    }}
            />
        </Stack.Navigator>
    )
}