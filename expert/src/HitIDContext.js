// src/HitIDContext.js
import React, { createContext, useState } from 'react';

// Create the HitID context
export const HitIDContext = createContext();

// Create the provider component
export const HitIDProvider = ({ children }) => {
    const [hitID, setHitID] = useState('');

    return (
        <HitIDContext.Provider value={{ hitID, setHitID }}>
            {children}
        </HitIDContext.Provider>
    );
};
