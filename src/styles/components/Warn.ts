import styled from "styled-components";

export const Container = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    position: fixed;
    top: 2rem;
    right: 5rem;

    transition: top .5s ease;

    width: 25rem;
    height: 12rem;
    padding: 1rem;

    background-color: ${({ theme }) => theme.components.warning.backgroundColor};

    border-radius: .3rem;
    overflow: hidden;

    &::after {
        content: "";
        position: absolute;
        top: -.3rem;
        right: 0;
        transition: right 1.5s ease;

        width: 25rem;
        height: 12rem;
        border-bottom: solid .3rem ${({ theme }) => theme.components.warning.loadingBarColor};
    };
`;

export const Message = styled.p`
    font-size: 1.4rem;
    font-weight: 400;
    text-align: center;
`;
