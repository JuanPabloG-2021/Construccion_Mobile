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
    const [cupos, setCupos] = useState(clase.cupos);

    return(
        <View 
          style={[
            styles.pantalla,
            { paddingTop: insets.top + spacing.md, paddingHorizontal }
        ]}>
          
            <ScrollView
                ShowsVerticalScrollIndicator={false}
                contentContainerStyle={{paddingBottom:120}}
            >
              <View>
                <Text style={{textAlign:'center', fontSize:24, fontWeight:'bold'}}>{clase.titulo}</Text>
              </View>
              <View><Image source={{uri:clase.imagen}} resizeMode="cover" style={{width: '100%', height: 200}} /></View>
              
              <View 
                style={[
                  styles.datos, 
                  {
                    alignItems:'center', 
                    gap:spacing.md, 
                    marginBottom:spacing.md
                  }
                ]}
              >
                <Text style={[styles.descripcion, {flex:1, flexWrap:'wrap'}]}>{clase.descripcion}</Text>
              </View>

              <View style={styles.dato}>
                <Ionicons name="today-outline" size={24} color={colors.primario} />
                <Text style={styles.datoValor}>Horarios: {clase.horarios}</Text>
              </View>

              <View style={
                styles.datos
                }
              >
                <Image source={{uri:clase.profesor.foto}} style={styles.avatar}/>
                <Text style={styles.profesorNombre}>{clase.profesor.nombre} {clase.profesor.apellido}</Text>
              </View>
              

              <View style={styles.datos}>
                  <View style={styles.dato}>
                      <Ionicons name="time-outline" size={24} color={colors.primario} />
                      <Text style={styles.datoValor}>{clase.duracion}</Text>
                  </View>
                  <View style={styles.dato}>
                      <Ionicons name="people-outline" size={24} color={colors.primario} />
                      <Text style={styles.datoValor}>
                        {cupos === 0 ? 'No hay cupos disponibles' : `${cupos} cupos disponibles`}
                      </Text>
                  </View>
                  <View style={styles.dato}>
                      <Ionicons name="cash-outline" size={24} color={colors.primario} />
                      <Text style={styles.datoValor}>{formatearPrecio(clase.precio)}</Text>
                  </View>
              </View>
              <View>
                {cupos > 0 && (
                  <Pressable 
                  style={[
                    styles.botonReservar, 
                    {height: 50, justifyContent: 'center', alignItems: 'center'}
                    ]}
                    onPress={() => {
                      setCupos(cupos - 1), Alert.alert('Reserva exitosa', `Has reservado la clase. Te quedan ${cupos - 1} cupos disponibles.`)
                    }}
                    >
                    <Text 
                      style={{
                        color: colors.superficie, 
                        fontWeight: 'bold'
                        }}
                    >
                      Reservar Clase
                    </Text>
                  
                </Pressable>
                )}
              </View>
            </ScrollView>
        </View>
    )
}    

const styles = StyleSheet.create({
  pantalla: { flex: 1, backgroundColor: colors.superficie },
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
  avatar: { width: 48, height: 48, borderRadius: 24, backgroundColor: colors.border },
  profesorNombre: { fontSize: 15, fontWeight: '700', color: colors.texto },
  descripcion: { ...typography.cuerpo, color: colors.textoSuave, lineHeight: 22, marginTop: spacing.sm, flexShrink: 1, flexWrap: 'wrap', textAlign: 'left' },
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