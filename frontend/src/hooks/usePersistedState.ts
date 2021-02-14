import { useState, useEffect, Dispatch, SetStateAction } from 'react';

type Response<T> = [
    T,
    Dispatch<SetStateAction<T>>
];

function usePersistedState<T>(key: any, initialState: T): Response<T> {
    const [state, setState] = useState<T>(initialState);

    useEffect(() => {
        const storageItem = localStorage.getItem(key);

        if (storageItem) {
            setState(JSON.parse(storageItem));
        } else {
            setState(initialState);
        };
    }, []);

    useEffect(() => {
        localStorage.setItem(key, JSON.stringify(state))
    }, [key, state]);

    return [state, setState];
};

export default usePersistedState;
