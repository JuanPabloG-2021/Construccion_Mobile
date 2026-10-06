import React from 'react'
import { View, Text, Pressable } from 'react-native'
import { Ionicons } from '@expo/vector-icons';

import { colors } from '../themes/index.js';

export default function ProfileInfo({etiqueta, valor, icono, onPress}){
    return(
        <View>
            <Text>{etiqueta}</Text>
            <Text>{valor}</Text>
            <Ionicons name={icono} size={20} color={colors.primario} />
            <Pressable onPress={onPress}>
                <Text>Editar</Text>
            </Pressable>
        </View>
    )
}