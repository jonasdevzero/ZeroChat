import styled from 'styled-components'

export const Container = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
`
export const Item = styled.div`
    display: flex;
    padding: .5rem;
    position: relative;

    & + & {
        margin-top: .7rem;
    };

    .MuiAvatar-root {
        width: 5rem;
        height: 5rem;
    };
`

export const Text = styled.p`
    margin-top: 1.2rem;
    margin-left: 1rem;
    font-size: 1.4rem;
    color: #eee;
    width: 100%;
`

export const Time = styled.span`
    color: #aaa;
    font-size: 1rem;
    position: absolute;
    bottom: 0;
    right: 0;
`
