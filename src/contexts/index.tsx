import { ThemeProvider } from 'styled-components'
import Themes from '../styles/theme'
import { Provider as ReduxProvider } from 'react-redux'
import MyThemeProvider from './theme/Provider'
import WarnProvider from './warn/Provider'
import store from '../store'
import { usePersistedState } from '../hooks'

function Providers({ children }) {
    const [theme, setTheme] = usePersistedState<'light' | 'dark'>('theme', 'dark')

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
