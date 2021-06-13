import styled from "styled-components";

export const Container = styled.div`
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    width: 100%;
    height: 100%;

    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    z-index: 100;

    background-color: ${({ theme }) => theme.components.loadingContainer.backgroundColor};

    img {
        width: 12rem;
        height: 12rem;
    };
`;
