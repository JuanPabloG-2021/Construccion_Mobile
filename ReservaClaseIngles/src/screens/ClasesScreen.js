import { IonIcons } from "@expo/vector-icons";
import { useState } from "react";
import { Text, View } from 'react-native';

import { TextInput } from "react-native";

import { NIVELES } from "./data/clases.js";


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
            <ScrollView
                horizontal
                showHorizontalScrollIndicator={false}
                style={{flexGrow: 0}}
            >
                {
                    NIVELES.map((item) =>(
                        <NivelCip
                            etiqueta={item}
                            activo={item}
                            onPress={() => setNivel(item)}
                        />
                    ))
                }
            
            </ScrollView>
        </View>
    )

}

