import React, { useRef, useCallback, useState, useEffect } from "react"
import { createPortal } from 'react-dom'
import Context from '../contexts/warnContext'

import {
    Container,
    Message,
} from "../styles/components/Warn";

function WarnProvider({ children }) {
    const root = useRef(null)
    const warnContext = useRef(null)
    const [warns, setWarns] = useState([])

    useEffect(() => {
        root.current = document.createElement('div')
        root.current.id = '__WARN__'
        document.body.appendChild(root.current)

        return () => {
            root.current ? document.body.removeChild(root.current) : null
        }
    }, [])

    const show = useCallback((message?: string) => {
        const id = Math.random().toString(36).substr(2)
        console.log('id', id)

        setWarns(state => state.concat('test'))

        // setTimeout(() => {
        //     setWarns([])
        // }, 1500)
    }, [])

    const success = useCallback(() => {

    }, [])

    const error = useCallback(() => {

    }, [])

    const info = useCallback(() => {

    }, [])

    warnContext.current = {
        show,
        success,
        error,
        info
    }

    return (
        <Context.Provider value={warnContext}>
            {children}
            {root.current &&
                createPortal(
                    <>
                        {warns.map((_, i) => {
                            return (
                                <Container key={i}>
                                    <Message>Test {i}</Message>
                                </Container>
                            )
                        })}
                    </>,
                    root.current
                )
            }
            <div></div>
        </Context.Provider>
    )
}

export default WarnProvider;
