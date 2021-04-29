import styled from "styled-components";

export const Container = styled.div`
    position: fixed;
    width: 100%;
    height: 100%;

    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;

    background-color: ${({ theme }) => theme.components.loadingContainer.backgroundColor};

    img {
        width: 12rem;
        height: 12rem;
    };
`;
