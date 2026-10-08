import React from 'react'
import { View, Text, Pressable, StyleSheet, Alert } from 'react-native'
import { Ionicons } from '@expo/vector-icons';
import {useState} from 'react' 
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import ProfileTextInput from '../components/ProfileTextInput.js'
import  useResponsive  from '../hooks/useResponsive.js';
import { colors, radius, spacing } from '../themes/index.js';
import useProfile from '../hooks/useProfile.js';

export default function CreateProfile({navigation}) {
    const [user, setUser] = useState({
        nombre: '',
        correo: '',
        telefono: ''
    });
    const { paddingHorizontal, isLandscape } = useResponsive();
    const {profile, createProfile} = useProfile();

    const insets = useSafeAreaInsets();
    const campos = [
        {
            key: 'nombre',
            label: 'Nombre del usuario',
            placeholder: 'Ingresa tu nombre',
            keyboard: 'default'
        },
        {
            key: 'correo',
            label: 'Correo electrónico',
            placeholder: 'Ingresa tu correo electrónico',
            keyboard:'email-address'
        },
        {
            key: 'telefono',
            label: 'Número de teléfono',
            placeholder: 'Ingresa tu número de teléfono',
            keyboard:'phone-pad'
        }
    ];
    const handleCreateProfile = async () => {
        const hayCamposVacios = Object.values(user).some(
        (value) => !value || value.trim() === ''
        );
        if (hayCamposVacios) {
        Alert.alert(
        'Perfil incompleto',
        'No se pudo crear el perfil porque uno o más campos están vacíos.'
        );
        return;
        }
        await createProfile(user);
        Alert.alert(
        '¡Gracias!',
        'El perfil ha sido creado correctamente.'
        );
        navigation.navigate('ProfileScreen');
        };
    
    console.log(user)

    return (
        <View>
            <View style={{height: 200, backgroundColor: colors.primario}}/>
            <View style={styles.contenido}>
                <View style={styles.avatar}>
                    <Ionicons
                        name="person-outline"
                        size={50}
                        color={colors.primario}
                    />
                </View>
            
                <View style={{ paddingHorizontal, paddingBottom: Math.max(insets.bottom, spacing.md) }}>
                    <View style={{paddingTop:spacing.sm, paddingBottom:spacing.md, paddingVertical: spacing.md}}>
                        <Text>Crear Perfil</Text>
                        {campos.map((item) => (
                            <ProfileTextInput
                                key={item.key}
                                label={item.label}
                                value={user[item.key]}
                                onChangeText={(text) => setUser({...user, [item.key]: text})}
                                placeholder={item.placeholder}
                                keyboard={item.keyboard}
                            />
                        ))}
                    </View>
                    <Pressable 
                        style={styles.botonReservar}
                        onPress={()=>{handleCreateProfile();}}
                    >
                        <Text style={styles.botonTexto}>Guardar</Text>
                    </Pressable>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    avatar:{
        alignItems: 'center',
        justifyContent: 'center',
        width: 100,
        height: 100,
        borderRadius: radius.full,
        alignSelf: 'center',
        marginTop: -70,
        backgroundColor: colors.primarioSuave,
    },
    contenido: {
        marginTop: -spacing.lg,
        paddingTop: spacing.lg,
        backgroundColor: colors.superficie,
        borderTopLeftRadius: radius.xl,
        borderTopRightRadius: radius.xl,
    },
    botonReservar: {
        backgroundColor: colors.primario,
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.lg,
        borderRadius: radius.md,
        alignItems: 'center'
    },
    botonTexto: { color: colors.superficie, fontSize: 16, fontWeight: '700' },
})