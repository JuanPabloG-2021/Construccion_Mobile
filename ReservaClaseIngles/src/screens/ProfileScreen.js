import React from 'react'
import { View, Text, Pressable, StyleSheet, Image } from 'react-native'

import {colors, spacing, radius} from '../themes/index'
import ProfileInfo from '../components/ProfileInfo'
import EstadoVacio from '../components/EstadoVacio'
import useProfile from '../hooks/useProfile'

export default function ProfileScreen({navigation}) {
    const profileFields = [
        {
            key: 'nombre',
            etiqueta: 'Nombre',
            icono: 'person-outline'
        },
        {
            key: 'correo',
            etiqueta: 'Correo electrónico',
            icono: 'mail-outline'
        },
        {
            key: 'telefono',
            etiqueta: 'Teléfono',
            icono: 'call-outline'
        }];

    const {profile, ready, clearData} = useProfile();

    if (!ready) {
        return <Text>Cargando...</Text>;
    }

    if (!profile) {
        return (
            <View style={styles.pantalla}>
                <View style={styles.contenido}>
                    <EstadoVacio
                        icono="person-outline"
                        titulo="Aún no tienes un perfil"
                        mensaje="Crea tu perfil para gestionar tu información personal."
                    />
                    <Pressable
                        style={styles.boton}
                        onPress={() => navigation.navigate('CreateProfileScreen')}    
                    >
                        <Text style={styles.botonTexto}>Crear perfil</Text>
                    </Pressable>
                </View>
            </View>
        );
    }
    return (
        <View>
            <View style={{height: 200, backgroundColor: colors.primario}}/>
            <View style={styles.contenido}>
                <View >
                    <Image source={require('../../assets/Profile.jpg')} style={styles.avatar}/>
                </View>
                {profileFields.map((item) => (
                    <ProfileInfo
                        key={item.key}
                        etiqueta={item.etiqueta}
                        valor={profile[item.key]}
                        icono={item.icono}
                        onPress={() => {}}
                    />
                ))}
                

                <Pressable
                    onPress={() => {clearData();}}
                >
                    <Text>Clear Reservations</Text>
                </Pressable>
            </View>
        </View>
        
    );
}
const styles = StyleSheet.create({
    avatar: {
        width: 150,
        height: 150,
        borderRadius: 80,
        alignSelf: 'center',
        marginTop: -90,
        borderWidth: 4,
        borderColor: colors.superficie,
    },
    contenido: {
        marginTop: -spacing.lg,
        paddingTop: spacing.lg,
        backgroundColor: colors.superficie,
        borderTopLeftRadius: radius.xl,
        borderTopRightRadius: radius.xl,
    },
    pantalla: {
        flex: 1,
        backgroundColor: colors.superficie,
        justifyContent: 'center'
    },
    boton: {
        backgroundColor: colors.primario,
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.xl,
        borderRadius: radius.md,
        marginTop: spacing.md,
    },
    botonTexto: {
        color: colors.superficie,
        fontSize: 16,
        fontWeight: '700',
    },
});