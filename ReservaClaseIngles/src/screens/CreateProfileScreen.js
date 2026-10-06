import React from 'react'
import { View, Text, Pressable, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons';
import {useState} from 'react' 
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import ProfileTextInput from '../components/ProfileTextInput.js'
import  useResponsive  from '../hooks/useResponsive.js';
import { colors, radius, spacing } from '../themes/index.js';

export default function CreateProfile() {
    const { paddingHorizontal, isLandscape } = useResponsive();
    const insets = useSafeAreaInsets();
    const campos = [
        {
            key: 'nombre',
            label: 'Nombre del usuario',
            placeholder: 'Ingresa tu nombre'
        },
        {
            key: 'correo',
            label: 'Correo electrónico',
            placeholder: 'Ingresa tu correo electrónico'
        },
        {
            key: 'telefono',
            label: 'Número de teléfono',
            placeholder: 'Ingresa tu número de teléfono'
        }
    ];
    const [usuario, setUsuario] = useState([]);

    return (
        <View>
            <View style={{height: 200, backgroundColor: colors.primario}}/>
            <View style={styles.contenido}>
                <View style={styles.avatar}>
                    <Ionicons
                        name="person-outline"
                        size={50}
                        color={colors.primario}
                    />
                </View>
            
                <View style={{ paddingHorizontal, paddingBottom: Math.max(insets.bottom, spacing.md) }}>
                    <View style={{paddingTop:spacing.sm, paddingBottom:spacing.md, paddingVertical: spacing.md}}>
                        <Text>Crear Perfil</Text>
                        {campos.map((item) => (
                            <ProfileTextInput
                                key={item.key}
                                label={item.label}
                                value={item.value}
                                onChangeText={(text) => setUsuario({...usuario, [item.key]: text})}
                                placeholder={item.placeholder}
                            />
                        ))}
                    </View>
                    <Pressable style={styles.botonReservar}>
                        <Text style={styles.botonTexto}>Guardar</Text>
                    </Pressable>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    avatar:{
        alignItems: 'center',
        justifyContent: 'center',
        width: 100,
        height: 100,
        borderRadius: radius.full,
        alignSelf: 'center',
        marginTop: -70,
        backgroundColor: colors.primarioSuave,
    },
    contenido: {
        marginTop: -spacing.lg,
        paddingTop: spacing.lg,
        backgroundColor: colors.superficie,
        borderTopLeftRadius: radius.xl,
        borderTopRightRadius: radius.xl,
    },
    botonReservar: {
        backgroundColor: colors.primario,
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.lg,
        borderRadius: radius.md,
        alignItems: 'center'
    },
    botonTexto: { color: colors.superficie, fontSize: 16, fontWeight: '700' },
})