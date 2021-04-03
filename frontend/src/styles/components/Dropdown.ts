import styled from 'styled-components';

const Dropdown: any = styled.div`
    position: absolute;
    left: -11rem;
    width: 15rem;

    padding: .5rem 0;
    background-color: rgba(0, 0, 0, .7);
    z-index: 1000;
`;

Dropdown.Wrapper = styled.div`
    position: relative;
`;

Dropdown.Item = styled.button`
    width: 100%;
    border: none;
    outline: none;

    background-color: transparent;
    color: #fff;
    font-size: 1.4rem;

    padding: 1rem .5rem;
    border-radius: 0;

    transition: background-color .3s ease;
    cursor: pointer;

    &:hover {
        background-color: rgba(0, 0, 0, .9);
    };
`;

export default Dropdown;
