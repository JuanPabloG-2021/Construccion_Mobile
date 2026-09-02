import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useState } from "react";
import { Text, View, StyleSheet } from 'react-native';
import { TextInput, ScrollView } from "react-native";

import { NIVELES } from "../data/clases.js";
import NivelChip from "../components/NivelChip";
import { colors, spacing, radius } from '../themes/index.js';


export default function ClasesScreen({navigation}) {

    const insets = useSafeAreaInsets();
    const [nivel, setNivel] = useState('Todos');
    const [busqueda, setBusqueda] = useState('');

    return(
        <View  style={[
        style.pantalla,
        { paddingTop: insets.top + spacing.md }
    ]}>
            <Text>Aplicacion de reserva para clases de ingles</Text>
            <View>
                <Ionicons name="search" size={24} color="black"/>
                <TextInput
                    value={busqueda}
                    onChangeText={setBusqueda}
                    placeholder="Buscar clases..."
                    autoCorrect={false}
                    autoComplete="off"
                />
                {
                    busqueda.length > 0 && (
                        <Ionicons 
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
                        <NivelChip
                            key={item}
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

const style = StyleSheet.create({
    pantalla: { flex: 1, backgroundColor: colors.superficie },
    buscador: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
        backgroundColor: colors.superficie,
        borderRadius: radius.md,
        paddingHorizontal: spacing.lg,
        height: 46,
        marginTop: spacing.lg,
        borderWidth: 1,
        borderColor: colors.borde,
    },
    input: { flex: 1, fontSize: 14, color: colors.texto, paddingVertical: 0 },
    });

