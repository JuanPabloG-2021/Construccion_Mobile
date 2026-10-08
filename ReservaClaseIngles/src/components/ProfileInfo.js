import React from 'react'
import { View, Text, Pressable } from 'react-native'
import { Ionicons } from '@expo/vector-icons';

import { colors } from '../themes/index.js';

export default function ProfileInfo({etiqueta, valor, icono, onPress}){
    return(
        <View>
            <Ionicons name={icono} size={20} color={colors.primario} />
            <View>
                <Text>{etiqueta}</Text>
                <Text>{valor}</Text>
                <Pressable onPress={onPress}>
                    <Text>Editar</Text>
                </Pressable>
            </View>
        </View>
    )
}