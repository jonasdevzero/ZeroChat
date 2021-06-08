import styled from 'styled-components'

export const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    width: 100%;
    background-color: #151515;
`;

export const Inner = styled.div`
    display: flex;
    align-items: center;
    justify-content: flex-end;
    width: 100%;
    height: 100vh;

    padding: 0 10rem;
`;

export const InnerCenter = styled(Inner)`
    justify-content: center;
`;

export const Form = styled.form`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 33rem;
    min-height: 43rem;
    position: relative;

    background-color: #252525;
    padding: 3rem;
    border-radius: .4rem;
`;

export const FitForm = styled(Form)`
    min-height: fit-content;
`;

export const FormTitle = styled.h1`
    font-size: 3.6rem;
    font-family: 'Red Hat Text', sans-serif;
    font-weight: 400;
    margin-bottom: 2.5rem;
`;

export const FitFormTitle = styled(FormTitle)`
    font-size: 3rem;
`;

export const InputWrapper = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;

    & + & {
        margin-top: 1rem;
    };
`;

export const Label = styled.label`
    font-size: 1.4rem;
    font-family: 'Red Hat Text', sans-serif;
    color: lightgray;
    margin-bottom: .5rem;
`;

export const Input = styled.input`
    width: 100%;
    height: 4.5rem;

    border: none;
    outline: none;
    background-color: #404040;
    padding: 0 .5rem;
    color: #fff;
    border-radius: .4rem;
`;

export const RememberMe = styled.div`
    display: flex;
    align-items: center;
    width: 100%;
    margin-top: 1.5rem;

    input {
        margin-right: .3rem;
        border-radius: .2rem;
        outline: none;
        color: #2e2e2e;
        cursor: pointer;
    };

    label {
        color: lightgray;
        font-family: 'Red Hat Text', sans-serif;
        font-size: 1rem;
    };
`;

export const Submit = styled.button`
    width: 100%;
    height: 4.5rem;
    display: flex;
    align-items: center;
    justify-content: center;

    background-color: #2e2e2e;
    margin-top: .7rem;
    margin-bottom: 3rem;
    border: none;
    outline: none;
    border-radius: .4rem;
    color: #fff;
    font-size: 1.4rem;
    cursor: pointer;

    ${InputWrapper} + & {
        margin-top: 2rem;
    };

    img {
        width: 3.5rem;
        height: 3.5rem;
    };
`;

export const Links = styled.div`
    margin-top: auto;
`;

export const RedirectLink = styled.a`
    font-size: 1.2rem;
    font-family: 'Red Hat Text', sans-serif;
    text-decoration: underline;
    color: lightgray;
    cursor: pointer;

    & + & {
        margin-left: 1rem;
    };
`;

export const ErrorMessage = styled.strong`
    width: 100%;
    height: 4.5rem;
    display: flex;
    align-items: center;
    justify-content: center;

    margin-bottom: 1.5rem;
    border-radius: .4rem;

    background-color: red;
    font-size: 1.6rem;
    font-family: 'Red Hat Text', sans-serif;
    font-weight: 500;
`

export const FormStepProgress = styled.div<{ step: number }>`
    position: absolute;
    left: 0;
    bottom: 0;
    width: ${({ step }) => step === 0 ? '0' : step === 1 ? '50%' : '100%'};
    height: .1rem;
    background-color: #fff;
    transition: width .5s ease-in;
`;

export const FormStepBack = styled.button`
    background-color: transparent;
    border: none;
    outline: none;
    position: absolute;
    bottom: 3rem;
    left: 3.5rem;
    cursor: pointer;

    .MuiSvgIcon-root {
        color: #fff;
    };
`;
