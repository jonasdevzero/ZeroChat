import React, { useRef, useCallback, useState, useEffect } from "react"
import { createPortal } from 'react-dom'
import Context from './context'

import {
    Item,
    Message,
} from "../../styles/components/Warn";

// Need improvements!
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

    const remove = useCallback(warn => setWarns(state => state.filter(w => w.id !== warn.id)), [])

    const updateOptions = useCallback((warn, where: string, set: any) => setWarns(state => state.map(w => {
        w.id === warn.id ? w.options[where] = set : null
        return w
    })), [])

    const show = useCallback((message: any, options = {}) => {
        const id = Math.random().toString(36).substr(2)

        const warnOptions = {
            type: 'generic',
            loadbar: true,
            fadeOutPreRemove: true,
            autoRemove: true,

            _loadbar: false,
            _fadeOutPreRemove: false,

            ...options
        }

        const warn = {
            id,
            message,
            options: warnOptions,
        }

        setWarns(state => state.concat(warn))

        warnOptions.loadbar ?
            setTimeout(() => updateOptions(warn, '_loadbar', true), 500) : null

        warnOptions.fadeOutPreRemove && warnOptions.autoRemove ?
            setTimeout(() => updateOptions(warn, '_fadeOutPreRemove', true), 2300) : null

        warnOptions.autoRemove ?
            setTimeout(() => remove(warn), 2500) : null

        return warn
    }, [remove, updateOptions])

    const success = useCallback((message: any, options = {}) => {
        options.type = 'success'
        return show(message, options)
    }, [])

    const error = useCallback((message: any, options = {}) => {
        options.type = 'error'
        return show(message, options)
    }, [])

    const info = useCallback((message: any, options = {}) => {
        options.type = 'info'
        return show(message, options)
    }, [])

    warnContext.current = {
        show,
        success,
        error,
        info,
        remove
    }

    return (
        <Context.Provider value={warnContext}>
            {children}
            {root.current &&
                createPortal(
                    <>
                        {warns.map((warn, i) => {
                            return (
                                <Item
                                    key={warn.id}
                                    loadbar={warn.options._loadbar}
                                    position={i + 1}
                                    fadeOutPreRemove={warn.options._fadeOutPreRemove}
                                >
                                    <Message>{warn.message}</Message>
                                </Item>
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
