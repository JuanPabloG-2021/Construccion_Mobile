import React, { createContext } from 'react';

import useStorage from '../hooks/useStorage';

const KEY_PROFILE = '@profile_mj20';

export const ProfileContext = createContext();

export function ProfileProvider ({children}){

    const [profile,update,ready,clear ] = useStorage(KEY_PROFILE,null)

    const createProfile = async (user)=>{
        await update(user);
    }

    const clearData = (user)=>{
        clear(user);
    }

    return (
        <ProfileContext.Provider
            value={{
            profile,
            ready,
            createProfile,
            clearData
            }}
        >
            {children}
        </ProfileContext.Provider>
    );
}