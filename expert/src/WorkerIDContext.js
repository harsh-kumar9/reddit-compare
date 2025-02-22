import React, { createContext, useState } from 'react';

export const WorkerIDContext = createContext();

export const WorkerIDProvider = ({ children }) => {
    const [workerID, setWorkerID] = useState('');

    return (
        <WorkerIDContext.Provider value={{ workerID, setWorkerID }}>
            {children}
        </WorkerIDContext.Provider>
    );
};
