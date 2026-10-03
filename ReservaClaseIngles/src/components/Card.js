import React from 'react';
import { Image, Pressable, Text, View, StyleSheet } from 'react-native';
import { formatearPrecio } from "../data/clases";
import EtiquetaNivel from "./EtiquetaNivel";
import { colors, spacing, radius, typography } from '../themes/index.js';

 export default function Card({clase, onPress}){
    return(
        <Pressable
            onPress={onPress}
            style={({pressed}) => [
                styles.container,
                pressed && styles.pressed
            ]}>
           <Image source={{uri: clase.imagen}} style={{width:'100%', height:190}}/>
           <View>
                <EtiquetaNivel nivel={clase.nivel} />
                <Text>{clase.nivel}</Text>
                <Text>{clase.profesor.nombre}</Text>
                <Text>{formatearPrecio(clase.precio)}</Text>
            </View>     

        </Pressable>
    )
 }

  const styles = StyleSheet.create({
   container: {
     backgroundColor: colors.primarioSuave,
     borderRadius: radius.md,
     padding: spacing.md,
     margin: spacing.sm,
   },
   pressed: {
     backgroundColor: colors.superficiePresionada,
   },
 });