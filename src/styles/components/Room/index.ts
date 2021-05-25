import styled from "styled-components";

export const Container = styled.div`
    display: flex;
    height: 100vh;
    width: 100%;
    max-width: 75vw;
`;

export const Inner = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    position: relative;
`;

export const ContainerWithoutChat = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;

    background-color: #1d1d1d;
`;
