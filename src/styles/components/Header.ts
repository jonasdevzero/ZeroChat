import styled from 'styled-components'

export const Container = styled.header`
    width: 100%;
    height: fit-content;

    display: flex;
    align-items: center;
    justify-content: space-between;
    position: absolute;
    top: 0;
    padding: 3rem 6rem;
    z-index: 1;
`
export const Logo = styled.a`
    font-size: 4.8rem;
    font-family: 'Noto Sans', sans-serif;
    font-weight: 700;
    margin-left: 2rem;
    cursor: pointer;
`

export const StyledLink = styled.a`
    font-size: 2.4rem;
    font-weight: 400;
    font-family: 'Noto Sans', sans-serif;

    line-height: 2rem;
    text-decoration: none;

    padding: .9rem 2rem;
    border-radius: .3rem;
    cursor: pointer;

    & + & {
        margin-left: 2.5rem;
    };
    &:hover {
        text-decoration: underline;
    };
`
