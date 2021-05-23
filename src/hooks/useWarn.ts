import { useContext, useMemo } from 'react'
import Context from '../contexts/warn/context'

interface WarnOptionsI {
    autoRemove?: boolean
    loadbar?: boolean
    fadeOutPreRemove?: boolean
}

interface WarnI {
    id: string;
    message: any;
    options: any;
}

interface UseWarnI {
    show(message: string, options?: WarnOptionsI): WarnI
    success(message: string, options?: WarnOptionsI): WarnI
    error(message: string, options?: WarnOptionsI): WarnI
    info(message: string, options?: WarnOptionsI): WarnI
    remove(warn: WarnI): void
}

export default function useWarn() {
    const  warnContext = useContext(Context)
    const warn: UseWarnI = useMemo(() => warnContext.current, [warnContext])

    return warn
}
