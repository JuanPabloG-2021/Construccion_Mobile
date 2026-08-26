import { IonIcons } from "@expo/vector-icons";
import { useState } from "react";
import { Text, View } from 'react-native';

import { TextInput } from "react-native";


export default function ClasesScreen({navigation}) {

    const [clases, setClases] = useState('Todos');
    const [nivel, setNivel] = useState();

    return(
        <View>
            <Text>Aplicacion de reserva para clases de ingles</Text>
            <View>
                <IonIcons name="search" size={24} color="black"/>
                <TextInput
                    value={busqueda}
                    onChangeText={setBusqueda}
                    placeholder="Buscar clases..."
                    autoCorrect={false}
                    autoComplete="off"
                />
                {
                    busqueda.length > 0 && (
                        <IonIcons 
                            name="close-circle" 
                            size={24} 
                            color="black" 
                            onPress={() => setBusqueda('')}
                        />
                    )
                }
            </View>
        </View>
    )

}

