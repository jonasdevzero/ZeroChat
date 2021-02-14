import styled from 'styled-components';

export const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`;

export const MessagesContainer = styled.div`
    width: 50rem;
    height: 40rem;

    border: solid .1rem #000;

    display: flex;
    flex-direction: column;
    margin-top: 5rem;
`;

export const Message = styled.p`
    margin: 2rem;
    font-size: 1.6rem;
`;


export const Form = styled.form`

`;

export const Input = styled.input`
    width: 45rem;
    height: 4rem;

    padding: 0 1rem;
    border: solid .1rem #000;
    border-radius: none;
`;

export const Submit = styled.button`
    width: 5rem;
    height: 4rem;

    border: solid .1rem #000;
    border-radius: 0;

    cursor: pointer;
    background-color: lightgray;
`;
