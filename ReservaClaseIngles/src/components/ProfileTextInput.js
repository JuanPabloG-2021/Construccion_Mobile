import React from "react";
import { View, Pressable, Text, TextInput, StyleSheet } from "react-native";
import { colors, spacing, radius } from "../themes/index.js";

const styles = StyleSheet.create({
    campo: {
        gap: spacing.xs,
        marginBottom: spacing.md,
    },

    label: {
        fontSize: 14,
        fontWeight: '600',
        color: colors.texto,
    },

    input: {
        backgroundColor: colors.superficie,
        borderWidth: 2,
        borderColor: colors.primarioSuave,
        borderRadius: radius.md,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        fontSize: 16,
        color: colors.texto,
    },
});

export default function ProfileTextInput({ label, value, onChangeText, placeholder,keyboard }) {
    return (
        <View style={styles.campo}>
            <Text style={styles.label}>
                {label}
            </Text>

            <TextInput
                style={styles.input}
                value={value}
                onChangeText={onChangeText}
                placeholder={placeholder}
                autoCorrect={false}
                autoComplete="off"
                keyboardType={keyboard}
            />
        </View>
    )
}