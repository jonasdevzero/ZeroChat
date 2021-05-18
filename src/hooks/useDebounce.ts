import { useEffect, EffectCallback, DependencyList  } from 'react';

export default function useDebounce(fn: EffectCallback, deps: DependencyList, time: number = 500) {
    useEffect(() => {
        const timeout = setTimeout(() => fn(), time);

        return () => clearTimeout(timeout);
    }, deps);
};
