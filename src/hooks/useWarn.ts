import { useContext, useMemo } from 'react'
import Context from '../contexts/warnContext'

interface WarnI {
    show(): void
    success(): void
    error(): void
    info(): void
}

export default function useWarn() {
    const  warnContext = useContext(Context)
    const warn: WarnI = useMemo(() => warnContext.current, [warnContext])

    return warn
}
