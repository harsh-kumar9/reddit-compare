// src/PostIDContext.js
import React, { createContext, useState } from 'react';

export const PostIDContext = createContext();

export const PostIDProvider = ({ children }) => {
    const [responseID, setResponseID] = useState('');
    const [responseCommentType, setResponseCommentType] = useState('');

    return (
        <PostIDContext.Provider value={{ responseID, setResponseID, responseCommentType, setResponseCommentType }}>
            {children}
        </PostIDContext.Provider>
    );
};
