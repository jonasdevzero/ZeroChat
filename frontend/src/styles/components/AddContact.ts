import styled from "styled-components";

export const Form = styled.form`
    width: 100%;
    padding: 0 2rem 2rem 2rem;
    position: relative;

    border-bottom: solid .1rem #777;
`;

export const Input = styled.input`
    width: 100%;
    height: 3.5rem;

    padding: 0 3.3rem 0 1rem;
    border: none;
    outline: none;
    border-radius: .7rem;

    color: lightgray;
    background-color: #353535;
`;

export const Submit = styled.button`
    position: absolute;
    top: .6rem;
    right: 2.9rem;

    border: none;
    outline: none;
    background-color: transparent;

    & > .MuiSvgIcon-root {
        font-size: 2.2rem;
        color: lightgray;
        cursor: pointer;
    };
`;

export const Contacts = styled.div`
    display: flex;
    flex-direction: column;

    width: 100%;
    max-height: 30rem;
    margin-top: 3rem;
    padding: 0 2rem;

    overflow-y: scroll;
`;

export const Contact = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;

    margin-bottom: .2rem;
    padding: 1rem;
    border-radius: .3rem;

    background-color: #333;
    transition: background-color .3s ease;

    cursor: pointer;

    p {
        margin-left: .7rem;
        font-size: 1.6rem;
    };

    &:hover {
        background-color: #303030;
    };
`;

export const WrapperAvatar = styled.div`
    display: flex;
    align-items: center;
`;

export const NotFound = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;

    width: 100%;
    height: 6rem;

    strong {
        color: lightgray;
        font-size: 2rem;
    };
`;

export const Initial = styled(NotFound)``;
