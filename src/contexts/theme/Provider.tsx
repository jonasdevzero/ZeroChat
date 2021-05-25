import Context from './context'
import { ThemeType } from '../../styles/theme'

interface MyThemeProviderI {
    children: React.ReactChild
    themeConfig: {
        theme: ThemeType,
        setTheme: React.Dispatch<React.SetStateAction<ThemeType>>
    }
}

function MyThemeProvider({ children, themeConfig }: MyThemeProviderI) {
    return (
        <Context.Provider value={themeConfig}>
            {children}
        </Context.Provider>
    )
}

export default MyThemeProvider
