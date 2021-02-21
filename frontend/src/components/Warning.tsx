import { useState, useEffect } from "react";

import {
    Container,
    Message,
} from "../styles/components/Warning";

interface WarningI {
    showWarning: boolean;
    children?: React.ReactChild;
};

function Warning({ showWarning, children }: WarningI) {
    const [show, setShow] = useState(false);
    const [load, setLoad] = useState(false);

    useEffect(() => {
        if (showWarning) {
            setShow(true);

            setTimeout(() => {
                setLoad(true);
            }, 300);

            setTimeout(() => {
                setShow(false);

                setTimeout(() => {
                    setLoad(false);
                }, 400);
            }, 1800);
        };
    }, [showWarning]);

    return (
        <Container show={show} load={load}>
            <Message>{children}</Message>
        </Container>
    )
}

export default Warning;
