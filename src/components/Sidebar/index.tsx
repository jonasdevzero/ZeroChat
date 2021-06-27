import { useState } from "react"

import { Options, Header, Rooms, Notifications } from './components'
import { Container, Inner } from "../../styles/components/Sidebar"

export default function Sidebar() {
    const [optionSelected, setOptionSelected] = useState('contacts')

    return (
        <Container>
            <Options setOptionSelected={setOptionSelected} />

            <Inner>
                <Header optionSelected={optionSelected} />
                {optionSelected === 'notifications' ? (<Notifications />) : (<Rooms roomsType={optionSelected} />)}
            </Inner>
        </Container>
    )
}
