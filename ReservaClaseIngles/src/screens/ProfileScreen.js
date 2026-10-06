import React from 'react'
import { View, Text, Pressable, StyleSheet } from 'react-native'

import {colors, spacing, radius} from '../themes/index'
import EstadoVacio from '../components/EstadoVacio'

export default function ProfileScreen({navigation}) {
    return (
        <View style={styles.pantalla}>
            <View style={styles.contenido}>
                <EstadoVacio
                    icono="person-outline"
                    titulo="Aún no tienes un perfil"
                    mensaje="Crea tu perfil para gestionar tu información personal."
                />
                <Pressable
                    style={styles.boton}
                    onPress={() => navigation.navigate('CreateProfileScreen')}    
                >
                    <Text style={styles.botonTexto}>Crear perfil</Text>
                </Pressable>
            </View>
        </View>
    )
}
const styles = StyleSheet.create({
    pantalla: {
        flex: 1,
        backgroundColor: colors.superficie,
        justifyContent: 'center'
    },
    contenido: {
        paddingHorizontal: spacing.lg,
        alignItems: 'center',
    },
    boton: {
        backgroundColor: colors.primario,
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.xl,
        borderRadius: radius.md,
        marginTop: spacing.md,
    },
    botonTexto: {
        color: colors.superficie,
        fontSize: 16,
        fontWeight: '700',
    },
});