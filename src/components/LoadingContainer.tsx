import {
    Container,
} from "../styles/components/LoadingContainer";

interface LoadingI {
    theme: "light" | "dark";
};

export default function Loading({ theme }: LoadingI) {
    return (
        <Container>
            <img src={`/loading-${theme === "dark" ? "light" : "dark"}.svg`} alt="loading"/>
        </Container>
    );
};
