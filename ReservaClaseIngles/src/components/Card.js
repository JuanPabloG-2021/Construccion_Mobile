import { Image, Pressable, Text, View, StyleSheet } from 'react-native';
import { formatearPrecio } from "../data/clases";
import EtiquetaNivel from "./EtiquetaNivel";
import { colors, spacing, radius } from '../themes/index.js';


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

 export default function Card({clase, onPress}){
    return(
        <Pressable
            onPress={onPress}
            style={({pressed}) => [
                styles.container,
                pressed && styles.pressed
            ]}>
           <Image source={{uri: clase.imagen}}/>
           <View>
                <EtiquetaNivel nivel={clase.nivel} />
                <Text>{clase.nivel}</Text>
                <Text>{clase.profesor.nombre}</Text>
                <Text>{formatearPrecio(clase.precio)}</Text>
            </View>     

        </Pressable>
    )
 }