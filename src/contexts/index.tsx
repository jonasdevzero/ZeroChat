import { ThemeProvider } from 'styled-components'
import { Provider as ReduxProvider } from 'react-redux'
import MyThemeProvider from './theme/Provider'
import WarnProvider from './warn/Provider'
import store from '../store'
import Themes, { ThemeType, allowedThemes } from '../styles/theme'
import { usePersistedState } from '../hooks'

function Providers({ children }) {
    const [theme, setTheme] = usePersistedState<ThemeType>('theme', 'dark', allowedThemes)

    return (
        <ThemeProvider theme={Themes['dark']}>
            <ReduxProvider store={store}>
                <MyThemeProvider themeConfig={{ theme, setTheme }}>
                    <WarnProvider>{children}</WarnProvider>
                </MyThemeProvider>
            </ReduxProvider>
        </ThemeProvider>
    )
}

export default Providers
