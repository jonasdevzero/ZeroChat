import styled from "styled-components";

interface ContainerI {
    show: boolean;
    load: boolean;
};

export const Container = styled.div<ContainerI>`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    position: fixed;
    top: ${({ show }) => show ? "2rem" : "-12rem"};
    right: 5rem;

    transition: top .5s ease;

    width: 25rem;
    height: 12rem;

    background-color: #1f1f1f;
    color: #fff;

    border-radius: .3rem;
    overflow: hidden;

    &::after {
        content: "";
        position: absolute;
        top: -.3rem;
        right: ${({ load }) => load ? "0rem" : "25rem"};
        transition: right 1.5s ease;

        width: 25rem;
        height: 12rem;
        border-bottom: solid .3rem #6CFA66;
    };
`;

export const Message = styled.p`
    font-size: 1.6rem;
    font-weight: 500;
    text-align: center;

    padding: 0 2rem;
`;
