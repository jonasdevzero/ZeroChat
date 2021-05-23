import styled from 'styled-components'

export const Container = styled.div`
    width: 100%;
    min-height: 100vh;
    height: 100%;
    position: absolute;
`
export const CloseButton = styled.button`
    position: fixed;
    top: 1.5rem;
    right: 3rem;

    border: none;
    outline: none;
    background-color: transparent;
    cursor: pointer;
    z-index: 1;

    .MuiSvgIcon-root {
        color: #fff;
    };
`
