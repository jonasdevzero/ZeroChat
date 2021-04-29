import styled from 'styled-components';

export const Container = styled.main`
    display: flex;
    width: 100vw;
    height: 100vh;
`;

export const Inner = styled.div`
    display: flex;
    flex-direction: column;
    flex: .75;
    height: 100vh;

    position: relative;
`;

export const ContainerWithoutChat = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;

    background-color: #303030;
`;
