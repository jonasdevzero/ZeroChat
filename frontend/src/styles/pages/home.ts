import styled from 'styled-components';

export const Container = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;

    width: 100vw;
    height: 100vh;
`;

export const Form = styled.form`
    display: flex;
    flex-direction: column;
`;

export const Input = styled.input`
    width: 30rem;
    height: 4rem;

    border: solid .1rem #000;
    border-radius: 0;
    padding: 0 1rem;
    margin: 1rem 0;
`;

export const Button = styled.button`
    width: 30rem;
    height: 4rem;

    border: none;
    border-radius: 0;
    background-color: lightgray;

    cursor: pointer;
`;
