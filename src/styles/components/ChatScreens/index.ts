import styled from 'styled-components'

export const Container = styled.div`
    width: 100%;
    min-height: 100vh;
    height: 100%;
    position: absolute;
    background-color: #1d1d1d;
    overflow-y: scroll;
    padding: 0 13rem;

    @keyframes fade {
        0% {
            opacity: .5;
        }
        100% {
            opacity: 1;
        }
    }

    animation-name: fade;
    animation-duration: .3s;
`

export const Header = styled.header`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 2em 6rem;
    border-bottom: solid .1rem #aaa;
    margin-bottom: 5rem;

    .MuiSvgIcon-root {
        font-size: 3.2rem;
    };
`

export const Title = styled.h1`
    color: #aaa;
    font-size: 3.6rem;
    font-weight: 400;
`

export const Close = styled.button`
    border: none;
    outline: none;
    background-color: transparent;
    cursor: pointer;
    z-index: 1;

    .MuiSvgIcon-root {
        color: #aaa;
    };
`

export const Content = styled.div`

`
