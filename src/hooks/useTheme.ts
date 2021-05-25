import { useMemo, useContext, Dispatch, SetStateAction } from 'react'
import Context from '../contexts/theme/context'
import { ThemeType } from '../styles/theme'

function useTheme(): [ThemeType, Dispatch<SetStateAction<ThemeType>>] {
    const themeContext = useContext(Context)
    const theme = useMemo(() => themeContext.current, [themeContext])

    return theme
}

export default useTheme
