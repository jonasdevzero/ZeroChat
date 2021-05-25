import { useTheme } from '../hooks'

import { Container } from "../styles/components/LoadingContainer"

export default function Loading() {
    const [theme] = useTheme()

    return (
        <Container>
            <img src={`/loading-${theme === "dark" ? "light" : "dark"}.svg`} alt="loading"/>
        </Container>
    )
}
