import {
    Container,
    Message,
} from "../styles/components/ScreenMessage";

interface ScreenMessageI {
    show: boolean;
    load: boolean;
    children?: React.ReactChild;
};

function ScreenMessage({ show, load, children }: ScreenMessageI) {
    return (
        <Container show={show} load={load}>
            <Message>{children}</Message>
        </Container>
    )
}

export default ScreenMessage;
