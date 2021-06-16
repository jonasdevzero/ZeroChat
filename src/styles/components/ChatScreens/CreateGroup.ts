import styled from "styled-components"

export const Content = styled.main`
    width: 55rem;
    margin: 2.5rem auto;
    padding: 3.5rem;
    border-radius: .7rem;
`

export const Form = styled.form`
    display: flex;
    flex-direction: column;
    align-items: center;

    padding: 4rem;

    background-color: #171717;
    border-radius: 1rem;
`

export const Error = styled.strong`
    display: flex;
    align-items: center;
    justify-content: center;

    height: 4rem;
    width: 100%;

    font-size: 1.5rem;
    background-color: red;
    margin-bottom: 2rem;
    border-radius: .7rem;
`

export const Fieldset = styled.fieldset`
    width: 100%;
    border: none;

    & + & {
        margin-top: 3rem;
    };
`

export const Legend = styled.legend`
    width: 100%;
    font-size: 2.5rem;

    margin-bottom: 2rem;
    padding: 0 0 1rem 1.5rem;
    border-bottom: solid .2rem #252525;
`

export const Label = styled.label`
    display: flex;
    align-items: center;

    color: lightgray;
    font-size: 1.4rem;
    margin-bottom: .5rem;

    .MuiSvgIcon-root {
        margin-left: .5rem;
        cursor: pointer;
    };
`

export const Input = styled.input`
    height: 4.5rem;
    width: 100%;

    border: none;
    border-radius: .7rem;
    outline: none;

    padding: 0 .7rem;

    font-size: 1.4rem;
    color: lightgray;
    background-color: #202020;
`

export const InputIcon = styled.button`
    position: absolute;
    right: 0;
    top: 50%;
    transform: translateY(-50%);

    background-color: transparent;
    margin-right: 1rem;
    border: none;
    outline: none;
    cursor: pointer;

    .MuiSvgIcon-root {
        color: lightgray;
        font-size: 2.3rem;
    };
`

export const TextArea = styled.textarea`
    background-color: #202020;
    color: lightgray;
    font-size: 1.6rem;

    min-height: 8rem;
    max-height: 12rem;

    padding: 1rem;
    border: none;
    outline: none;
    border-radius: .7rem;
    resize: vertical;
`

export const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    position: relative;

    width: 100%;

    &.row {
        flex-direction: row;
        align-items: center;
    };

    &.m-left {
        margin-left: 1rem;
    };

    & + & {
        margin-top: 1.5rem;
    };
`

export const Submit = styled.button`
    height: 4rem;

    color: #fff;
    font-size: 1.4rem;
    background-color: #222;

    padding: .5rem 2rem;
    border: none;
    border-radius: .7rem;
    outline: none;
    cursor: pointer;

    & > img {
        width: 3rem;
        height: 3rem;
    };
`

export const SearchContacts = styled.div`
    width: 100%;
    height: 4rem;
    position: relative;

    margin-bottom: 1rem;
`

export const Contacts = styled.div`
    width: 100%;
    position: absolute;

    background-color: rgba(0, 0, 0, .3);
    border-radius: .7rem;

    max-height: 20rem;
    overflow-y: scroll;
    z-index: 1;
`

export const Contact = styled.div`
    display: flex;
    align-items: center;

    width: 100%;
    height: 6rem;

    padding: 1rem;

    cursor: pointer;
    transition: background-color .2s ease;

    p {
        font-size: 1.4rem;
        margin-left: 1rem;
    };

    .MuiAvatar-root {
        width: 4.5rem;
        height: 4.5rem;
    };

    &:hover {
        background-color: rgba(0, 0, 0, .4);
    };
`

export const Members = styled.div`
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    width: 100%;
    min-height: 10rem;
    max-height: 30rem;

    background-color: #202020;
    padding: 1rem;
    margin-bottom: 3rem;
    border-radius: .7rem;
    overflow-y: scroll;
`

export const Member = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: relative;

    width: 8rem;
    height: 8rem;

    padding: .5rem;
    margin: .2rem;

    background-color: #2e2e2e;
    border-radius: .7rem;

    span {
        font-size: 1.3rem;
        margin-top: .5rem;
    };

    .MuiAvatar-root {
        width: 4.5rem;
        height: 4.5rem;
    };
`

export const RemoveMember = styled.button`
    position: absolute;
    top: .2rem;
    right: .2rem;

    background-color: transparent;
    border: none;
    outline: none;
    cursor: pointer;

    .MuiSvgIcon-root {
        color: #fff;
        font-size: 1.7rem;
    };
`

export const WithoutMembers = styled.span`
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.6rem;
    font-weight: 500;
    color: lightgray;
`
