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
    flex-direction: column;
    align-items: center;
    justify-content: center;

    background-color: #1d1d1d;

    span {
        font-size: 3.8rem;
        color: #aaa;
        margin-top: 1.5rem;
        margin-bottom: 1rem;
    };

    P  {
        font-size: 1.6rem;
        color: #aaa;

        button {
            background-color: transparent;
            outline: none;
            border: none;
            text-decoration: underline;
            color: #aaa;
            font-size: 1.6rem;
            margin-left: .5rem;
            cursor: pointer;
        };
    };
`;
