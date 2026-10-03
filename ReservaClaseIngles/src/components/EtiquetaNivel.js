import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { colors, spacing, radius } from "../themes";


export default function EtiquetaNivel({nivel}) {
    return(
        <View style={[styles.container, { backgroundColor: colors.primario }]}>
            <Text style={styles.text}>{nivel}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        alignSelf:'auto',
        backgroundColor: colors.fondo,
        paddingVertical: 3,
        paddingHorizontal: spacing.md,
        borderWidth: 1,
        borderRadius: radius.sm,
    },
    text: {
        fontSize: 11,
        fontWeight: '700',
        letterSpacing: 0.3,
        color: '#FFFFFF'
    }
});