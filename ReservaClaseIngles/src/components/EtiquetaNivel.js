import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { color, spacing } from "../themes";

const styles = StyleSheet.create({
    container: {
        alignSelf:'auto',
        backgroundColor: color.fondo,
        paddingVertical: 3,
        paddingHorizontal: spacing.md,
        borderWidth: 1,
        borderRadius: radius.sm,
    },
    text: {
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: 0.3,
    }
});

export default function EtiquetaNivel({nivel}) {
    return(
        <View style={styles.container}>
            <Text style={styles.text}>{nivel}</Text>
        </View>
    )
}