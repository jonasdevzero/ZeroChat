import React, { useMemo, useContext } from 'react'
import Context from '../contexts/theme/context'

function useTheme(): ['light' | 'dark', React.Dispatch<React.SetStateAction<'light' | 'dark'>>] {
    const themeContext = useContext(Context)
    const theme = useMemo(() => themeContext.current, [themeContext])

    return theme
}

export default useTheme
