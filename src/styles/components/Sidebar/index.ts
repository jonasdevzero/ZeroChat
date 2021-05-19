import styled from "styled-components";

export const Container = styled.aside`
    display: flex;
    flex: .25;
    height: 100vh;

    position: relative;
`;

export const Options = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;

    height: 100%;
    min-width: 7rem;
    padding: 1rem 0;

    background-color: #101010;
`;

export const User = styled.div`
    width: 5rem;
    cursor: pointer;
    padding-bottom: 1rem;
    margin-bottom: 1.5rem;
    border-bottom: solid .2rem #202020;

    .MuiAvatar-root {
        width: 5rem;
        height: 5rem;
    };
`;

export  const OptionsInner = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow: scroll;

    &::-webkit-scrollbar {
        width: 0;
    };
`;

export const Option = styled.button`
    width: 4.5rem;
    min-height: 4.5rem;

    border: none;
    outline: none;
    border-radius: 50%;

    background-color: #202020;
    cursor: pointer;

    .MuiSvgIcon-root {
        color: #fff;
        font-size: 2.5rem;
    };

    & + & {
        margin-top: 2rem;
    };
`;

export const OptionsPlus = styled.div`
    width: 5rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 1.5rem;
    margin-top: 1.5rem;
    border-top: solid .2rem #202020;

    ${Option} + ${Option} {
        margin-top: 1.5rem;
    };
`;

export const Inner = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    padding: 0 1.5rem;
    background-color: #151515;
`;


