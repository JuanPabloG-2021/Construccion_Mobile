import React, {useState, useMemo} from 'react';
import { Text, View, StyleSheet, FlatList, Pressable, Image, Alert, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {EtiquetaNivel} from '../components/EtiquetaNivel.js';
import { NIVELES, CLASES, formatearPrecio } from "../data/clases.js";
import NivelChip from "../components/NivelChip";
import  useResponsive  from '../hooks/useResponsive.js';
import { colors, spacing, typography, sombra, radius } from '../themes/index.js';

export default function DetalleClaseScreen({route, navigation}) {
    const {clase} = route.params;
    const insets = useSafeAreaInsets();
    const {paddingHorizontal} = useResponsive();

    return(
        <View style={[
            styles.pantalla,
            { paddingTop: insets.top + spacing.md, paddingHorizontal }
        ]}>
            <ScrollView
                ShowsVerticalScrollIndicator={false}
                contentContainerStyle={{paddingBottom:120}}
            >
              
              <View>
                <Text>{clase.titulo}</Text>
                <Text>{clase.descripcion}</Text>
              </View>
              <View style={styles.dato}>
                <Ionicons name="today-outline" size={24} color={colors.primario} />
                <Text style={styles.datoValor}>Horarios: {clase.horarios}</Text>
              </View>
              <Image source={{uri:clase.imagen}} resizeMode="cover" style={styles.portada}/>
                <ScrollView
                ShowsVerticalScrollIndicator={false}
                contentContainerStyle={{paddingBottom:60}}
                >
                <View style={styles.datos}>
                  <Image source={{uri:clase.profesor.foto}} style={{width: 100,height: 100,}}/>
                  <Text style={styles.profesorNombre}>{clase.profesor.nombre} {clase.profesor.apellido}</Text>
                  <Pressable style={styles.botonReservar}>
                        <Text>Reservar Clase</Text>
                      </Pressable>
                </View>
                </ScrollView>
                <View style={styles.datos}>
                    <View style={styles.dato}>
                        <Ionicons name="time-outline" size={24} color={colors.primario} />
                        <Text style={styles.datoValor}>{clase.duracion}</Text>
                    </View>
                    <View style={styles.dato}>
                        <Ionicons name="people-outline" size={24} color={colors.primario} />
                        <Text style={styles.datoValor}>{clase.cupos}</Text>
                    </View>
                    <View style={styles.dato}>
                        <Ionicons name="cash-outline" size={24} color={colors.primario} />
                        <Text style={styles.datoValor}>{formatearPrecio(clase.precio)}</Text>
                    </View>
                </View>
            </ScrollView>
        </View>
    )
}    

const styles = StyleSheet.create({
  pantalla: { flex: 1, backgroundColor: colors.fondo },
  portada: { width: '100%', backgroundColor: colors.primarioSuave },
  datos: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: colors.superficie,
    borderRadius: radius.lg,
    paddingVertical: spacing.lg,
  },
  dato: { alignItems: 'center', gap: 2 },
  datoValor: { fontSize: 16, fontWeight: '800', color: colors.texto },
  profesor: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.superficie,
    borderRadius: radius.lg,
    padding: spacing.lg,
  },
  avatar: { width: 48, height: 48, borderRadius: 24, backgroundColor: colors.borde },
  profesorNombre: { fontSize: 15, fontWeight: '700', color: colors.texto },
  descripcion: { ...typography.cuerpo, color: colors.textoSuave, lineHeight: 22, marginTop: spacing.sm },
  barra: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.superficie,
    borderTopWidth: 1,
    borderTopColor: colors.borde,
    paddingVertical: spacing.lg,
    paddingTop: spacing.lg
  },
  precio: { fontSize: 18, fontWeight: '800', color: colors.primario },
  botonReservar: {
    backgroundColor: colors.primario,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.md,
  },
});

 //quiere la foto del profesor y al lado de la foto del profesor quiere el nombre y apellido
                //quiere el precio
                //duracion
                //los cupos
                //horario
                //boton que se llame Reservar Clase.