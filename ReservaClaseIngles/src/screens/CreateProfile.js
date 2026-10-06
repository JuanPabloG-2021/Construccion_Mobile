import React from 'react'
import { View, Text, Pressable } from 'react-native'
import {useState} from 'react' 

import ProfileTextInput from '../components/ProfileTextInput.js'
import { colors } from '../themes/index.js';

export default function CreateProfile() {
    const campos = [
        {
            key: 'nombre',
            label: 'Nombre del usuario',
            placeholder: 'Ingresa tu nombre'
        },
        {
            key: 'correo',
            label: 'Correo electrónico',
            placeholder: 'Ingresa tu correo electrónico'
        },
        {
            key: 'telefono',
            label: 'Número de teléfono',
            placeholder: 'Ingresa tu número de teléfono'
        }
    ];
    const [usuario, setUsuario] = useState([]);

    return (
        <View>
            <View style={{height: 180, backgroundColor: colors.primarioSuave}}/>
            <View>
                <Text>Crear Perfil</Text>
                {campos.map((item) => (
                    <ProfileTextInput
                        key={item.key}
                        label={item.label}
                        value={item.value}
                        onChangeText={(text) => setUsuario({...usuario, [item.key]: text})}
                        placeholder={item.placeholder}
                    />
                ))}
                <Pressable>
                    <Text>Guardar</Text>
                </Pressable>
            </View>
        </View>
    )
}