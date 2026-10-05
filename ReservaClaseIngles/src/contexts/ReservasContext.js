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
            avatar: clase.profesor.foto,
            price: clase.precio,
            duration: clase.duracion,
            schedule: horario,
            creadoEn: new Date().toISOString()
        }
        const convertHoursToMinutes = (horaTexto) => {
        const [minutesAndHours, periodo] = horaTexto.split(' ');
        const [Hours, minutes  ] = minutesAndHours.split(':');

        let hour24 = parseInt(Hours);
        const minutesNumber = parseInt(minutes);

        if (periodo === 'p.m.' && hour24 !== 12) {
        hour24 += 12;
        }
        
        if (periodo === 'a.m.' && hour24 === 12) {
        hour24 = 0;
        }
        
        return hour24 * 60 + minutesNumber;
        };

        //sacar el dia Nuevo y la Hora inicio y Fin Nuevo
        const [newDay, ...remainingSchedule] = horario.split(' ');
        const newHour = convertHoursToMinutes(remainingSchedule.join(' '));
        const newEndTime = newHour + clase.duracion;

        //Verificar si hay conflicto con las reservas existentes
        const verifyConflict = reservas.some((reserva) => {
            const [existingDay, ...existingSchedule] = reserva.schedule.split(' ');
            const existingHour = convertHoursToMinutes(existingSchedule.join(' '));
            const existingEndTime = existingHour + reserva.duration;
            return (
                existingDay === newDay &&
                newHour < existingEndTime &&
                newEndTime > existingHour
            );
        });

        console.log('Nuevo horario:', horario);
        reservas.forEach((reserva) => {
            console.log('Horario reservado:', reserva.schedule);
        });
        console.log('Conflicto de horario:', verifyConflict);
        let results = {ok:true}
        if(verifyConflict){
            return{
                results: {ok:false},
                message: 'Conflicto de horario con otra reserva existente.'
            };
        }
        setReservas((prevReservations) => {
            if(prevReservations.some((r)=> r.id === newReservation.id)){
                results = {ok: false}
                return prevReservations;
            }
            return [newReservation, ...prevReservations]
        })

        return {
        ok: true
        };
    },[reservas]);

    const clearReservations = async () => {
        await AsyncStorage.removeItem(KEY_RESERVATIONS);
        setReservas([]);
    };

    const removeReservation = useCallback((reservationId) => {
        setReservas((prevReservations) => prevReservations.filter((reserva) => reserva.id !== reservationId));
    }, []);

    return (
        <ReservasContext.Provider
            value={{
            reservas,
            loading,
            addReservation,
            clearReservations,
            removeReservation
            }}>
                {children}
        </ReservasContext.Provider>
    );

}//llave de cierre ReservasProvider