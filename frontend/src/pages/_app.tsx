import GlobalStyle from '../styles/global';
import { ThemeProvider } from 'styled-components';
import { useState } from 'react';
import usePersistedState from '../hooks/usePersistedState';
import { light, dark } from '../styles/theme';

interface User {
    id: number;
    name: string;
    username: string;
    email: string;
    picture: string;
};

function MyApp({ Component, pageProps }) {
    const [theme, setTheme] = usePersistedState<"light" | "dark">("theme", "light");
    const [token, setToken] = usePersistedState("token", "");
    const [user, setUser] = useState<User | undefined>()

    return (
        <ThemeProvider theme={theme === 'light' ? light : dark}>
            <GlobalStyle />
            <Component
                {...pageProps}
                token={token}
                setToken={setToken}
                user={user}
                setUser={setUser}
            />
        </ThemeProvider>
    );
};

export default MyApp;
