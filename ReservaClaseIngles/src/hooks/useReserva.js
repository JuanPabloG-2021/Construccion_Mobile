import {useContext} from 'react';
import { ReservasContext } from '../contexts/ReservasContext.js';

export default function useReserva(){
    const context = useContext(ReservasContext);
    if(!context){
        throw new Error('useReserva must be used within a ReservasProvider')
    }

    return context;
};