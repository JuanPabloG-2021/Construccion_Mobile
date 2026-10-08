import {useContext} from 'react';
import { ProfileContext } from '../contexts/ProfileContext.js';

export default function useProfile(){
    const context = useContext(ProfileContext);
    if(!context){
        throw new Error('useReserva must be used within a ReservasProvider')
    }

    return context;
};