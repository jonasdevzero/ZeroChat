import Context from './context'

interface MyThemeProviderI {
    children: React.ReactChild
    themeConfig: {
        theme: 'light' | 'dark',
        setTheme: React.Dispatch<React.SetStateAction<'light' | 'dark'>>
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
