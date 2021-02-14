import GlobalStyle from '../styles/global';
import { ThemeProvider } from 'styled-components';
import usePersistedState from '../hooks/usePersistedState';

function MyApp({ Component, pageProps }) {
    const [theme, setTheme] = usePersistedState<"light" | "dark">("theme", "light")

    return (
        <ThemeProvider theme={theme}>
            <GlobalStyle />
            <Component {...pageProps} />
        </ThemeProvider>
    );
};

export default MyApp;
