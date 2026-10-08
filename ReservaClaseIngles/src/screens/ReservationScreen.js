import React from 'react'
import { FlatList, Pressable } from 'react-native'
import { View, Text, StyleSheet, Image } from 'react-native'
import { Ionicons } from '@expo/vector-icons'

import useReserva from '../hooks/useReserva.js';
import { colors, radius, spacing } from '../themes/index.js';
import { formatearPrecio } from "../data/clases.js";

export default function ReservationScreen({navigation}) {
    const { reservas, loading, clearReservations, removeReservation } = useReserva();

    console.log(reservas)
    if(!reservas){
        return (
            <View style={styles.pantalla}>
                <View style={styles.contenidoVacio}>
                    <EstadoVacio
                        icono="calendar-clear-outline"
                        titulo="Aún no has reservado ninguna clase"
                        mensaje="Explora nuestro catalogo de clases para realizar tu reserva"
                    />
                    <Pressable
                        style={styles.boton}
                        onPress={() => navigation.navigate('ClasesScreen')}    
                    >
                        <Text style={styles.botonTexto}>Explorar clases</Text>
                    </Pressable>
                </View>
            </View>
        );
    }

    return (
        <View
            style={styles.screen}
        >
            <FlatList
                data={reservas}
                contentContainerStyle={styles.list}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                <View style={styles.card}>
                    <View style={styles.level}>
                        <Text style={styles.textLevel}>
                            {item.level}
                        </Text>
                    </View>

                    <View>
                        <Text style={styles.title}>{item.title}</Text>
                    
                        <View style={styles.teacher}>
                            <Image source={{ uri: item.avatar }} style={styles.avatar} />
                            <Text style={styles.teacherName}>{item.teacher}</Text>
                        </View>
                    </View>    
                    
                    <View style={styles.timeData}>
                        <Ionicons name="calendar-outline" size={20} color={colors.primario} />
                        <Text style={styles.data}>{item.schedule}</Text>
                        <Ionicons name="time-outline" size={20} color={colors.primario} />
                        <Text style={styles.data}>{item.duration} min</Text>
                    </View>
                    
                    <View style={styles.foot}>
                        <Text style={styles.price}>{formatearPrecio(item.price)}</Text>
                        <View>
                            <Pressable 
                                style={styles.cancelButton}
                                onPress={() => removeReservation(item.id)}
                            >
                                <Text style={styles.cancelButtonText}>Cancelar</Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
                )}
            />
            <Pressable
                style={styles.cancelButton}
                onPress={() => {clearReservations();}}
            >
                <Text
                    style={styles.cancelButtonText}
                >
                    Clear Reservations
                </Text>
            </Pressable>
        </View>
    )
}

const styles = StyleSheet.create({
    screen: { flex: 1, backgroundColor: colors.superficie },
    list: {
        padding: spacing.md,
        gap: spacing.md,
    },
    card: {
        backgroundColor: colors.superficie,
        borderRadius: radius.lg,
        padding: spacing.md,
        borderWidth: 1,
        borderColor: colors.borde,
        gap: spacing.md,
    },
    level: {
        alignSelf: 'flex-start',
        backgroundColor: colors.primarioSuave,
        paddingHorizontal: spacing.sm,
        paddingVertical: spacing.xs,
        borderRadius: radius.full,
    },
    textLevel: {
        color: colors.primario,
        fontSize: 12,
        fontWeight: '700',
    },
    title: {
        fontSize: 18,
        fontWeight: '700',
        color: colors.texto,
        marginBottom: spacing.sm,
    },
    teacher: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
    },
    teacherName: {
        fontSize: 14,
        color: colors.textoSuave,
    },
    data: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.xs,
    },
    timeData: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
    },
    avatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.borde },
    foot: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: spacing.sm,
        borderTopWidth: 1,
        borderTopColor: colors.borde,
    },
    price: {
        fontSize: 18,
        fontWeight: '800',
        color: colors.primario,
    },
    cancelButton: {
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.md,
        borderRadius: radius.md,
        borderWidth: 1,
        borderColor: colors.peligro,
    },
    cancelButtonText: {
        color: colors.peligro,
        fontWeight: '600',
    }
})