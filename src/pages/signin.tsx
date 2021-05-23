import Head from 'next/head'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import Cookies from 'js-cookie'
import { userService } from '../services'
import { AxiosError } from 'axios'
import { useWarn } from '../hooks'

import { Header, Footer } from '../components'
import {
    Container,
    Inner,
    Form,
    FormTitle,
    InputWrapper,
    Label,
    Input,
    RememberMe,
    Submit,
    Links,
    RedirectLink
} from "../styles/pages/base"

export default function SignIn() {
    const [reference, setReference] = useState('')
    const [password, setPassword] = useState('')
    const [rememberMe, setRememberMe] = useState(true)

    const [loading, setLoading] = useState(true)

    const router = useRouter()
    const warn = useWarn()

    useEffect(() => {
        const token = Cookies.get('token')
        token ? router.push('/chat') : setLoading(false)
    }, [])

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()

        userService.login({ reference, password, rememberMe })
            .then(handleSuccess)
            .catch(handleError)
    }

    function handleSuccess() {
        warn.success('LogIn made with success, redirecting...')
        setTimeout(() => {
            setLoading(true)
            router.push('/chat')
        }, 2500)
    }

    function handleError(error: AxiosError) {
        //...
    }

    return (
        <Container>
            <Head>
                <title>Zero | Sign In</title>
            </Head>

            <Header />

            <Inner>
                <Form onSubmit={handleSubmit}>
                    <FormTitle>Sign In</FormTitle>

                    <InputWrapper>
                        <Label htmlFor='reference'>Username / email</Label>

                        <Input id='reference' type='text' value={reference} onChange={e => setReference(e.target.value)} />
                    </InputWrapper>

                    <InputWrapper>
                        <Label htmlFor='password'>Password</Label>

                        <Input id='password' type='password' value={password} onChange={e => setPassword(e.target.value)} />
                    </InputWrapper>

                    <RememberMe>
                        <input id='remember_me' type='checkbox' checked={rememberMe} onChange={() => setRememberMe(!rememberMe)} />
                        <label htmlFor="remember_me">Remember-me</label>
                    </RememberMe>

                    <Submit>Sign In</Submit>

                    <Links>
                        <Link href='/signup'>
                            <RedirectLink>Not a member?</RedirectLink>
                        </Link>

                        <Link href='/forgotPassword'>
                            <RedirectLink>Forgot Password?</RedirectLink>
                        </Link>
                    </Links>
                </Form>
            </Inner>

            <Footer />
        </Container>
    )
}
