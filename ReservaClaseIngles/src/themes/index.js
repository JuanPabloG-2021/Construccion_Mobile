import { Platform } from 'react-native';

export const colors = {
  fondo: '#13e0ef',
  superficie: '#ffffff',
  texto: '#111827',
  textoSuave: '#6b7280',
  border: '#bbecf0',
  borde: '#bbecf0',
  primario: '#007bff',
  primarioSuave: '#e6f2ff',
  estrella: '#f5a623',
  peligro: '#dc2626',
  deshabilitado: '#9ca3af',
};

// Espaciado: separación entre letras y componentes
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

export const radius = {
  sm: 4,
  md: 8,
  lg: 16,
  xl: 32,
  full: Platform.OS === 'ios' ? 9999 : 9999,
};

export const typography = {
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.texto,
  },
  cuerpo: {
    fontSize: 15,
    color: colors.texto,
  },
};

export default {
  colors,
  spacing,
  radius,
  typography,
};
