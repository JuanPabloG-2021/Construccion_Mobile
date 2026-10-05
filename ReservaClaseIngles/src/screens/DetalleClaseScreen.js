import React, {useState, useMemo} from 'react';
import { Text, View, StyleSheet, FlatList, Pressable, Image, Alert, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {EtiquetaNivel} from '../components/EtiquetaNivel.js';
import { NIVELES, CLASES, formatearPrecio } from "../data/clases.js";
import NivelChip from "../components/NivelChip";
import  useResponsive  from '../hooks/useResponsive.js';
import { colors, spacing, typography, sombra, radius } from '../themes/index.js';
import useReserva from '../hooks/useReserva.js';

export default function DetalleClaseScreen({ route, navigation }) {
  const { clase } = route.params;
  const { addReservation } = useReserva();
  const insets = useSafeAreaInsets();
  const { paddingHorizontal, isLandscape } = useResponsive();

  const [cupos, setCupos] = useState(clase.cupos);
  const [horario, setHorario] = useState(clase.horarios?.[0] ?? null);

  const agotada = cupos <= 0;
  const alturaPortada = isLandscape ? 300 : 240;

  const reservar = () => {
    if (agotada) return;
    const results = addReservation(clase, horario);
    if (!results.ok) {
      Alert.alert('Error al reservar', results.message);
      return;
    }
    console.log(clase.titulo, 'Horario:', horario);
    setCupos((actual) => Math.max(actual - 1, 0));
    Alert.alert(
    'Clase reservada',
    `Reservaste "${clase.titulo}"${horario ? ` para ${horario}` : ''}.`
    );
    };

  const datos = [
    { icono: 'time-outline', valor: `${clase.duracion} min`, etiqueta: 'Duración' },
    { icono: 'star', valor: clase.rating.toFixed(1), etiqueta: 'Valoración', colorIcono: colors.estrella },
    {
      icono: 'people-outline',
      valor: String(cupos),
      etiqueta: cupos === 1 ? 'Cupo' : 'Cupos',
      colorValor: cupos <= 2 ? colors.peligro : colors.texto,
    },
  ];

  return (
    <View style={styles.pantalla}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 + insets.bottom }}
      >
        {/* Portada */}
        <View>
          <Image
            source={{ uri: clase.imagen }}
            style={[styles.portada, { height: alturaPortada }]}
            resizeMode="cover"
          />
          
        </View>

        <View style={[styles.contenido, { paddingHorizontal }]}>
          {/* Encabezado */}
          <View style={styles.chips}>
            <View style={styles.chip}>
              <Text style={styles.chipTexto}>{clase.nivel}</Text>
            </View>
            <View style={styles.chip}>
              <Ionicons
                name={clase.modalidad === 'Virtual' ? 'videocam-outline' : 'location-outline'}
                size={14}
                color={colors.primario}
              />
              <Text style={styles.chipTexto}>{clase.modalidad}</Text>
            </View>
          </View>
          <Text style={styles.titulo}>{clase.titulo}</Text>

          {/* Datos clave */}
          <View style={styles.datos}>
            {datos.map((d, i) => (
              <View key={d.etiqueta} style={[styles.dato, i > 0 && styles.datoBorde]}>
                <Ionicons name={d.icono} size={20} color={d.colorIcono ?? colors.primario} />
                <Text style={[styles.datoValor, d.colorValor && { color: d.colorValor }]}>
                  {d.valor}
                </Text>
                <Text style={styles.datoEtiqueta}>{d.etiqueta}</Text>
              </View>
            ))}
          </View>

          {/* Descripción */}
          <Text style={styles.seccion}>Sobre la clase</Text>
          <Text style={styles.descripcion}>{clase.descripcion}</Text>

          {/* Profesor */}
          <Text style={styles.seccion}>Tu profesor</Text>
          <View style={styles.profesor}>
            <Image source={{ uri: clase.profesor.foto }} style={styles.avatar} />
            <View style={{ flex: 1 }}>
              <Text style={styles.profesorNombre}>{clase.profesor.nombre}</Text>
              <View style={styles.profesorPais}>
                <Ionicons name="earth-outline" size={14} color={colors.textoSuave} />
                <Text style={styles.profesorPaisTexto}>{clase.profesor.pais}</Text>
              </View>
            </View>
          </View>

          {/* Horarios */}
          <Text style={styles.seccion}>Elige tu horario</Text>
          <View style={styles.horarios}>
            {clase.horarios.map((h) => {
              const activo = h === horario;
              console.log('Horario:', h, 'Activo:', activo);
              return (
                <Pressable
                  key={h}
                  onPress={() => setHorario(h)}
                  style={[styles.horario, activo && styles.horarioActivo]}
                  accessibilityRole="button"
                  accessibilityState={{ selected: activo }}
                >
                  <Ionicons
                    name="calendar-outline"
                    size={16}
                    color={activo ? colors.superficie : colors.primario}
                  />
                  <Text style={[styles.horarioTexto, activo && styles.horarioTextoActivo]}>{h}</Text>
                </Pressable>
              );
            })}
          </View>
        </View>
      </ScrollView>

      {/* Barra inferior */}
      <View
        style={[
          styles.barra,
          { paddingHorizontal, paddingBottom: Math.max(insets.bottom, spacing.md) },
        ]}
      >
        <View style={{ flex: 1 }}>
          <Text style={styles.precioEtiqueta}>Precio por clase</Text>
          <Text style={styles.precio}>{formatearPrecio(clase.precio)}</Text>
        </View>
        <Pressable
          onPress={reservar}
          disabled={agotada}
          style={({ pressed }) => [
            styles.botonReservar,
            agotada && styles.botonDeshabilitado,
            pressed && !agotada && { opacity: 0.85 },
          ]}
          accessibilityRole="button"
          accessibilityState={{ disabled: agotada }}
        >
          <Text style={styles.botonTexto}>{agotada ? 'Sin cupos' : 'Reservar clase'}</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  pantalla: { flex: 1, backgroundColor: colors.superficie },
  portada: { width: '100%', backgroundColor: colors.primarioSuave },
  botonAtras: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderRadius: radius.full,
    backgroundColor: colors.superficie,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  contenido: {
    marginTop: -spacing.lg,
    paddingTop: spacing.lg,
    backgroundColor: colors.superficie,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
  },
  chips: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.sm },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: colors.primarioSuave,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm + 2,
    borderRadius: radius.full,
  },
  chipTexto: { fontSize: 12, fontWeight: '700', color: colors.primario },
  titulo: { ...typography.titulo, marginBottom: spacing.md },

  datos: {
    flexDirection: 'row',
    backgroundColor: colors.superficie,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.borde,
    paddingVertical: spacing.md,
  },
  dato: { flex: 1, alignItems: 'center', gap: 2 },
  datoBorde: { borderLeftWidth: 1, borderLeftColor: colors.borde },
  datoValor: { fontSize: 16, fontWeight: '800', color: colors.texto },
  datoEtiqueta: { fontSize: 12, color: colors.textoSuave },

  seccion: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.texto,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  descripcion: { ...typography.cuerpo, color: colors.textoSuave, lineHeight: 22, textAlign: 'left' },

  profesor: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.primarioSuave,
    borderRadius: radius.lg,
    padding: spacing.md,
  },
  avatar: { width: 56, height: 56, borderRadius: 28, backgroundColor: colors.borde },
  profesorNombre: { fontSize: 16, fontWeight: '700', color: colors.texto },
  profesorPais: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, marginTop: 2 },
  profesorPaisTexto: { fontSize: 13, color: colors.textoSuave },

  horarios: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  horario: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs + 2,
    paddingVertical: spacing.sm + 2,
    paddingHorizontal: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.borde,
    backgroundColor: colors.superficie,
  },
  horarioActivo: { backgroundColor: colors.primario, borderColor: colors.primario },
  horarioTexto: { fontSize: 14, fontWeight: '600', color: colors.texto },
  horarioTextoActivo: { color: colors.superficie },

  barra: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.superficie,
    borderTopWidth: 1,
    borderTopColor: colors.borde,
    paddingTop: spacing.md,
  },
  precioEtiqueta: { fontSize: 12, color: colors.textoSuave },
  precio: { fontSize: 18, fontWeight: '800', color: colors.primario },
  botonReservar: {
    backgroundColor: colors.primario,
    paddingVertical: spacing.md - 2,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.md,
  },
  botonDeshabilitado: { backgroundColor: colors.deshabilitado },
  botonTexto: { color: colors.superficie, fontSize: 16, fontWeight: '700' },
});