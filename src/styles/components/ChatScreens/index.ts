import styled from 'styled-components'

export const Container = styled.div`
    width: 100%;
    min-height: 100vh;
    max-height: 100vh;
    position: absolute;
    background-color: #1d1d1d;
    overflow-y: scroll;

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
