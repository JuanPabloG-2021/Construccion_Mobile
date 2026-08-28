import { Platform } from 'react-native';

export const color = {
    fondo: '#13e0ef',
    superficie: '#ffffff',
    texto: '#111827',
    border: '#bbecf0',
}

//Espaciado: separacion de letras y componentes

export const spacing = {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32
}

export const radius = {
    sm: 4,
    md: 8,
    lg: 16,
    xl: 32,
    full: Platform.OS === 'ios' ? 9999 : 9999 //9999 por defecto
}

export const typography = {
    titulo: {
        fontSize: 24,
        fontWeight: 'bold'/*800*/,
        color: color.texto,
    }
}

export default {
    colors,
    spacing,
    radius,
    typography
}