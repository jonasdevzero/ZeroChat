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

export const Form = styled.form`
    display: flex;
    flex-direction: column;

    width: 40rem;
    padding: 4rem 3.5rem 3rem 3.5rem;
    margin-top: 5rem;
    margin-bottom: 2rem;

    background-color: ${({ theme }) => theme.form.backgroundColor};
    border-radius: .5rem;
`;

export const TitleContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;

    margin-bottom: 2rem;
    border-bottom: solid .2rem ${({ theme }) => theme.contrastColors.Color1};
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
        color: ${({ theme }) => theme.contrastColors.Color3};
        font-size: 3rem !important;
    };
`;

export const Title = styled.h1`
    align-self: center;
    font-size: 3.5rem;
    font-weight: 700;
    margin-bottom: 3rem;
    color: ${({ theme }) => theme.contrastColors.Color3};
`;

export const Wrapper = styled.div`
    position: relative;
    max-width: 100%;
    height: 5.2rem;
    margin-top: 2rem;
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

    &::after {
        content: "";
        position: absolute;
        left: 0rem;
        bottom: 0rem;

        width: 100%;
        height: 100%;

        border-bottom: solid .2rem #d9d9d9;
        transform: translateX(-100%);
        transition: all .3s ease;
    };
`;

export const Span = styled.span`
    font-size: 1.4rem;
    font-weight: 500;
    color: ${({ theme }) => theme.form.span.color};

    position: absolute;
    left: .4rem;
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
    background-color: ${({ theme }) => theme.form.input.backgroundColor};
    color: ${({ theme }) => theme.contrastColors.Color3};
    padding: 2rem .4rem 1rem .4rem;
    box-sizing: border-box;

    &:focus + ${Label}  ${Span}, &:valid + ${Label}  ${Span} {
        transform: translateY(-120%);
        font-size: 1.3rem;
        color: ${({ theme }) => theme.form.span.onFocus};
    };

    &:focus + ${Label}::after, &:valid + ${Label}::after {
        transform: translateY(0%);
    };
`;

export const Submit = styled.button`
    margin-top: 2rem;
    height: 5rem;

    border: none;
    outline: none;

    background-color: ${({ theme }) => theme.contrastColors.Color4};
    color:  ${({ theme }) => theme.backgroundColor};
    font-weight: 500;
    transition: opacity .3s ease;

    cursor: pointer;

    &:hover {
        opacity: .8;
    };

    img {
        width: 3rem;
        height: 3rem
    };
`;

export const Error = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;

    width: 100%;
    height: 5rem;

    background-color: ${({ theme }) => theme.form.errorColor};
    border-radius: .2rem;

    strong {
        color: #fff;
        font-size: 1.6rem;
        font-weight: 700;
    };
`;

export const Info = styled.p`
    font-size: 1.3rem;
    font-weight: 500;
    align-self: center;
    margin-top: 3rem;
    color: ${({ theme }) => theme.contrastColors.Color3};

    & + & {
        margin-top: 1rem;
    };
`;

export const StyledLink = styled.a`
    text-decoration: none;
    color: ${({ theme }) => theme.contrastColors.Color3};
    font-size: 1.3rem;
    cursor: pointer;
    margin-left: .5rem;

    &:hover {
        text-decoration: underline;
    };
`;
