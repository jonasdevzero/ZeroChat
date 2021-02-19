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
    position: absolute;
    top: ${({ show }) => show ? "2rem" : "-10.5rem"};
    right: 5rem;

    transition: top .5s ease;

    width: 23rem;
    height: 10.5rem;

    background-color: ${({ theme }) => theme.contrastColors.Color4};
    color: ${({ theme }) => theme.contrastColors.Color2};

    border-radius: .3rem;
    overflow: hidden;

    &::after {
        content: "";
        position: absolute;
        top: -.3rem;
        right: ${({ load }) => load ? "0rem" : "23rem"};
        transition: right 1.5s ease;

        width: 23rem;
        height: 10.5rem;
        border-bottom: solid .3rem #6CFA66;
    };
`;

export const Message = styled.p`
    font-size: 1.5rem;
    font-weight: 500;
    text-align: center;

    padding: 0 2rem;
`;
