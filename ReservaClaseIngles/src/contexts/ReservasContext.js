import React, {createContext, useState, useEffect, useMemo, useCallback} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY_RESERVATIONS = '@reservations_mj20';

export const ReservasContext = createContext();

export function ReservasProvider({children}){
    const [reservas, setReservas] = useState([]);
    const [loading, setLoading] = useState(true);

    //Crear la funcion de cargar
    useEffect(() => {
        const loadReservations = async () => {
            try{
                const storedReservations = await AsyncStorage.getItem(KEY_RESERVATIONS);
                if (storedReservations!==null){
                    setReservas(JSON.parse(storedReservations));
                }
            }
            catch (error) {
                console.log('Error al cargar las reservas: ', error);
            }
            finally{
                setLoading(false);
            }
        }
        loadReservations();
    }, []);

    //Guardar cada vez que cambie el arreglo de reservas
    useEffect(()=>{
        if(loading) return;
        AsyncStorage.setItem(KEY_RESERVATIONS, JSON.stringify(reservas)).catch((error) => (
            console.log('Error al guardar la reserva:', error)
        ))
    },[reservas, loading])

    const addReservation = useCallback((clase, horario)=>{
        const newReservation = {
            id: clase.id + ' ' + horario,
            title: clase.titulo,
            level: clase.nivel,
            teacher: clase.profesor.nombre,
            price: clase.precio,
            schedule: horario,
            creadoEn: new Date().toISOString()
        }
        let results = {ok:true}
        setReservas((prevReservations) => {
            if(prevReservations.some((r)=> r.id === newReservation.id)){
                results = {ok: false}
                return prevReservations;
            }
            return [newReservation, ...prevReservations]
        })
    },[])    

    return (
        <ReservasContext.Provider
            value={{
            reservas,
            loading,
            addReservation
            }}>
                {children}
        </ReservasContext.Provider>
    );
}//llave de cierre ReservasProvider