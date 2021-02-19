import styled from "styled-components";

export const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;

    width: 100vw;
    height: 100vh;

    background-color: ${({ theme }) => theme.backgroundColor};
`;
