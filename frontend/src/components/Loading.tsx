import {
    Container,
} from "../styles/components/Loading";

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
