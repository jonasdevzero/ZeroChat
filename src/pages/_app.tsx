import GlobalStyle from '../styles/global'
import { ThemeProvider } from 'styled-components'
import Themes from '../styles/theme'
import { Provider } from 'react-redux'
import store from '../store'
import { usePersistedState } from '../hooks'

function MyApp({ Component, pageProps }) {
    const [theme, setTheme] = usePersistedState('theme', 'dark')

    return (
        <ThemeProvider theme={Themes[theme]}>
            <GlobalStyle />
            <Provider store={store}>
                <Component {...pageProps} theme={theme} setTheme={setTheme} />
            </Provider>
        </ThemeProvider>
    );
};

export default MyApp;
