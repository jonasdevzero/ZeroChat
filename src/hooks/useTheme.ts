import { useContext, Dispatch, SetStateAction } from 'react'
import Context from '../contexts/theme/context'
import { ThemeType } from '../styles/theme'

function useTheme(): [ThemeType, Dispatch<SetStateAction<ThemeType>>] {
    const { theme, setTheme } = useContext(Context)
    return [theme, setTheme]
}

export default useTheme
