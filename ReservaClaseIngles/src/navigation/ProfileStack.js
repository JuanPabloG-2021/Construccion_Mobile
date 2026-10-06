import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import CreateProfileScreen from '../screens/CreateProfileScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Stack = createNativeStackNavigator();

export default function ClasesStack() {
    return(
        <Stack.Navigator>
            <Stack.Screen 
                name="ProfileScreen" 
                component={ProfileScreen} 
                options={{
                    title: 'Perfil', 
                    headerShown: false
                    }}
            />
            <Stack.Screen 
                name="CreateProfileScreen" 
                component={CreateProfileScreen} 
                options={{
                    title: 'Creacion de Perfil', 
                    headerShown: true,
                    headerBackTitle: 'Volver',
                    }}
            />
        </Stack.Navigator>
    )
}