import GlobalStyle from '../styles/global'
import { ThemeProvider } from 'styled-components'
import Themes from '../styles/theme'
import { Provider } from 'react-redux'
import store from '../store'
import { usePersistedState } from '../hooks'
import { WarnProvider } from '../contexts'

function MyApp({ Component, pageProps }) {
    const [theme, setTheme] = usePersistedState<'light' | 'dark'>('theme', 'dark')

    return (
        <ThemeProvider theme={Themes[theme]}>
            <GlobalStyle />
            <Provider store={store}>
                <WarnProvider>
                    <Component {...pageProps} theme={theme} setTheme={setTheme} />
                </WarnProvider>
            </Provider>
        </ThemeProvider>
    );
};

export default MyApp;
