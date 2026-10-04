import {useState, useEffect, useCallback} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function useAsyncStorage(key, initialValue){
    const [storedValue, setStoredValue] = useState(initialValue);
    const [ready, setReady] = useState(false);


    useEffect(()=>{
        let active = true;
        AsyncStorage.getItem(key)
            .then((saving) => {
                if(active && saving !==null){
                    setStoredValue(JSON.parse(saving));
                }
            })
            .catch((error) => {
                console.log('Error al cargar el valor de AsyncStorage: ' + key, error);
            })
            .finally(()=> active && setReady(true));

            return () => {
                active = false;
            }
    }, [key]);    

    const update = useCallback(
        async(newValue) => {
            setStoredValue(newValue);
            try{
                await AsyncStorage.setItem(key, JSON.stringify(newValue));
            }catch(error){
                console.log('Error al guardar el valor en AsyncStorage: ' + key, error);
            }
        }, [key]);

    return [storedValue, update, ready];
    
}