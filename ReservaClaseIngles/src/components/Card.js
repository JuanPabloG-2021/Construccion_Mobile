import { Image, Pressable, Text, View } from 'react-native';
import { formatearPrecio } from "../data/clases";
import EtiquetaNivel from "./EtiquetaNivel";

const Card= () => {
    return(
        <div>
            <EtiquetaNivel nivel="Nivel 1" />
        </div>
    )
 }

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