import { useState } from 'react'
import { useWarn } from '../hooks'

function Test() {
    const [warnIndex, setWarnIndex] = useState(1)
    const warn = useWarn()

    function createWarn() {
        warn.show(`${warnIndex}`)
        setWarnIndex(1 + warnIndex)
    }

    return (
        <div>
            <ul>
                <li>
                    <button onClick={() => createWarn()}>show</button>
                </li>
                <li>
                    <button onClick={() => warn.success('success')}>success</button>
                </li>
                <li>
                    <button onClick={() => warn.error('error')}>error</button>
                </li>
                <li>
                    <button onClick={() => warn.info('info')}>info</button>
                </li>
            </ul>
        </div>
    )
}

export default Test
