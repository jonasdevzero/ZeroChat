import GlobalStyle from '../styles/global';
import { ThemeProvider } from 'styled-components';
import usePersistedState from '../hooks/usePersistedState';
import { light, dark } from '../styles/theme';

function MyApp({ Component, pageProps }) {
    const [theme, setTheme] = usePersistedState<"light" | "dark">("theme", "dark");

    return (
        <ThemeProvider theme={theme === 'light' ? light : dark}>
            <GlobalStyle />
                <Component
                    {...pageProps}
                    theme={theme}
                    setTheme={setTheme}
                />
        </ThemeProvider>
    );
};

export default MyApp;
