import React from 'react'
import { View, Text, Pressable } from 'react-native'

export default function ProfileScreen() {
    return (
        <View>
            <Text>Perfil del usuario</Text>
            <Image/>
            <View>
                <Text>nombre del usuario</Text>
                <Pressable>
                    <Text>Editar</Text>
                </Pressable>
            </View>
            <View>
                <Text>correo del usuario</Text>
                <Pressable>
                    <Text>Editar</Text>
                </Pressable>
            </View>
            <View>
                <Text>teléfono del usuario</Text>
                <Pressable>
                    <Text>Editar</Text>
                </Pressable>
            </View>
        </View>
    )
}