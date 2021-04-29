import styled from "styled-components";

export const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: relative;

    width: 100vw;
    height: 100vh;

    background-color: ${({ theme }) => theme.components.form.containerBackgroundColor};
`;

export const Form = styled.form`
    display: flex;
    flex-direction: column;

    width: 40rem;
    padding: 4rem 3.5rem 3rem 3.5rem;

    background-color: ${({ theme }) => theme.components.form.backgroundColor};
    border-radius: .5rem;
`;

export const TitleContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;

    margin-bottom: 2rem;
    border-bottom: solid .1rem ${({ theme }) => theme.components.form.borderColor};
`;

export const ArrowBackButton = styled.button`
    border: none;
    outline: none;
    background-color: transparent;

    position: absolute;
    top: .7rem;
    left: 0;
    width: max-content;

    .MuiSvgIcon-root {
        cursor: pointer;
        color: ${({ theme }) => theme.components.form.arrowBackColor};
        font-size: 3rem !important;
    };
`;

export const Title = styled.h1`
    align-self: center;
    font-size: 3rem;
    font-weight: 700;
    margin-bottom: 3rem;
`;

export const Wrapper = styled.div`
    position: relative;
    max-width: 100%;
    height: 5.2rem;
    margin-top: 1.5rem;
`;

export const WrapperInputs = styled.div`
    display: flex;

    ${Wrapper} {
        width: 100%;
    };

    ${Wrapper} + ${Wrapper} {
        margin-left: 1rem;
    };
`;

export const Label = styled.label`
    position: absolute;
    bottom: 0rem;
    left: 0rem;

    width: 100%;
    height: 100%;

    pointer-events: none;
    overflow: hidden;
`;

export const Span = styled.span`
    font-size: 1.4rem;
    font-weight: 500;

    position: absolute;
    left: .6rem;
    bottom: 1.6rem;

    transition: all .3s ease;
`;

export const Input = styled.input`
    border: none;
    outline: none;

    height: 100%;
    width: 100%;

    font-size: 1.6rem;
    font-weight: 500;
    color: ${({ theme }) => theme.components.form.input.color};
    background-color: ${({ theme }) => theme.components.form.input.backgroundColor};
    padding: 2rem .6rem 1rem .6rem;
    box-sizing: border-box;

    &:focus + ${Label}  ${Span}, &:valid + ${Label}  ${Span} {
        transform: translateY(-120%);
        font-size: 1.3rem;
        color: ${({ theme }) => theme.components.form.label.span.colorOnFocus};
    };
`;

export const Submit = styled.button`
    margin-top: 2rem;
    height: 5rem;

    border: none;
    outline: none;

    background-color: ${({ theme }) => theme.components.form.submit.backgroundColor};
    color:  ${({ theme }) => theme.components.form.submit.color};
    font-size: 1.6em;
    font-weight: 500;
    transition: opacity .3s ease;

    cursor: pointer;

    &:hover {
        opacity: .9;
    };

    img {
        width: 3rem;
        height: 3rem;
    };
`;

export const Error = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;

    width: 100%;
    height: 5rem;

    background-color: ${({ theme }) => theme.components.form.error.backgroundColor};
    border-radius: .2rem;

    strong {
        font-size: 1.6rem;
        font-weight: 700;
    };
`;

export const Info = styled.p`
    font-size: 1.3rem;
    font-weight: 500;
    align-self: center;
    margin-top: 3rem;

    & + & {
        margin-top: 1rem;
    };
`;

export const StyledLink = styled.a`
    text-decoration: none;
    font-size: 1.3rem;
    cursor: pointer;
    margin-left: .5rem;

    &:hover {
        text-decoration: underline;
    };
`;
