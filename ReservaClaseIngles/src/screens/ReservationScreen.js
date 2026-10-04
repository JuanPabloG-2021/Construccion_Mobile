import React from 'react'
import { FlatList } from 'react-native'
import { View, Text } from 'react-native'

import useReserva from '../hooks/useReserva.js';

export default function ReservationScreen() {
    const { reservas, loading } = useReserva();

    return (
        <FlatList
            data={reservas}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
            <View>
            <Text>{item.title}</Text>
            <Text>{item.teacher}</Text>
            <Text>{item.level}</Text>
            <Text>{item.schedule}</Text>
            </View>
            )}
        />
    )
}