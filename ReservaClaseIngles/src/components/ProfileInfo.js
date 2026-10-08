import React from 'react'
import { View, Text, Pressable, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons';

import { colors,radius,spacing } from '../themes/index.js';

export default function ProfileInfo({etiqueta, valor, icono, onPress}){
    return (
        <View style={styles.card}>
            <Ionicons
            name={icono}
            size={22}
            color={colors.primario}
            />

            <View style={styles.informacion}>
                <Text style={styles.etiqueta}>
                {etiqueta}
                </Text>

                <Text style={styles.valor}>
                {valor}
                </Text>
            </View>
            
            <Pressable
                style={styles.editar}
                onPress={onPress}
            >
                <Text style={styles.editarTexto}>
                Editar
                </Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.md,
        borderWidth: 1,
        borderColor: colors.primario,
        borderRadius: radius.lg,
        padding: spacing.md,
        backgroundColor: colors.superficie,
        paddingVertical:spacing.md,
        marginBottom: spacing.md,
    },
    informacion: {
        flex: 1,
        gap: spacing.xs,
    },
    etiqueta: {
        fontSize: 13,
        color: colors.textoSuave,
    },
    valor: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.texto,
    },
    editar: {
        paddingHorizontal: spacing.sm,
        paddingVertical: spacing.sm,
    },
    editarTexto: {
        color: colors.primario,
        fontWeight: '600',
    },
});